"""
test_hotspot_engine.py
Automated test suite for Civic Signal Hotspot Engine.
Run with: python test_hotspot_engine.py
"""
import datetime as dt
import math

from hotspot_engine import (
    haversine_m, cluster_complaints, build_hotspots, HotspotConfig,
    hotspots_to_feature_collection, validate_coordinates,
    filter_valid_complaints, filter_by_date_range,
    calculate_proximity_zone, build_hotspot_timeline,
    calculate_intervention_impact
)

NOW = dt.datetime(2026, 9, 1, 10, 0, 0)


def complaint(cid, lat, lon, category="Road", priority="Medium", severity=3,
              days_ago=1, status="Pending", sem_id=None):
    return {
        "complaint_id": cid,
        "description": "test complaint",
        "category": category,
        "priority": priority,
        "severity": severity,
        "latitude": lat,
        "longitude": lon,
        "timestamp": (NOW - dt.timedelta(days=days_ago)).isoformat(),
        "status": status,
        "semantic_cluster_id": sem_id,
    }


def test_haversine_known_distance():
    d = haversine_m(0.0, 0.0, 1.0, 0.0)
    assert 110_000 < d < 112_000


def test_haversine_zero_distance():
    assert haversine_m(19.12, 72.85, 19.12, 72.85) == 0.0


def test_coordinate_validation():
    assert validate_coordinates(19.12, 72.85) is True
    assert validate_coordinates(-90.0, 180.0) is True
    assert validate_coordinates(91.0, 72.85) is False
    assert validate_coordinates(19.12, 181.0) is False
    assert validate_coordinates(None, 72.85) is False
    assert validate_coordinates("invalid", 72.85) is False


def test_filter_valid_complaints():
    raw = [
        complaint("C1", 19.12, 72.85),
        complaint("C2", None, 72.85),
        complaint("C3", 95.0, 72.85),
    ]
    mapped, unmapped = filter_valid_complaints(raw)
    assert len(mapped) == 1
    assert len(unmapped) == 2


def test_empty_input_returns_no_hotspots():
    assert build_hotspots([]) == []


def test_single_complaint_is_noise_not_hotspot():
    complaints = [complaint("C1", 19.1197, 72.8468)]
    hotspots = build_hotspots(complaints)
    assert hotspots == []


