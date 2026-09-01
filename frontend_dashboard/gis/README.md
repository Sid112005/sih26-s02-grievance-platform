# GIS Hotspot Detection Module — Member 4 (GIS & Map Specialist)

## Module Location
`frontend_dashboard/gis/`

## What This Module Contains

| File | Purpose |
|------|---------|
| `hotspot_engine.py` | Core GIS engine — DBSCAN clustering, Haversine distance, risk scoring (0–100), temporal evolution, proximity zone analysis |
| `server.py` | Standalone FastAPI GIS microservice exposing all spatial endpoints |
| `generate_demo.py` | Precomputes `demo_bundle.json` and `hotspots.geojson` from the complaints dataset |
| `frontend/dashboard.html` | Full Leaflet dashboard — Street/Satellite/Hybrid basemaps, heatmap, cluster markers, hotspot polygons, proximity tool, explainability modal |
| `complaints.json` | 91 Mumbai citizen grievance records (seed data) |
| `demo_bundle.json` | Precomputed snapshot: 3 detected hotspots across Andheri East, Bandra West, Malad West |
| `hotspots.geojson` | GeoJSON feature collection of hotspot boundary polygons |
| `tests/test_hotspot_engine.py` | 17 unit tests — all passing |

## Running Locally (Standalone)

```bash
pip install fastapi uvicorn scikit-learn
cd frontend_dashboard/gis
python -m uvicorn server:app --host 127.0.0.1 --port 8000
```

Open: http://127.0.0.1:8000 (dashboard) | http://127.0.0.1:8000/docs (API)

## Key API Endpoints

| Endpoint | Description |
|----------|------------|
| `GET /api/gis/hotspots` | All detected hotspots (supports `?category=`, `?priority=`, `?days=`) |
| `GET /api/gis/hotspots/geojson` | GeoJSON FeatureCollection of hotspot boundaries |
| `GET /api/gis/complaints` | Filtered complaint records |
| `GET /api/gis/heatmap` | Weighted lat/lng points for heatmap layer |
| `GET /api/gis/statistics` | System-wide counts: total, mapped, unmapped, unresolved, hotspot count |
| `GET /api/gis/proximity?lat=&lon=&radius_m=` | Spatial zone query: all complaints within a radius |
| `GET /api/gis/search?q=` | Location name search (Mumbai gazetteer) |

## ⚠️ PORT COLLISION — NEEDS TEAM DECISION BEFORE FINAL INTEGRATION

> **This GIS engine currently runs as a standalone FastAPI service on port 8000 for local testing.**
>
> **This WILL collide with Member 5's main backend service, which also runs on port 8000.**
>
> **Do NOT run both services simultaneously until resolved.**

### Two options — team to decide:

**Option A — Run GIS on a different port (quick fix)**
```bash
# Change server.py startup port to 8001
uvicorn server:app --host 127.0.0.1 --port 8001
```
Frontend dashboard must then point to `http://localhost:8001/api/gis/...`.

**Option B — Import GIS logic directly into Member 5's backend (recommended for production)**
```python
# In Member 5's FastAPI app, add:
from frontend_dashboard.gis.hotspot_engine import build_hotspots, calculate_proximity_zone
# Mount the GIS router or call engine functions directly
```
This eliminates the separate server entirely and keeps a single process.

> **Flagging for team discussion. NOT resolving unilaterally.**

---

## How Priority Score is Calculated (Explainable AI)

| Factor | Weight | Rationale |
|--------|--------|-----------|
| Density | 25% | Volume of complaints in the spatial cluster |
| Priority / Severity | 35% | Proportion of High & Critical severity complaints |
| Recency Velocity | 15% | Recent 7-day influx vs historical baseline |
| Persistence | 10% | Unresolved complaint ratio |
| Semantic Concentration | 15% | Shared root-cause clusters (duplicate detection) |
| Emerging Boost | +5–10 pts | For rapidly escalating hotspots (>+50% growth) |

Score range: 0–100. Labels: Low (0–30), Medium (31–60), High (61–80), Critical (81–100).

---

## Merging Notes for Team

- This module is **fully self-contained** — it does not import from or write to any other member's files.
- `frontend/dashboard.html` is a **standalone prototype** and is NOT a replacement for Member 3's authority dashboard. It should be merged/embedded as a GIS component by Member 3 when ready.
- The `data/` folder in the repo root contains Member 1's `synthetic_complaints.json` (350 records). The `complaints.json` in this folder is a **91-record Mumbai seed dataset** used for GIS testing — both can coexist; production should use the shared dataset.
- For final integration, replace `complaints.json` in this module with a reference to the shared `data/synthetic_complaints.json`.

---

*Module built by: Member 4 (GIS & Map Specialist) — Branch: `feat/gis-map`*
