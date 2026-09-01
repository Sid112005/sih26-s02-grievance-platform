# Synthetic Citizen Grievance Dataset (Mumbai / Thane Region)

Synthetic municipal grievance dataset generated for the **SIH26-S02 Citizen Grievance Classification, Prioritization & Duplicate Detection Platform**.

---

## 📊 Dataset Summary

- **Total Records**: 350 realistic citizen complaints
- **Duplicate Cluster Records**: 105 (30.0%) partitioned across 17 ground-truth duplicate clusters
- **Distinct One-Off Records**: 245 (70.0%)
- **Time Range**: Spans across the last 30 days in ISO 8601 UTC format (`YYYY-MM-DDTHH:MM:SSZ`)
- **Geographic Scope**: High-density zones across the Mumbai / Thane Metropolitan Region (MMR) covering 10 defined neighborhood hubs (Thane West, Andheri West/East, Bandra West/East, Dadar West, Kurla West, Powai, Borivali West)
- **Categories**: 8 municipal grievance categories evenly represented

---

## 📁 File Structure & Teammate Integration Guide

| File | Format | Record Count | Primary Consumer & Usage Guide |
|------|--------|--------------|--------------------------------|
| [`data/synthetic_complaints.csv`](./synthetic_complaints.csv) | CSV | 350 rows | **Member 1 (ML Engine)** & **Members 3/4 (Dashboard)**: Flat tabular dataset for NLP model training/evaluation, clustering benchmarks, and GIS coordinate visualization. |
| [`data/synthetic_complaints.json`](./synthetic_complaints.json) | JSON | 350 objects | **Member 5 (Backend / Intake API)**: JSON array matching the Citizen Intake API contract. Use payload objects directly for load/integration testing against your complaint submission endpoint (`POST /api/v1/complaints`). |
| [`data/known_duplicate_clusters.json`](./known_duplicate_clusters.json) | JSON | 17 clusters (105 items) | **Member 1 (ML / Semantic Deduplication)**: Labeled ground-truth duplicate clusters to evaluate deduplication accuracy (Pairwise Precision, Recall, and Cluster F1-Score). |
| [`data/generate_synthetic_complaints.py`](./generate_synthetic_complaints.py) | Python | Generator Script | Deterministic dataset generator (seed: 42) for reproducible synthetic data generation. |

---

## 👥 How Each Team Member Should Use This Data

- **Member 1 (ML / NLP / Deduplication Engine)**:
  - Use `description` text fields alongside `known_duplicate_clusters.json` as your benchmark ground truth.
  - Test your vector embedding similarity thresholds (e.g. Sentence-BERT, TF-IDF, LLM embeddings) and spatiotemporal clustering to confirm whether all 17 clusters are successfully identified without false-positive grouping of distinct records.
- **Member 5 (Backend / FastAPI / Microservices)**:
  - Use the objects in `synthetic_complaints.json` (`complaints` array) as mock request payloads to seed the database and validate request validation schemas (Pydantic / serializer models).
- **Members 3 & 4 (Frontend / GIS & Admin Dashboard)**:
  - Use the `latitude` and `longitude` fields to plot realistic map markers, density heatmaps, and spatial clusters across Mumbai/Thane before live citizen submissions flow in.
  - Test category dropdown filters, status badges, and timestamp sorting.

---

## 📋 Schema Definition

### 1. Citizen Intake JSON Contract (`synthetic_complaints.json`)

```json
{
  "complaint_id": "CMP_1014",
  "citizen_id": "usr_74219",
  "description": "BMC main water pipe burst on MIDC Central Road. Clean drinking water has been flooding the entire street since 6 AM.",
  "category": "Water Leak",
  "location": {
    "lat": 19.119355,
    "lng": 72.876083
  },
  "address_context": "MIDC Central Road, near Seepz Gate 1, Andheri East",
  "timestamp": "2026-08-24T03:36:56Z"
}
```

### 2. Tabular CSV Schema (`synthetic_complaints.csv`)

| Column Name | Type | Description | Example |
|-------------|------|-------------|---------|
| `complaint_id` | String | Unique complaint identifier | `CMP_1001` |
| `citizen_id` | String | Submitting citizen pseudo-anonymized user ID | `usr_48291` |
| `category` | String | Municipal complaint classification category | `Pothole` |
| `description` | String | Natural language text description from citizen | `Huge crater like pothole...` |
| `latitude` | Float | WGS84 Latitude coordinate (Mumbai/Thane) | `19.217888` |
| `longitude` | Float | WGS84 Longitude coordinate (Mumbai/Thane) | `72.978396` |
| `address_context` | String | Human-readable landmark/neighborhood address | `Near Majiwada Flyover, Thane West` |
| `timestamp` | String | ISO 8601 UTC timestamp of complaint filing | `2026-08-24T03:36:56Z` |

---

## 📈 Dataset Distribution Breakdown

### Category Distribution (Total: 350)

