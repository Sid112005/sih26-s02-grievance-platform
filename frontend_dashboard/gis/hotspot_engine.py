"""
Civic Signal — Municipal Spatial Intelligence & Hotspot Engine (Mumbai)
SIH Hackathon Edition: Single Source of Truth, Validated Coordinates,
Temporal Evolution Timelines, Spatial Proximity Queries, and Transparent Priority Scoring.
"""

from dataclasses import dataclass, field
import datetime as dt
import math
from typing import Any, Dict, List, Optional, Tuple

EARTH_RADIUS_M = 6371000.0

# Verified real-world Mumbai geographic landmarks and critical infrastructure
MUMBAI_INFRASTRUCTURE = [
    {"name": "Andheri Railway Station (Western / Harbour Line)", "type": "railway_station", "lat": 19.1197, "lon": 72.8464},
    {"name": "Bandra Railway Station (Western Line)", "type": "railway_station", "lat": 19.0544, "lon": 72.8402},
    {"name": "Dadar Central / Western Junction Station", "type": "railway_station", "lat": 19.0178, "lon": 72.8478},
    {"name": "Malad Railway Station (Western Line)", "type": "railway_station", "lat": 19.1860, "lon": 72.8488},
    {"name": "Kurla Junction Railway Station", "type": "railway_station", "lat": 19.0657, "lon": 72.8794},
    {"name": "Powai Lake", "type": "water_body", "lat": 19.1278, "lon": 72.9044},
    {"name": "Vihar Lake", "type": "water_body", "lat": 19.1465, "lon": 72.9138},
    {"name": "Tulsi Lake", "type": "water_body", "lat": 19.1822, "lon": 72.9189},
    {"name": "Arabian Sea Coastline (Bandra Bandstand / Carter Rd)", "type": "coastline", "lat": 19.0596, "lon": 72.8197},
    {"name": "Bandra-Worli Sea Link (Rajiv Gandhi Sea Link)", "type": "bridge_highway", "lat": 19.0365, "lon": 72.8173},
    {"name": "Western Express Highway (WEH)", "type": "highway", "lat": 19.1150, "lon": 72.8550},
    {"name": "Eastern Express Highway (EEH)", "type": "highway", "lat": 19.0720, "lon": 72.9000},
    {"name": "Chhatrapati Shivaji Maharaj International Airport (T2)", "type": "airport", "lat": 19.0896, "lon": 72.8656},
    {"name": "Sanjay Gandhi National Park (SGNP)", "type": "park_reserve", "lat": 19.2288, "lon": 72.9182},
]

DEPARTMENT_MAP = {
    "Road": ("Roads & Infrastructure", ["Traffic Police / Transport", "Stormwater Drainage"]),
    "Drainage": ("Water & Sewerage", ["Waste Management", "Public Health"]),
    "Garbage": ("Waste Management (SWM)", ["Public Health", "Pollution Control"]),
    "Streetlight": ("Electrical / Energy", ["Roads & Infrastructure", "Public Safety"]),
    "Water": ("Water Supply Department", ["Water & Sewerage", "Public Health"]),
    "Electricity": ("Electrical / Power Distribution", ["Public Safety", "Disaster Management"]),
    "Traffic": ("Traffic Police / Transport", ["Roads & Infrastructure", "Municipal Corporation"]),
    "Public Safety": ("Disaster Management & Public Safety", ["Police Department", "Fire Services"]),
}


@dataclass
class HotspotConfig:
    eps_m: float = 600.0
    min_samples: int = 3
    min_complaints_for_hotspot: int = 5
    recent_days: int = 7
    baseline_days: int = 7


