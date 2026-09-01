"""
Civic Signal — FastAPI GIS Intelligence Server for Mumbai
SIH Hackathon Edition: Real-time Hotspot Detection, Spatial Proximity Queries,
Date Filtering, Coordinate Validation, and Single Source of Truth APIs.
"""

import datetime as dt
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse

from hotspot_engine import (
    HotspotConfig,
    build_hotspots,
    calculate_proximity_zone,
    filter_by_date_range,
    filter_valid_complaints,
    haversine_m,
    hotspots_to_feature_collection,
    validate_coordinates,
    MUMBAI_INFRASTRUCTURE,
)

BASE_DIR = Path(__file__).parent
COMPLAINTS_FILE = BASE_DIR / "complaints.json"
DASHBOARD_FILE = BASE_DIR / "frontend" / "dashboard.html"

app = FastAPI(
    title="Civic Signal — Municipal GIS Hotspot Intelligence API",
    description="AI-powered citizen grievance hotspot classification, prioritization, and spatial intelligence for Mumbai",
    version="2.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_complaints_data() -> List[Dict[str, Any]]:
    if COMPLAINTS_FILE.exists():
        with open(COMPLAINTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "civic-signal-gis",
        "city": "Mumbai",
        "version": "2.1.0",
        "data_source": "Municipal Grievance Ingestion Database",
        "verified_location": "Mumbai, Maharashtra, India",
    }


@app.get("/", response_class=HTMLResponse)
def serve_dashboard():
    if DASHBOARD_FILE.exists():
        with open(DASHBOARD_FILE, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read(), status_code=200)
    return HTMLResponse(content="<h1>Dashboard file not found</h1>", status_code=404)


@app.get("/demo_bundle.json")
def get_demo_bundle_file():
    bundle_file = BASE_DIR / "demo_bundle.json"
    if bundle_file.exists():
        return FileResponse(bundle_file, media_type="application/json")
    raise HTTPException(status_code=404, detail="demo_bundle.json not found")


@app.get("/api/gis/hotspots")
def list_hotspots(
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    days: Optional[int] = Query(None),
    min_score: Optional[float] = Query(None),
    eps_m: float = Query(600.0),
    min_samples: int = Query(3),
    min_complaints: int = Query(5),
):
    raw = load_complaints_data()
    mapped, _ = filter_valid_complaints(raw)
    complaints = mapped

    if days:
        complaints = filter_by_date_range(complaints, days_window=days)
    if category and category.lower() != "all":
        complaints = [c for c in complaints if c.get("category", "").lower() == category.lower()]
    if priority and priority.lower() != "all":
        complaints = [c for c in complaints if c.get("priority", "").lower() == priority.lower()]
    if status and status.lower() != "all":
        complaints = [c for c in complaints if c.get("status", "").lower() == status.lower()]

    config = HotspotConfig(
        eps_m=eps_m,
        min_samples=min_samples,
        min_complaints_for_hotspot=min_complaints,
    )
    hotspots = build_hotspots(complaints, config=config)
    if min_score is not None:
        hotspots = [h for h in hotspots if h.get("risk_score", 0) >= min_score]
    return hotspots


@app.get("/api/gis/hotspots/geojson")
def get_hotspots_geojson(
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    days: Optional[int] = Query(None),
):
    hotspots = list_hotspots(category=category, priority=priority, days=days)
    return hotspots_to_feature_collection(hotspots)


@app.get("/api/gis/hotspots/{hotspot_id}")
def get_hotspot_detail(hotspot_id: str):
    hotspots = list_hotspots()
    for h in hotspots:
        if h.get("hotspot_id", "").lower() == hotspot_id.lower():
            return h
    raise HTTPException(status_code=404, detail=f"Hotspot {hotspot_id} not found")


@app.get("/api/gis/hotspots/{hotspot_id}/trend")
def get_hotspot_trend(hotspot_id: str):
    h = get_hotspot_detail(hotspot_id)
    return {
        "hotspot_id": h["hotspot_id"],
        "growth_pct": h["growth_pct"],
        "growth_label": h["growth_label"],
        "recent_count": h["recent_count"],
        "baseline_count": h["baseline_count"],
        "timeline": h.get("timeline", []),
        "status": h["growth_label"],
    }


@app.get("/api/gis/hotspots/{hotspot_id}/recommendation")
def get_hotspot_recommendation(hotspot_id: str):
    h = get_hotspot_detail(hotspot_id)
    return {
        "hotspot_id": h["hotspot_id"],
        "recommended_action": h["recommended_action"],
        "primary_department": h["primary_department"],
        "secondary_departments": h["secondary_departments"],
        "risk_score": h["risk_score"],
        "risk_label": h["risk_label"],
        "intervention_impact": h.get("intervention_impact", {}),
    }


@app.get("/api/gis/complaints")
def list_complaints(
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    days: Optional[int] = Query(None),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    radius_km: Optional[float] = Query(None),
    limit: int = Query(1000),
    offset: int = Query(0),
):
    raw = load_complaints_data()
    mapped, unmapped = filter_valid_complaints(raw)
    complaints = mapped

    if days:
        complaints = filter_by_date_range(complaints, days_window=days)

    filtered = []
    for c in complaints:
        if category and category.lower() != "all" and c.get("category", "").lower() != category.lower():
            continue
        if priority and priority.lower() != "all" and c.get("priority", "").lower() != priority.lower():
            continue
        if status and status.lower() != "all" and c.get("status", "").lower() != status.lower():
            continue
        if lat is not None and lon is not None and radius_km is not None:
            dist_m = haversine_m(lat, lon, float(c["latitude"]), float(c["longitude"]))
            if dist_m > radius_km * 1000.0:
                continue
        filtered.append(c)

    return filtered[offset : offset + limit]


@app.get("/api/gis/proximity")
def proximity_analysis(
    lat: float = Query(...),
    lon: float = Query(...),
    radius_m: float = Query(500.0),
):
    if not validate_coordinates(lat, lon):
        raise HTTPException(status_code=400, detail="Invalid coordinates")
    complaints = load_complaints_data()
    return calculate_proximity_zone(complaints, lat, lon, radius_m)


@app.get("/api/gis/heatmap")
def get_heatmap(
    category: Optional[str] = Query(None),
    days: Optional[int] = Query(None),
):
    complaints = list_complaints(category=category, days=days, limit=2000)
    points = []
    for c in complaints:
        intensity = (c.get("severity", 3)) / 5.0
        p = c.get("priority", "Medium")
        if p == "Critical":
            intensity = 1.0
        elif p == "High":
            intensity = 0.8
        points.append({
            "lat": float(c["latitude"]),
            "lng": float(c["longitude"]),
            "intensity": intensity,
        })
    return points


@app.get("/api/gis/statistics")
def get_statistics(days: Optional[int] = Query(None)):
    raw = load_complaints_data()
    mapped, unmapped = filter_valid_complaints(raw)
    complaints = mapped
    if days:
        complaints = filter_by_date_range(complaints, days_window=days)

    config = HotspotConfig()
    hotspots = build_hotspots(complaints, config=config)

    cat_totals = {}
    pri_totals = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
    status_totals = {"Pending": 0, "In Progress": 0, "Resolved": 0}

    for c in complaints:
        cat = c.get("category", "General")
        cat_totals[cat] = cat_totals.get(cat, 0) + 1
        p = c.get("priority", "Medium")
        if p in pri_totals:
            pri_totals[p] += 1
        st = c.get("status", "Pending")
        if st in status_totals:
            status_totals[st] += 1

    unresolved = sum(1 for c in complaints if c.get("status") in ("Pending", "In Progress", None))
    resolved = sum(1 for c in complaints if c.get("status") == "Resolved")
    top_hotspot = hotspots[0]["hotspot_id"] if hotspots else None
    avg_risk = round(sum(h["risk_score"] for h in hotspots) / max(len(hotspots), 1), 1)

    return {
        "total_complaints": len(raw),
        "mapped_complaints": len(mapped),
        "unmapped_complaints": len(unmapped),
        "active_filtered_complaints": len(complaints),
        "unresolved_complaints": unresolved,
        "resolved_complaints": resolved,
        "total_hotspots": len(hotspots),
        "category_totals": cat_totals,
        "priority_totals": pri_totals,
        "status_totals": status_totals,
        "highest_risk_hotspot": top_hotspot,
        "avg_risk_score": avg_risk,
        "last_updated": dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
    }


@app.get("/api/gis/search")
def search_locations(q: str = Query(...)):
    query = q.strip().lower()
    results = []
    for item in MUMBAI_INFRASTRUCTURE:
        if query in item["name"].lower():
            results.append({
                "name": item["name"],
                "type": item["type"],
                "latitude": item["lat"],
                "longitude": item["lon"],
            })
    return results


@app.post("/api/gis/hotspots/recompute")
def recompute_hotspots():
    complaints = load_complaints_data()
    hotspots = build_hotspots(complaints)
    return {
        "status": "success",
        "hotspots_detected": len(hotspots),
        "top_hotspot": hotspots[0]["hotspot_id"] if hotspots else None,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