| Category | Record Count | Percentage | Description |
|----------|--------------|------------|-------------|
| **Pothole** | 51 | 14.6% | Road damage, craters, damaged asphalt |
| **Water Leak** | 46 | 13.1% | Underground pipe ruptures, leaking valves, fire hydrants |
| **Garbage Collection** | 44 | 12.6% | Overflowing community dumpsters, uncollected waste, litter |
| **Illegal Construction** | 44 | 12.6% | Footpath encroachments, unauthorized sheds, illegal structures |
| **Streetlight** | 44 | 12.6% | Non-functional lamps, flickering lights, exposed wiring |
| **Sewage Overflow** | 44 | 12.6% | Choked manholes, open nullah spills, drainage backflow |
| **Stray Animal** | 41 | 11.7% | Aggressive stray dog packs, cattle blocking arterial roads |
| **Noise Complaint** | 36 | 10.3% | Midnight loudspeakers, commercial DJ bass, late construction |

### Geographic Distribution across MMR Hubs

| Neighborhood Hub | Suburb | Count | Share |
|------------------|--------|-------|-------|
| Dadar - Shivaji Park & Plaza | Dadar West | 44 | 12.6% |
| Bandra East - BKC Area | Bandra East | 40 | 11.4% |
| Borivali - Link Road & Station Area | Borivali West | 36 | 10.3% |
| Kurla - LBS Marg & Station Area | Kurla West | 36 | 10.3% |
| Bandra - Hill Road & Pali Hill | Bandra West | 36 | 10.3% |
| Thane - Majiwada & Ghodbunder | Thane West | 35 | 10.0% |
| Powai - Hiranandani & JVLR | Powai | 34 | 9.7% |
| Andheri - Lokhandwala & Link Road | Andheri West | 32 | 9.1% |
| Thane - Naupada & Station Area | Thane West | 30 | 8.6% |
| Andheri - Marol & MIDC | Andheri East | 27 | 7.7% |

---

## 🎯 Ground Truth Duplicate Clusters (17 Clusters / 105 Records)

Clusters test whether the AI deduplication engine (embeddings, sentence-transformers, spatiotemporal clustering) can group independently filed citizen reports describing the same real-world incident despite differing vocabulary, tone, length, and filing times.

| Cluster ID | Category | Neighborhood / Location | Size | Incident Summary |
|------------|----------|-------------------------|------|------------------|
| `CLUST-POTHOLE-01` | Pothole | Majiwada / Ghodbunder, Thane West | 7 | Massive deep pothole on Majiwada service road causing two-wheeler skids |
| `CLUST-STREETLIGHT-02` | Streetlight | Waterfield Road, Bandra West | 6 | Row of 3 consecutive streetlights non-functional outside National College |
| `CLUST-WATERLEAK-03` | Water Leak | MIDC Central Rd / Seepz, Andheri East | 8 | Main underground drinking water supply pipeline burst gushing onto road |
| `CLUST-GARBAGE-04` | Garbage Collection | Dadar Flower Market, Dadar West | 6 | Municipal waste dumpster overflowing with organic waste for 3 days |
| `CLUST-SEWAGE-05` | Sewage Overflow | LBS Marg, Phoenix Marketcity, Kurla West | 6 | Drainage manhole chamber overflowing with black foul sewage |
| `CLUST-STRAYANIMAL-06` | Stray Animal | Ram Maruti Road / Talao Pali, Thane West | 6 | Pack of aggressive stray dogs chasing two-wheelers and morning joggers |
| `CLUST-NOISE-07` | Noise Complaint | Lokhandwala Back Road, Andheri West | 6 | Commercial party venue running heavy bass loudspeakers past 1:00 AM |
| `CLUST-ILLEGALCONST-08` | Illegal Construction | Shimpoli Signal, Link Road, Borivali West | 6 | Unauthorized commercial tin shed constructed on public footpath |
| `CLUST-POTHOLE-09` | Pothole | JVLR Eastbound near Powai Lake, Powai | 6 | Severe pothole cluster on fast lane causing tyre punctures |
| `CLUST-WATERLEAK-10` | Water Leak | BKC Connector Junction, Bandra East | 6 | Main feeder waterline ruptured under pavement flooding BKC approach road |
| `CLUST-GARBAGE-11` | Garbage Collection | Hiranandani Estate Gate, Patlipada, Thane | 6 | Illegal open dumping ground formed outside residential estate gate |
| `CLUST-STREETLIGHT-12` | Streetlight | Link Road, Infinity Mall to Oshiwara, Andheri W | 6 | Continuous string of 8 median streetlights non-operational along metro line |
| `CLUST-SEWAGE-13` | Sewage Overflow | NC Kelkar Road, Plaza Cinema, Dadar West | 6 | Collapsed municipal sewer line causing foul wastewater backflow onto sidewalk |
| `CLUST-ILLEGALCONST-14` | Illegal Construction | Kurla West Railway Bus Depot, Kurla West | 6 | Illegal permanent shop extensions blocking BEST bus turning radius |
| `CLUST-STRAYANIMAL-15` | Stray Animal | JVLR opposite IIT Bombay Main Gate, Powai | 6 | Herd of unattended cattle sitting on central fast lane causing gridlock |
| `CLUST-NOISE-16` | Noise Complaint | Cadell Road, Shivaji Park Gate 3, Dadar West | 6 | Commercial event using illegal high-decibel box speakers past midnight |
| `CLUST-POTHOLE-17` | Pothole | Gorai Bridge Junction, Gorai 1, Borivali West | 6 | Series of deep waterlogged craters on bridge descent causing bike falls |

---

## 🛠️ How to Re-generate

```bash
python data/generate_synthetic_complaints.py
```