def validate_coordinates(lat: Any, lon: Any) -> bool:
    """Validate latitude and longitude ranges strictly."""
    if lat is None or lon is None:
        return False
    try:
        f_lat, f_lon = float(lat), float(lon)
        if math.isnan(f_lat) or math.isnan(f_lon) or math.isinf(f_lat) or math.isinf(f_lon):
            return False
        return -90.0 <= f_lat <= 90.0 and -180.0 <= f_lon <= 180.0
    except (ValueError, TypeError):
        return False


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate Great-Circle distance in meters between two lat/lon points."""
    if lat1 == lat2 and lon1 == lon2:
        return 0.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return EARTH_RADIUS_M * c


def _parse_timestamp(ts: Any) -> dt.datetime:
    if isinstance(ts, dt.datetime):
        return ts
    if isinstance(ts, str):
        try:
            return dt.datetime.fromisoformat(ts.replace("Z", "+00:00")).replace(tzinfo=None)
        except Exception:
            return dt.datetime(2026, 9, 1, 10, 0, 0)
    return dt.datetime(2026, 9, 1, 10, 0, 0)


def filter_valid_complaints(complaints: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """Separate complaints into mapped (valid coordinates) and unmapped records."""
    mapped, unmapped = [], []
    for c in complaints:
        if validate_coordinates(c.get("latitude"), c.get("longitude")):
            mapped.append(c)
        else:
            unmapped.append(c)
    return mapped, unmapped


def filter_by_date_range(
    complaints: List[Dict[str, Any]],
    start_date: Optional[dt.datetime] = None,
    end_date: Optional[dt.datetime] = None,
    days_window: Optional[int] = None,
    now: Optional[dt.datetime] = None,
) -> List[Dict[str, Any]]:
    """Filter complaints based on a time window or date range."""
    ref_now = now or dt.datetime(2026, 9, 1, 10, 0, 0)
    if days_window is not None and days_window > 0:
        start_date = ref_now - dt.timedelta(days=days_window)
        end_date = ref_now

    if not start_date and not end_date:
        return complaints

    filtered = []
    for c in complaints:
        ts = _parse_timestamp(c.get("timestamp"))
        if start_date and ts < start_date:
            continue
        if end_date and ts > end_date:
            continue
        filtered.append(c)
    return filtered


def cluster_complaints(complaints: List[Dict[str, Any]], config: Optional[HotspotConfig] = None) -> List[List[Dict[str, Any]]]:
    """
    DBSCAN spatial clustering on complaints using Haversine distance.
    Returns a list of clusters (each cluster is a list of complaint dicts).
    """
    cfg = config or HotspotConfig()
    valid_complaints, _ = filter_valid_complaints(complaints)
    n = len(valid_complaints)
    if n == 0:
        return []

    neighbors: List[List[int]] = [[] for _ in range(n)]
    for i in range(n):
        lat1, lon1 = float(valid_complaints[i]["latitude"]), float(valid_complaints[i]["longitude"])
        for j in range(i, n):
            lat2, lon2 = float(valid_complaints[j]["latitude"]), float(valid_complaints[j]["longitude"])
            d = haversine_m(lat1, lon1, lat2, lon2)
            if d <= cfg.eps_m:
                neighbors[i].append(j)
                if i != j:
                    neighbors[j].append(i)

    visited = [False] * n
    cluster_ids = [-1] * n
    current_cluster_id = 0

    for i in range(n):
        if visited[i]:
            continue
        visited[i] = True
        pts = list(neighbors[i])

        if len(pts) >= cfg.min_samples:
            cluster_ids[i] = current_cluster_id
            k = 0
            while k < len(pts):
                pt = pts[k]
                if not visited[pt]:
                    visited[pt] = True
                    pt_neighbors = neighbors[pt]
                    if len(pt_neighbors) >= cfg.min_samples:
                        for neighbor in pt_neighbors:
                            if neighbor not in pts:
                                pts.append(neighbor)
                if cluster_ids[pt] == -1:
                    cluster_ids[pt] = current_cluster_id
                k += 1
            current_cluster_id += 1

    clusters_dict: Dict[int, List[Dict[str, Any]]] = {}
    for i, cid in enumerate(cluster_ids):
        if cid != -1:
            clusters_dict.setdefault(cid, []).append(valid_complaints[i])

    return list(clusters_dict.values())


def _convex_hull_2d(points: List[Tuple[float, float]]) -> List[Tuple[float, float]]:
    """Monotone chain 2D convex hull algorithm. points: list of (lon, lat) tuples."""
    pts = sorted(set(points))
    if len(pts) <= 1:
        return pts

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)

    upper = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)

    hull = lower[:-1] + upper[:-1]
    if hull and hull[0] != hull[-1]:
        hull.append(hull[0])
    return hull


def _generate_circle_polygon(center_lat: float, center_lon: float, radius_m: float, num_points: int = 16) -> List[List[float]]:
    """Generate circular polygon coordinates [lon, lat] for GeoJSON."""
    r = max(radius_m, 120.0)
    coords = []
    lat_r = math.radians(center_lat)
    for i in range(num_points):
        angle = 2.0 * math.pi * i / num_points
        d_lat = (r * math.cos(angle)) / 111320.0
        d_lon = (r * math.sin(angle)) / (111320.0 * math.cos(lat_r))
        coords.append([round(center_lon + d_lon, 6), round(center_lat + d_lat, 6)])
    coords.append(coords[0])
    return coords


def _find_nearby_infrastructure(center_lat: float, center_lon: float, max_dist_km: float = 3.5) -> List[Dict[str, Any]]:
    """Find verified Mumbai infrastructure within proximity without inferring fake causation."""
    results = []
    for item in MUMBAI_INFRASTRUCTURE:
        dist_m = haversine_m(center_lat, center_lon, item["lat"], item["lon"])
        dist_km = round(dist_m / 1000.0, 2)
        if dist_km <= max_dist_km:
            results.append({
                "name": item["name"],
                "type": item["type"],
                "distance_km": dist_km,
                "description": f"{item['name']} is located {dist_km} km from the hotspot centroid.",
            })
    results.sort(key=lambda x: x["distance_km"])
    return results


def build_hotspot_timeline(cluster_complaints: List[Dict[str, Any]], num_buckets: int = 4) -> List[Dict[str, Any]]:
    """Generate temporal progression timeline across discrete time intervals."""
    if not cluster_complaints:
        return []
    timestamps = [_parse_timestamp(c.get("timestamp")) for c in cluster_complaints]
    t_min, t_max = min(timestamps), max(timestamps)
    if t_min == t_max:
        return [{"label": t_min.strftime("%b %d"), "count": len(cluster_complaints), "unresolved": sum(1 for c in cluster_complaints if c.get("status") != "Resolved")}]

    total_seconds = max((t_max - t_min).total_seconds(), 1.0)
    bucket_delta = total_seconds / num_buckets
    buckets = []
    for i in range(num_buckets):
        b_start = t_min + dt.timedelta(seconds=i * bucket_delta)
        b_end = t_min + dt.timedelta(seconds=(i + 1) * bucket_delta)
        matched = [c for c in cluster_complaints if b_start <= _parse_timestamp(c.get("timestamp")) <= b_end]
        label = f"{b_start.strftime('%b %d')} - {b_end.strftime('%b %d')}"
        unres = sum(1 for c in matched if c.get("status") in ("Pending", "In Progress", None))
        buckets.append({
            "label": label,
            "count": len(matched),
            "unresolved": unres,
            "resolved": len(matched) - unres,
        })
    return buckets


def calculate_intervention_impact(cluster_complaints: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate before vs after intervention resolution statistics from actual data."""
    total = len(cluster_complaints)
    if total == 0:
        return {"total": 0, "resolved": 0, "unresolved": 0, "resolution_rate_pct": 0.0, "impact_summary": "Insufficient data"}

    resolved = sum(1 for c in cluster_complaints if c.get("status") == "Resolved")
    unresolved = total - resolved
    rate = round((resolved / total) * 100.0, 1)

    if rate >= 70.0:
        summary = f"High resolution efficiency: {resolved} of {total} grievances ({rate}%) addressed."
    elif rate >= 30.0:
        summary = f"Moderate resolution progress: {resolved} resolved, {unresolved} pending field intervention."
    else:
        summary = f"Immediate municipal intervention required: {unresolved} of {total} grievances ({100.0 - rate}%) remain unresolved."

    return {
        "total": total,
        "resolved": resolved,
        "unresolved": unresolved,
        "resolution_rate_pct": rate,
        "impact_summary": summary,
    }


