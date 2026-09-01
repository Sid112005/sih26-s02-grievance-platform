# Synthetic Citizen Grievance Dataset (Mumbai / Thane Region)

Synthetic municipal grievance dataset generated for the **SIH26-S02 Citizen Grievance Classification, Prioritization & Duplicate Detection Platform**.

## 📊 Dataset Summary

- **Total Records**: 130 realistic citizen complaints
- **Duplicate Cluster Records**: 41 (31.5%) partitioned across 9 real-world incidents
- **Distinct One-Off Records**: 89 (68.5%)
- **Time Range**: Spans across the last 30 days in ISO 8601 UTC format (`YYYY-MM-DDTHH:MM:SSZ`)
- **Geographic Coverage**: High-density zones across Thane West, Andheri West/East, Bandra West/East (BKC), Dadar West, Kurla West, Powai, and Borivali West

---

## 📁 File Structure

| File | Format | Purpose |
|------|--------|---------|
| [`data/synthetic_complaints.csv`](./synthetic_complaints.csv) | CSV | Flat tabular dataset for tabular ML models, data analysis, and GIS plotting |
| [`data/synthetic_complaints.json`](./synthetic_complaints.json) | JSON | Nested structure matching the team's Citizen Intake API contract payload |
| [`data/known_duplicate_clusters.json`](./known_duplicate_clusters.json) | JSON | **Ground Truth** cluster annotations for precision/recall evaluation of duplicate detection AI |
| [`data/generate_synthetic_complaints.py`](./generate_synthetic_complaints.py) | Python | Deterministic dataset generator (seed: 42) for reproducible synthetic data generation |

---

## 📋 Schema Definition

### Citizen Intake Contract Schema

```json
{
  "complaint_id": "CMP_1001",
  "citizen_id": "usr_98765",
  "category": "Pothole",
  "description": "Huge crater like pothole right at the entry of Majiwada service road. Two bikers almost fell down this morning during peak traffic.",
  "location": {
    "lat": 19.217888,
    "lng": 72.978396
  },
  "address_context": "Near Majiwada Flyover service lane towards Kapurbawdi, Thane West",
  "timestamp": "2026-08-15T00:42:44Z"
}
```

### Supported Categories

1. `Pothole`
2. `Streetlight`
3. `Water Leak`
4. `Garbage Collection`
5. `Sewage Overflow`
6. `Illegal Construction`
7. `Stray Animal`
8. `Noise Complaint`

---

## 🎯 Ground Truth Duplicate Clusters

Clusters test whether the AI deduplication engine (e.g. embeddings, sentence-transformers, spatial-temporal clustering) can semantically group independently filed citizen reports that describe the same incident using different language, tone, and length.

| Cluster ID | Category | Location | Size | Incident Summary |
|------------|----------|----------|------|------------------|
| `CLUST-POTHOLE-01` | Pothole | Majiwada / Ghodbunder, Thane West | 5 | Massive deep pothole on Majiwada service road causing two-wheeler skids |
| `CLUST-STREETLIGHT-02` | Streetlight | Waterfield Road, Bandra West | 5 | Row of 3 consecutive streetlights non-functional |
| `CLUST-WATERLEAK-03` | Water Leak | MIDC Central Rd / Seepz, Andheri East | 6 | Main underground drinking water supply pipeline burst gushing onto road |
| `CLUST-GARBAGE-04` | Garbage Collection | Dadar Flower Market, Dadar West | 4 | Municipal waste dumpster overflowing with organic waste for 3 days |
| `CLUST-SEWAGE-05` | Sewage Overflow | LBS Marg, Phoenix Marketcity, Kurla West | 5 | Drainage manhole chamber overflowing with black foul water |
| `CLUST-STRAYANIMAL-06` | Stray Animal | Ram Maruti Road / Talao Pali, Thane West | 4 | Pack of aggressive stray dogs chasing two-wheelers |
| `CLUST-NOISE-07` | Noise Complaint | Lokhandwala Back Road, Andheri West | 4 | Commercial venue blaring heavy bass past 1:00 AM |
| `CLUST-ILLEGALCONST-08` | Illegal Construction | Shimpoli Signal, Link Road, Borivali West | 4 | Unauthorized commercial tin shed constructed on public footpath |
| `CLUST-POTHOLE-09` | Pothole | JVLR Eastbound near Powai Lake, Powai | 4 | Severe pothole cluster on fast lane causing tyre punctures |

---

## 🛠️ How to Re-generate

```bash
python data/generate_synthetic_complaints.py
```
