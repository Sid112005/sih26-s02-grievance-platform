from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Structure for incoming complaint from Member 2 (Flutter App)
class LocationSchema(BaseModel):
    lat: float
    lng: float
    address_context: Optional[str] = None

class ComplaintCreateSchema(BaseModel):
    citizen_id: str
    description: str
    location: LocationSchema
    timestamp: Optional[datetime] = None
    image_url: Optional[str] = None


# Structure for data sent to/from Member 1's AI Service
class AIResponseSchema(BaseModel):
    complaint_id: str
    ai_classification: dict
    duplicate_detection: dict

# Structure for dashboard response to Members 3 & 4
class ClusterResponseSchema(BaseModel):
    cluster_id: str
    category: str
    total_complaints: int
    avg_priority: float
    status: str
    center_coordinates: dict