from sqlalchemy import Column, String, Float, Boolean, DateTime, Text
from datetime import datetime
from database import Base

class ComplaintModel(Base):
    __tablename__ = "complaints"

    # Identifiers & Raw Citizen Input
    id = Column(String, primary_key=True, index=True) # e.g., "cmp_12345"
    citizen_id = Column(String, index=True)
    description = Column(Text, nullable=False)
    
    # Location (for GIS Map - Member 4)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address_context = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    image_url = Column(String, nullable=True)

    # AI Enrichment Data (from Member 1)
    category = Column(String, nullable=True)
    department_routing = Column(String, nullable=True)
    priority_score = Column(Float, nullable=True)
    urgency = Column(String, nullable=True) # e.g., "HIGH", "MEDIUM", "LOW"

    # Duplicate Detection Data (from Member 1)
    is_duplicate = Column(Boolean, default=False)
    cluster_id = Column(String, index=True, nullable=True)
    similarity_score = Column(Float, nullable=True)
    parent_complaint_id = Column(String, nullable=True)

    # Status tracking for Dashboard (Member 3)
    status = Column(String, default="UNASSIGNED") # UNASSIGNED, IN_PROGRESS, RESOLVED
    # Inside models.py, add this column to ComplaintModel:
    image_url = Column(String, nullable=True)