def test_dense_cluster_forms_one_hotspot():
    base_lat, base_lon = 19.1197, 72.8468
    complaints = []
    for i in range(15):
        dlat = (i % 5) * 0.0005
        dlon = (i // 5) * 0.0005
        complaints.append(complaint(f"C{i}", base_lat + dlat, base_lon + dlon))
    hotspots = build_hotspots(complaints)
    assert len(hotspots) == 1
    assert hotspots[0]["complaint_count"] == 15


def test_scattered_complaints_do_not_form_hotspot():
    complaints = [
        complaint(f"C{i}", 19.0 + i * 0.5, 72.8 + i * 0.5)
        for i in range(10)
    ]
    hotspots = build_hotspots(complaints)
    assert hotspots == []


def test_identical_coordinates_do_not_crash():
    complaints = [complaint(f"C{i}", 19.1197, 72.8468) for i in range(10)]
    hotspots = build_hotspots(complaints)
    assert len(hotspots) == 1
    assert hotspots[0]["radius_m"] == 0.0
    fc = hotspots_to_feature_collection(hotspots)
    assert fc["features"][0]["geometry"]["type"] == "Polygon"


def test_category_and_priority_breakdown():
    base_lat, base_lon = 19.1197, 72.8468
    complaints = []
    for i in range(10):
        cat = "Road" if i < 7 else "Drainage"
        pri = "High" if i < 3 else "Low"
        complaints.append(complaint(f"C{i}", base_lat + i * 0.0003, base_lon, category=cat, priority=pri))
    hotspots = build_hotspots(complaints)
    assert len(hotspots) == 1
    h = hotspots[0]
    assert h["dominant_category"] == "Road"
    assert h["high_priority_count"] == 3


def test_growth_calculation_matches_spec_example():
    base_lat, base_lon = 19.1197, 72.8468
    complaints = []
    cid = 0
    for _ in range(10):
        complaints.append(complaint(f"C{cid}", base_lat, base_lon, days_ago=10))
        cid += 1
    for _ in range(34):
        complaints.append(complaint(f"C{cid}", base_lat, base_lon, days_ago=2))
        cid += 1
    hotspots = build_hotspots(complaints, now=NOW)
    assert len(hotspots) == 1
    assert hotspots[0]["growth_pct"] == 240.0
    assert hotspots[0]["growth_label"] == "Rapidly emerging hotspot"


def test_zero_baseline_growth_does_not_divide_by_zero():
    base_lat, base_lon = 19.1197, 72.8468
    complaints = [complaint(f"C{i}", base_lat, base_lon, days_ago=1) for i in range(10)]
    hotspots = build_hotspots(complaints, now=NOW)
    assert len(hotspots) == 1
    assert math.isfinite(hotspots[0]["growth_pct"])


def test_similarity_count_reflects_shared_semantic_clusters():
    base_lat, base_lon = 19.1197, 72.8468
    complaints = []
    for i in range(10):
        sem = "SEM-1" if i < 4 else None
        complaints.append(complaint(f"C{i}", base_lat + i * 0.0002, base_lon, sem_id=sem))
    hotspots = build_hotspots(complaints)
    assert hotspots[0]["similar_complaint_count"] == 4


def test_risk_score_bounded_0_100():
    base_lat, base_lon = 19.1197, 72.8468
    complaints = [
        complaint(f"C{i}", base_lat, base_lon, priority="Critical", severity=5, days_ago=1)
        for i in range(50)
    ]
    hotspots = build_hotspots(complaints)
    assert 0 <= hotspots[0]["risk_score"] <= 100


def test_min_complaints_threshold_configurable():
    base_lat, base_lon = 19.1197, 72.8468
    complaints = [complaint(f"C{i}", base_lat, base_lon) for i in range(6)]
    config = HotspotConfig(min_samples=5, min_complaints_for_hotspot=10)
    hotspots = build_hotspots(complaints, config=config)
    assert hotspots == []

    config2 = HotspotConfig(min_samples=5, min_complaints_for_hotspot=5)
    hotspots2 = build_hotspots(complaints, config=config2)
    assert len(hotspots2) == 1


def test_proximity_zone_calculation():
    base_lat, base_lon = 19.1197, 72.8468
    complaints = [
        complaint("C1", base_lat, base_lon, category="Road"), # 0m
        complaint("C2", base_lat + 0.001, base_lon, category="Road"), # ~111m
        complaint("C3", base_lat + 0.05, base_lon, category="Water"), # ~5.5km away
    ]
    zone = calculate_proximity_zone(complaints, base_lat, base_lon, radius_m=500.0)
    assert zone["total_complaints"] == 2
    assert zone["dominant_category"] == "Road"


def test_timeline_and_intervention():
    base_lat, base_lon = 19.1197, 72.8468
    complaints = [
        complaint(f"C{i}", base_lat, base_lon, days_ago=i, status="Resolved" if i % 2 == 0 else "Pending")
        for i in range(8)
    ]
    timeline = build_hotspot_timeline(complaints, num_buckets=2)
    assert len(timeline) == 2
    impact = calculate_intervention_impact(complaints)
    assert impact["total"] == 8
    assert impact["resolved"] == 4
    assert impact["resolution_rate_pct"] == 50.0


if __name__ == "__main__":
    import sys

    tests = [obj for name, obj in list(globals().items()) if name.startswith("test_") and callable(obj)]
    failed = 0
    for t in tests:
        try:
            t()
            print(f"PASS  {t.__name__}")
        except AssertionError as e:
            failed += 1
            print(f"FAIL  {t.__name__}: {e}")
    print(f"\n{len(tests) - failed}/{len(tests)} tests passed")
    sys.exit(1 if failed else 0)