def calculate_proximity_zone(
    complaints: List[Dict[str, Any]],
    center_lat: float,
    center_lon: float,
    radius_m: float = 500.0,
) -> Dict[str, Any]:
    """Perform spatial-radius proximity analysis around any coordinate."""
    valid_complaints, _ = filter_valid_complaints(complaints)
    in_zone = []
    for c in valid_complaints:
        d = haversine_m(center_lat, center_lon, float(c["latitude"]), float(c["longitude"]))
        if d <= radius_m:
            c_copy = dict(c)
            c_copy["distance_m"] = round(d, 1)
            in_zone.append(c_copy)

    in_zone.sort(key=lambda x: x["distance_m"])
    unresolved = sum(1 for c in in_zone if c.get("status") in ("Pending", "In Progress", None))
    cat_counts: Dict[str, int] = {}
    for c in in_zone:
        cat = c.get("category", "General")
        cat_counts[cat] = cat_counts.get(cat, 0) + 1

    dominant = max(cat_counts, key=cat_counts.get) if cat_counts else "None"
    critical_count = sum(1 for c in in_zone if c.get("priority") == "Critical")
    high_count = sum(1 for c in in_zone if c.get("priority") == "High")

    return {
        "center": {"latitude": center_lat, "longitude": center_lon},
        "radius_m": radius_m,
        "total_complaints": len(in_zone),
        "unresolved_complaints": unresolved,
        "dominant_category": dominant,
        "category_breakdown": cat_counts,
        "critical_count": critical_count,
        "high_priority_count": high_count,
        "complaints": in_zone,
    }


