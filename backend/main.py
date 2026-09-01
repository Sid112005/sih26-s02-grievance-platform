from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.middleware.cors import CORSMiddleware
import httpx
import uuid
from datetime import datetime

# Import from your local files
from database import engine, get_db
import models
import schemas

# Automatically create tables on startup (if not already created)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Grievance Platform - Core API",
    description="Backend API for managing citizen intake, AI routing, and dashboard analytics.",
    version="1.0"
)

# --- ADD THIS CORS CONFIGURATION ---
origins = [
    "http://localhost:5173",  # Vite / React dev server
    "http://localhost:3000",  # Alternative frontend port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Configuration for Member 1's AI Service URL (adjust port if needed later)
AI_SERVICE_URL = "http://localhost:8001/api/v1/classify"


@app.post("/api/v1/complaints", status_code=201)
async def submit_complaint(payload: schemas.ComplaintCreateSchema, db: Session = Depends(get_db)):
    # Generate a unique complaint ID
    complaint_id = f"cmp_{uuid.uuid4().hex[:8]}"
    
    # 1. Save initial raw record to PostgreSQL database (including the image URL from JSON)
    new_complaint = models.ComplaintModel(
        id=complaint_id,
        citizen_id=payload.citizen_id,
        description=payload.description,
        lat=payload.location.lat,
        lng=payload.location.lng,
        address_context=payload.location.address_context,
        image_url=payload.image_url,  # <-- Captured directly from the JSON string payload
        timestamp=payload.timestamp or datetime.utcnow(),
        status="UNASSIGNED"
    )
    db.add(new_complaint)
    db.commit()

    # 2. Forward description to Member 1's AI Service via HTTPX
    ai_data = {}
    async with httpx.AsyncClient() as client:
        try:
            ai_response = await client.post(
                AI_SERVICE_URL, 
                json={"complaint_id": complaint_id, "description": payload.description},
                timeout=10.0
            )
            if ai_response.status_code == 200:
                ai_data = ai_response.json()
        except httpx.RequestError:
            # Fallback handling if AI service is temporarily offline during testing
            ai_data = {
                "ai_classification": {"category": "Unclassified", "department_routing": "General", "priority_score": 5.0, "urgency": "MEDIUM"},
                "duplicate_detection": {"is_duplicate": False, "cluster_id": None, "similarity_score": 0.0, "parent_complaint_id": None}
            }

    # 3. Extract AI payload data and update the database record
    classification = ai_data.get("ai_classification", {})
    duplicate_info = ai_data.get("duplicate_detection", {})

    new_complaint.category = classification.get("category")
    new_complaint.department_routing = classification.get("department_routing")
    new_complaint.priority_score = classification.get("priority_score")
    new_complaint.urgency = classification.get("urgency")
    
    new_complaint.is_duplicate = duplicate_info.get("is_duplicate", False)
    new_complaint.cluster_id = duplicate_info.get("cluster_id")
    new_complaint.similarity_score = duplicate_info.get("similarity_score")
    new_complaint.parent_complaint_id = duplicate_info.get("parent_complaint_id")

    db.commit()
    db.refresh(new_complaint)

    # 4. Return success confirmation
    return {
        "status": "success",
        "message": "Complaint successfully submitted, processed by AI, and routed.",
        "complaint_id": complaint_id,
        "assigned_department": new_complaint.department_routing,
        "image_url": new_complaint.image_url
    }


# 1. GIS Hotspot Endpoint (For Member 4 & Dashboard)
@app.get("/api/v1/clusters", response_model=list[schemas.ClusterResponseSchema])
def get_cluster_hotspots(db: Session = Depends(get_db)):
    # Query database, group by cluster_id to aggregate statistics for the map
    results = db.query(
        models.ComplaintModel.cluster_id,
        models.ComplaintModel.category,
        models.ComplaintModel.status,
        func.count(models.ComplaintModel.id).label("total_complaints"),
        func.avg(models.ComplaintModel.priority_score).label("avg_priority"),
        func.avg(models.ComplaintModel.lat).label("center_lat"),
        func.avg(models.ComplaintModel.lng).label("center_lng")
    ).group_by(
        models.ComplaintModel.cluster_id,
        models.ComplaintModel.category,
        models.ComplaintModel.status
    ).all()

    clusters = []
    for row in results:
        clusters.append({
            "cluster_id": row.cluster_id or f"single_{uuid.uuid4().hex[:6]}",
            "category": row.category or "General",
            "total_complaints": row.total_complaints,
            "avg_priority": round(row.avg_priority, 1) if row.avg_priority else 5.0,
            "status": row.status or "UNASSIGNED",
            "center_coordinates": {
                "lat": float(row.center_lat) if row.center_lat else 0.0,
                "lng": float(row.center_lng) if row.center_lng else 0.0
            }
        })
    
    return clusters


# 2. Authority Dashboard Complaints List Endpoint (For Member 3)
@app.get("/api/v1/admin/complaints")
def get_admin_complaints(db: Session = Depends(get_db)):
    # Fetch all complaints sorted by newest first
    complaints = db.query(models.ComplaintModel).order_by(models.ComplaintModel.timestamp.desc()).all()
    
    return {
        "total_count": len(complaints),
        "complaints": [
            {
                "complaint_id": c.id,
                "citizen_id": c.citizen_id,
                "description": c.description,
                "location": {"lat": c.lat, "lng": c.lng, "address_context": c.address_context},
                "image_url": c.image_url,
                "classification": {
                    "category": c.category,
                    "department_routing": c.department_routing,
                    "priority_score": c.priority_score,
                    "urgency": c.urgency
                },
                "duplicate_info": {
                    "is_duplicate": c.is_duplicate,
                    "cluster_id": c.cluster_id,
                    "similarity_score": c.similarity_score
                },
                "status": c.status,
                "timestamp": c.timestamp.isoformat() if c.timestamp else None
            }
            for c in complaints
        ]
    }