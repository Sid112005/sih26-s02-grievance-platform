"""
generate_demo.py
Precomputes demo data snapshot using the exact hotspot_engine.py.
Outputs:
  - demo_bundle.json
  - hotspots.geojson
  - updates embedded DEMO_BUNDLE in frontend/dashboard.html & dashboard.html
"""

import datetime as dt
import json
from pathlib import Path

from hotspot_engine import (
    build_hotspots,
    filter_valid_complaints,
    hotspots_to_feature_collection,
    HotspotConfig,
)

BASE_DIR = Path(__file__).parent
COMPLAINTS_FILE = BASE_DIR / "complaints.json"
OUTPUT_BUNDLE = BASE_DIR / "demo_bundle.json"
OUTPUT_GEOJSON = BASE_DIR / "hotspots.geojson"
DASHBOARD_FRONTEND = BASE_DIR / "frontend" / "dashboard.html"
DASHBOARD_ROOT = BASE_DIR / "dashboard.html"

NOW = dt.datetime(2026, 9, 1, 10, 0, 0)


def generate():
    with open(COMPLAINTS_FILE, "r", encoding="utf-8") as f:
        complaints = json.load(f)

    mapped, unmapped = filter_valid_complaints(complaints)

    config = HotspotConfig(
        eps_m=600.0,
        min_samples=3,
        min_complaints_for_hotspot=5,
        recent_days=7,
        baseline_days=7,
    )

    hotspots = build_hotspots(mapped, config=config, now=NOW)
    geojson = hotspots_to_feature_collection(hotspots)

    # Calculate system-wide statistics
    category_totals = {}
    priority_totals = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
    for c in mapped:
        cat = c.get("category", "Other")
        category_totals[cat] = category_totals.get(cat, 0) + 1
        p = c.get("priority", "Medium")
        if p in priority_totals:
            priority_totals[p] += 1

    unresolved_count = sum(1 for c in mapped if c.get("status") in ("Pending", "In Progress", None))
    resolved_count = sum(1 for c in mapped if c.get("status") == "Resolved")
    highest_risk_hotspot = hotspots[0]["hotspot_id"] if hotspots else None
    avg_risk = round(sum(h["risk_score"] for h in hotspots) / max(len(hotspots), 1), 1)

    statistics = {
        "total_complaints": len(complaints),
        "mapped_complaints": len(mapped),
        "unmapped_complaints": len(unmapped),
        "unresolved_complaints": unresolved_count,
        "resolved_complaints": resolved_count,
        "total_hotspots": len(hotspots),
        "category_totals": category_totals,
        "priority_totals": priority_totals,
        "highest_risk_hotspot": highest_risk_hotspot,
        "avg_risk_score": avg_risk,
        "last_updated": NOW.strftime("%Y-%m-%d %H:%M:%S IST"),
    }

    demo_bundle = {
        "generated_at": NOW.isoformat(),
        "city": "Mumbai",
        "complaints": mapped,
        "hotspots": hotspots,
        "hotspots_geojson": geojson,
        "statistics": statistics,
    }

    bundle_json_str = json.dumps(demo_bundle, indent=2)

    with open(OUTPUT_BUNDLE, "w", encoding="utf-8") as f:
        f.write(bundle_json_str)

    frontend_bundle = BASE_DIR / "frontend" / "demo_bundle.json"
    frontend_bundle.parent.mkdir(parents=True, exist_ok=True)
    with open(frontend_bundle, "w", encoding="utf-8") as f:
        f.write(bundle_json_str)

    with open(OUTPUT_GEOJSON, "w", encoding="utf-8") as f:
        json.dump(geojson, f, indent=2)

    # Embed snapshot directly in dashboard HTML files for zero-server offline execution
    bundle_code = f"const DEMO_BUNDLE = {bundle_json_str};\nlet rawData = DEMO_BUNDLE;\n"

    for dash_file in [DASHBOARD_FRONTEND, DASHBOARD_ROOT]:
        if dash_file.exists():
            with open(dash_file, "r", encoding="utf-8") as f:
                content = f.read()

            marker = "// === INLINE_DEMO_BUNDLE ==="
            if marker in content:
                parts = content.split(marker)
                # parts[0] + marker + "\n" + bundle_code + "\n" + marker + parts[2]
                content = parts[0] + marker + "\n" + bundle_code + marker + parts[2]
            elif "let rawData = null;" in content:
                content = content.replace(
                    "let rawData = null;",
                    f"{marker}\n{bundle_code}{marker}",
                )

            with open(dash_file, "w", encoding="utf-8") as f:
                f.write(content)

    print(f"Generated demo bundle with {len(mapped)} mapped complaints and {len(hotspots)} hotspots:")
    for h in hotspots:
        print(f"  {h['hotspot_id']} | Dominant: {h['dominant_category']} | Count: {h['complaint_count']} | Priority Score: {h['risk_score']} ({h['risk_label']}) | Velocity: {h['growth_pct']}% ({h['growth_label']})")


if __name__ == "__main__":
    generate()