def build_hotspots(
    complaints: List[Dict[str, Any]],
    config: Optional[HotspotConfig] = None,
    now: Optional[dt.datetime] = None,
) -> List[Dict[str, Any]]:
    """Build structured, explainable hotspots from a validated complaint list."""
    cfg = config or HotspotConfig()
    ref_now = now or dt.datetime(2026, 9, 1, 10, 0, 0)

    valid_complaints, _ = filter_valid_complaints(complaints)
    if not valid_complaints:
        return []

    clusters = cluster_complaints(valid_complaints, cfg)
    hotspots = []

    for idx, cluster in enumerate(clusters):
        count = len(cluster)
        if count < cfg.min_complaints_for_hotspot:
            continue

        lats = [float(c["latitude"]) for c in cluster]
        lons = [float(c["longitude"]) for c in cluster]
        c_lat = sum(lats) / count
        c_lon = sum(lons) / count

        distances = [haversine_m(c_lat, c_lon, lat, lon) for lat, lon in zip(lats, lons)]
        radius_m = round(max(distances) if distances else 0.0, 1)

        cat_counts: Dict[str, int] = {}
        for c in cluster:
            cat = c.get("category", "General")
            cat_counts[cat] = cat_counts.get(cat, 0) + 1

        sorted_cats = sorted(cat_counts.items(), key=lambda x: x[1], reverse=True)
        dominant_category = sorted_cats[0][0] if sorted_cats else "General"
        category_breakdown = [
            {"category": cat, "count": cnt, "pct": round((cnt / count) * 100.0, 1)}
            for cat, cnt in sorted_cats
        ]

        pri_counts = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
        for c in cluster:
            p = c.get("priority", "Medium")
            if p in pri_counts:
                pri_counts[p] += 1
            else:
                pri_counts["Medium"] += 1

        high_priority_count = pri_counts["High"] + pri_counts["Critical"]
        critical_count = pri_counts["Critical"]

        severities = [c.get("severity", 3) for c in cluster]
        avg_severity = round(sum(severities) / count, 1)

        sem_counts: Dict[str, int] = {}
        for c in cluster:
            sem_id = c.get("semantic_cluster_id") or c.get("duplicate_group_id")
            if sem_id:
                sem_counts[sem_id] = sem_counts.get(sem_id, 0) + 1

        similar_complaint_count = sum(
            1 for c in cluster if (c.get("semantic_cluster_id") or c.get("duplicate_group_id"))
        )
        unique_underlying_issues = max(len(sem_counts), 1) if sem_counts else count

        recent_cutoff = ref_now - dt.timedelta(days=cfg.recent_days)
        baseline_cutoff = ref_now - dt.timedelta(days=cfg.recent_days + cfg.baseline_days)

        recent_count = 0
        baseline_count = 0
        timestamps = []

        for c in cluster:
            ts = _parse_timestamp(c.get("timestamp"))
            timestamps.append(ts)
            if ts >= recent_cutoff:
                recent_count += 1
            elif baseline_cutoff <= ts < recent_cutoff:
                baseline_count += 1

        if baseline_count > 0:
            growth_pct = round(((recent_count - baseline_count) / baseline_count) * 100.0, 1)
        else:
            growth_pct = 100.0 if recent_count >= 3 else 0.0

        if growth_pct >= 50.0:
            growth_label = "Rapidly emerging hotspot"
        elif growth_pct <= -20.0:
            growth_label = "Declining hotspot"
        elif baseline_count > 0 and abs(growth_pct) <= 20.0:
            growth_label = "Persistent / stable hotspot"
        else:
            growth_label = "Emerging hotspot"

        unresolved_count = sum(1 for c in cluster if c.get("status") in ("Pending", "In Progress", None))

        # Explainable Priority Score Formula (0-100)
        density_score = min(count / 30.0, 1.0) * 25.0
        priority_score = min((pri_counts["High"] * 2.0 + pri_counts["Critical"] * 3.0) / max(count, 1) / 3.0, 1.0) * 20.0
        severity_score = (avg_severity / 5.0) * 15.0
        recency_score = (recent_count / max(count, 1)) * 15.0
        persistence_score = (unresolved_count / max(count, 1)) * 10.0
        similarity_score = min(similar_complaint_count / max(count, 1), 1.0) * 15.0

        raw_score = density_score + priority_score + severity_score + recency_score + persistence_score + similarity_score
        if growth_pct > 100:
            raw_score += 10.0
        elif growth_pct > 50:
            raw_score += 5.0

        risk_score = round(min(100.0, max(0.0, raw_score)), 1)
        if risk_score >= 81.0:
            risk_label = "Critical"
        elif risk_score >= 61.0:
            risk_label = "High"
        elif risk_score >= 31.0:
            risk_label = "Medium"
        else:
            risk_label = "Low"

        dept_info = DEPARTMENT_MAP.get(dominant_category, ("Municipal Administration", ["Public Works"]))
        primary_department = dept_info[0]
        secondary_departments = dept_info[1]

        rec_templates = {
            "Road": "Prioritize road inspection and repair.",
            "Drainage": "Inspect drainage/sewer network for blockage or damage.",
            "Garbage": "Increase waste collection frequency in this area.",
            "Streetlight": "Prioritize electrical inspection and streetlight maintenance.",
            "Water": "Inspect water supply pipeline and check for distribution leaks.",
            "Electricity": "Inspect transformer and electrical distribution lines.",
            "Traffic": "Deploy traffic management team and assess signal timings.",
            "Public Safety": "Escalate for civic safety inspection and patrol coverage.",
        }
        rec = rec_templates.get(dominant_category, f"Conduct prioritized inspection for {dominant_category} issues.")
        if growth_pct >= 50.0:
            rec += " Growth rate indicates an emerging issue — escalate priority."
        if similar_complaint_count >= 5:
            rec += f" {similar_complaint_count} semantically related complaints confirm a concentrated root cause."

        points_lonlat = [(lon, lat) for lon, lat in zip(lons, lats)]
        unique_pts = set(points_lonlat)

        if len(unique_pts) >= 3:
            hull = _convex_hull_2d(points_lonlat)
            if len(hull) >= 4:
                poly_coords = [[round(p[0], 6), round(p[1], 6)] for p in hull]
            else:
                poly_coords = _generate_circle_polygon(c_lat, c_lon, max(radius_m, 150.0))
        else:
            poly_coords = _generate_circle_polygon(c_lat, c_lon, max(radius_m, 150.0))

        hotspot_id = f"H{idx + 1:02d}"
        nearby_infra = _find_nearby_infrastructure(c_lat, c_lon)
        timeline = build_hotspot_timeline(cluster)
        intervention_impact = calculate_intervention_impact(cluster)

        first_ts = min(timestamps).isoformat() if timestamps else ref_now.isoformat()
        latest_ts = max(timestamps).isoformat() if timestamps else ref_now.isoformat()

        boundary_geojson = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [poly_coords],
            },
            "properties": {
                "hotspot_id": hotspot_id,
                "score": risk_score,
                "complaint_count": count,
                "dominant_category": dominant_category,
                "risk_label": risk_label,
            },
        }

        hotspots.append({
            "hotspot_id": hotspot_id,
            "centroid": {
                "latitude": c_lat,
                "longitude": c_lon,
            },
            "radius_m": radius_m,
            "complaint_count": count,
            "category_breakdown": category_breakdown,
            "dominant_category": dominant_category,
            "priority_breakdown": pri_counts,
            "high_priority_count": high_priority_count,
            "critical_count": critical_count,
            "avg_severity": avg_severity,
            "similar_complaint_count": similar_complaint_count,
            "unique_underlying_issues": unique_underlying_issues,
            "recent_count": recent_count,
            "baseline_count": baseline_count,
            "growth_pct": growth_pct,
            "growth_label": growth_label,
            "unresolved_count": unresolved_count,
            "risk_score": risk_score,
            "risk_label": risk_label,
            "score_components": {
                "density": round(density_score, 1),
                "priority": round(priority_score, 1),
                "severity": round(severity_score, 1),
                "recency": round(recency_score, 1),
                "persistence": round(persistence_score, 1),
                "similarity": round(similarity_score, 1),
            },
            "primary_department": primary_department,
            "secondary_departments": secondary_departments,
            "recommended_action": rec,
            "first_reported": first_ts,
            "latest_reported": latest_ts,
            "boundary_geojson": boundary_geojson,
            "complaint_ids": [c.get("complaint_id", f"C{i}") for i, c in enumerate(cluster)],
            "nearby_infrastructure": nearby_infra,
            "timeline": timeline,
            "intervention_impact": intervention_impact,
        })

    hotspots.sort(key=lambda h: h["risk_score"], reverse=True)
    for i, h in enumerate(hotspots):
        h["hotspot_id"] = f"H{i + 1:02d}"
        h["boundary_geojson"]["properties"]["hotspot_id"] = h["hotspot_id"]

    return hotspots


def hotspots_to_feature_collection(hotspots: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Convert hotspot list to GeoJSON FeatureCollection."""
    features = []
    for h in hotspots:
        features.append(h["boundary_geojson"])
    return {
        "type": "FeatureCollection",
        "features": features,
    }
