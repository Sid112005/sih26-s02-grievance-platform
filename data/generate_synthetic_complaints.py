"""
Synthetic Citizen Complaint Data Generator for SIH26-S02 Grievance Platform.
Municipal Governance - Mumbai / Thane Metropolitan Region.

Generates realistic citizen grievance datasets with:
- Standardized Citizen Intake schema (CSV & JSON)
- Realistic geo-coordinates across Mumbai & Thane neighborhoods
- Distinct one-off complaints (~60-70%)
- Semantic duplicate complaint clusters (~30-40%) with varied natural language phrasing
- Ground-truth duplicate cluster annotations for AI model benchmarking
"""

import json
import csv
import random
import os
from datetime import datetime, timedelta, timezone

# Set random seed for reproducibility
random.seed(42)

# Specific real neighborhood hubs in Mumbai and Thane with accurate GPS anchors
NEIGHBORHOOD_HUBS = [
    {
        "area": "Thane - Majiwada & Ghodbunder",
        "suburb": "Thane West",
        "lat_range": (19.2050, 19.2350),
        "lng_range": (72.9680, 72.9950),
        "locations": [
            {"landmark": "Majiwada Junction", "address": "Near Majiwada Junction, Ghodbunder Rd, Thane West"},
            {"landmark": "Viviana Mall", "address": "Opposite Viviana Mall, Eastern Express Highway, Thane West"},
            {"landmark": "Hiranandani Estate Gate", "address": "Near Hiranandani Estate Gate, Patlipada, Thane West"},
            {"landmark": "Manpada Service Road", "address": "Manpada Service Road, Ghodbunder Rd, Thane West"},
            {"landmark": "Kapurbawdi Naka", "address": "Near Kapurbawdi Naka, Ghodbunder Road, Thane West"},
            {"landmark": "Jupiter Hospital", "address": "Outside Jupiter Hospital, Eastern Express Hwy, Thane West"}
        ]
    },
    {
        "area": "Thane - Naupada & Station Area",
        "suburb": "Thane West",
        "lat_range": (19.1850, 19.1980),
        "lng_range": (72.9650, 72.9820),
        "locations": [
            {"landmark": "Thane Railway Station Plaza", "address": "Near Thane Railway Station West Plaza, Thane West"},
            {"landmark": "Ram Maruti Road", "address": "Ram Maruti Road, Naupada, Thane West"},
            {"landmark": "Talao Pali", "address": "Gokhale Road, near Talao Pali, Thane West"},
            {"landmark": "Gaondevi Mandir", "address": "Near Gaondevi Mandir, Naupada, Thane West"},
            {"landmark": "Charai Naka", "address": "Charai Naka, near municipal school, Thane West"}
        ]
    },
    {
        "area": "Andheri - Lokhandwala & Link Road",
        "suburb": "Andheri West",
        "lat_range": (19.1300, 19.1450),
        "lng_range": (72.8250, 72.8420),
        "locations": [
            {"landmark": "Lokhandwala Back Road", "address": "Lokhandwala Back Road, near High Street Market, Andheri West"},
            {"landmark": "Infinity Mall", "address": "Link Road, near Infinity Mall, Andheri West"},
            {"landmark": "Veera Desai Industrial Area", "address": "Veera Desai Industrial Area, 4 Bungalows, Andheri West"},
            {"landmark": "Oshiwara Metro Station", "address": "Near Oshiwara Metro Station, Link Road, Andheri West"},
            {"landmark": "Model Town", "address": "Model Town, 4 Bungalows, Andheri West"}
        ]
    },
    {
        "area": "Andheri - Marol & MIDC",
        "suburb": "Andheri East",
        "lat_range": (19.1120, 19.1280),
        "lng_range": (72.8650, 72.8850),
        "locations": [
            {"landmark": "Marol Maroshi Road", "address": "Marol Maroshi Road, near Fire Station, Andheri East"},
            {"landmark": "MIDC Central Road", "address": "MIDC Central Road, near Seepz Gate 1, Andheri East"},
            {"landmark": "JB Nagar Metro Station", "address": "Near JB Nagar Metro Station, Andheri-Kurla Road, Andheri East"},
            {"landmark": "Chakala Gurunanak Petrol Pump", "address": "Chakala, near Gurunanak Petrol Pump, Andheri East"}
        ]
    },
    {
        "area": "Bandra - Hill Road & Pali Hill",
        "suburb": "Bandra West",
        "lat_range": (19.0520, 19.0680),
        "lng_range": (72.8260, 72.8420),
        "locations": [
            {"landmark": "Hill Road", "address": "Hill Road, near Mehboob Studio, Bandra West"},
            {"landmark": "Waterfield Road", "address": "Waterfield Road, near National College, Bandra West"},
            {"landmark": "Pali Naka", "address": "Pali Naka, near 16th Road Junction, Bandra West"},
            {"landmark": "Bandra Talao", "address": "Near Bandra Talao, SV Road, Bandra West"},
            {"landmark": "Turner Road", "address": "Turner Road, opposite municipal park, Bandra West"}
        ]
    },
    {
        "area": "Bandra East - BKC Area",
        "suburb": "Bandra East",
        "lat_range": (19.0580, 19.0720),
        "lng_range": (72.8550, 72.8750),
        "locations": [
            {"landmark": "BKC Connector Junction", "address": "Near BKC Connector junction, Kalanagar, Bandra East"},
            {"landmark": "MCA Club BKC", "address": "G Block BKC, near MCA Club, Bandra East"},
            {"landmark": "Bharat Diamond Bourse", "address": "Near Bharat Diamond Bourse, BKC, Bandra East"},
            {"landmark": "Kherwadi Signal", "address": "Kherwadi, near Western Express Highway junction, Bandra East"}
        ]
    },
    {
        "area": "Dadar - Shivaji Park & Plaza",
        "suburb": "Dadar West",
        "lat_range": (19.0180, 19.0320),
        "lng_range": (72.8350, 72.8490),
        "locations": [
            {"landmark": "Shivaji Park", "address": "Near Shivaji Park Gate 3, Cadell Road, Dadar West"},
            {"landmark": "Plaza Cinema", "address": "Near Plaza Cinema, NC Kelkar Road, Dadar West"},
            {"landmark": "Dadar Flower Market", "address": "Near Flower Market, Dadar Station West, Dadar West"},
            {"landmark": "Senapati Bapat Marg", "address": "Senapati Bapat Marg, near Elphinstone Bridge, Dadar West"},
            {"landmark": "Ranade Road", "address": "Ranade Road, near municipal market, Dadar West"}
        ]
    },
    {
        "area": "Kurla - LBS Marg & Station Area",
        "suburb": "Kurla West",
        "lat_range": (19.0650, 19.0820),
        "lng_range": (72.8750, 72.8920),
        "locations": [
            {"landmark": "Phoenix Marketcity", "address": "LBS Marg, opposite Phoenix Marketcity, Kurla West"},
            {"landmark": "Kurla Railway Bus Depot", "address": "Near Kurla West Railway Bus Depot, Kurla West"},
            {"landmark": "BKC-Kurla Link Road", "address": "Near BKC-Kurla Link Road nullah, Kurla West"},
            {"landmark": "Premier Ground", "address": "Near Premier Ground, Lal Bahadur Shastri Marg, Kurla West"},
            {"landmark": "Sheetal Cinema", "address": "Near Sheetal Cinema, LBS Road, Kurla West"}
        ]
    },
    {
        "area": "Powai - Hiranandani & JVLR",
        "suburb": "Powai",
        "lat_range": (19.1150, 19.1320),
        "lng_range": (72.9050, 72.9280),
        "locations": [
            {"landmark": "Central Avenue Hiranandani", "address": "Central Avenue, Hiranandani Gardens, Powai"},
            {"landmark": "Powai Lake Promenade", "address": "JVLR Junction, near Powai Lake promenade, Powai"},
            {"landmark": "IIT Bombay Main Gate", "address": "Near IIT Bombay Main Gate, Powai"},
            {"landmark": "Galleria Market", "address": "Galleria Market entrance road, Powai"}
        ]
    },
    {
        "area": "Borivali - Link Road & Station Area",
        "suburb": "Borivali West",
        "lat_range": (19.2220, 19.2420),
        "lng_range": (72.8450, 72.8680),
        "locations": [
            {"landmark": "Shimpoli Signal", "address": "Near Shimpoli Signal, Link Road, Borivali West"},
            {"landmark": "Borivali Station West", "address": "Near Borivali Station West, SV Road, Borivali West"},
            {"landmark": "Gorai Bridge", "address": "Near Gorai Bridge junction, Gorai 1, Borivali West"},
            {"landmark": "Don Bosco School", "address": "Near Don Bosco School Road, Borivali West"}
        ]
    }
]

CATEGORIES = [
    "Pothole",
    "Streetlight",
    "Water Leak",
    "Garbage Collection",
    "Sewage Overflow",
    "Illegal Construction",
    "Stray Animal",
    "Noise Complaint"
]

# Ground-truth semantic duplicate clusters designed with realistic variations in tone, length, vocabulary, and perspective
CLUSTER_DEFINITIONS = [
    {
        "cluster_id": "CLUST-POTHOLE-01",
        "category": "Pothole",
        "area_idx": 0,  # Majiwada / Ghodbunder
        "base_location": {"lat": 19.2178, "lng": 72.9782},
        "address": "Near Majiwada Flyover service lane towards Kapurbawdi, Thane West",
        "incident_summary": "Massive deep pothole on Majiwada service road causing two-wheeler skids and traffic jam",
        "complaints": [
            "Huge crater like pothole right at the entry of Majiwada service road. Two bikers almost fell down this morning during peak traffic.",
            "Dangerous pothole near Majiwada flyover ramp on Thane West side. Road is completely broken and causing severe bottleneck.",
            "Big pothole unfilled since last rain near Kapurbawdi Majiwada service lane. Vehicles getting damaged.",
            "Please fix the deep pothole on Majiwada service lane immediately. Very unsafe for two wheelers at night.",
            "Severe road damage and large ditch on Majiwada service road. Daily traffic jams because cars are swerving suddenly to avoid it.",
            "Deep asphalt crater on the Thane-bound service road past Majiwada junction. Damaged my car rim yesterday evening.",
            "Majiwada service road has an open trench-like pothole right after the flyover descent. Heavy risk of accident."
        ]
    },
    {
        "cluster_id": "CLUST-STREETLIGHT-02",
        "category": "Streetlight",
        "area_idx": 4,  # Bandra West
        "base_location": {"lat": 19.0592, "lng": 72.8315},
        "address": "Waterfield Road, opposite National College lane, Bandra West",
        "incident_summary": "Row of 3 consecutive streetlights completely dead on Waterfield Road causing dark unsafe stretch",
        "complaints": [
            "All street lights along Waterfield Road near National College are non-functional for past 4 days. Pitch dark after 7 PM.",
            "Dark street outside National College on Waterfield Rd. Street lamp poles 14 and 15 not working at all. Highly unsafe for pedestrians.",
            "No streetlight working on Waterfield Road Bandra West. Street is pitch black at night, risk of theft and accidents.",
            "Multiple lamp posts turned off on Waterfield road. Please send municipal electrician team to repair.",
            "Total darkness on Waterfield Road near the college signal due to faulty streetlights.",
            "Urgent: lights out across the entire Waterfield Road curve opposite National College. Ladies feeling unsafe walking home from station."
        ]
    },
    {
        "cluster_id": "CLUST-WATERLEAK-03",
        "category": "Water Leak",
        "area_idx": 3,  # Andheri East Marol
        "base_location": {"lat": 19.1195, "lng": 72.8762},
        "address": "MIDC Central Road, near Seepz Gate 1, Andheri East",
        "incident_summary": "Major municipal underground water supply pipeline burst gushing thousands of liters onto road",
        "complaints": [
            "BMC main water pipe burst on MIDC Central Road. Clean drinking water has been flooding the entire street since 6 AM.",
            "Heavy water leakage from underground pipeline near Seepz Gate 1, Andheri East. Road flooded with water wastage.",
            "Water pipe broken in front of MIDC industrial complex. Lakhs of liters getting wasted while our buildings have no water supply.",
            "Huge water line rupture near SEEPZ entrance, water gushing out with high pressure causing waterlogging.",
            "Pipeline leak on Andheri MIDC Central road. Please shut the supply valve and repair the leakage ASAP.",
            "Drinking water pipeline leakage creating a mini river on the road outside Seepz Gate 1.",
            "Underground municipal water pipeline cracked open near SEEPZ Gate 1. Fresh water running down the street for past 5 hours.",
            "High pressure water stream erupting from broken BMC line on MIDC Central Road. Pedestrians cannot cross the road."
        ]
    },
    {
        "cluster_id": "CLUST-GARBAGE-04",
        "category": "Garbage Collection",
        "area_idx": 6,  # Dadar West
        "base_location": {"lat": 19.0225, "lng": 72.8420},
        "address": "Senapati Bapat Marg, near Dadar Flower Market, Dadar West",
        "incident_summary": "Municipal waste dumpster overflowing with organic waste for 3 days, foul stench and road blockage",
        "complaints": [
            "Garbage bins near Dadar Flower Market on Senapati Bapat Marg overflowing onto the main road. Rotten smell unbearable.",
            "No BMC garbage truck has collected waste from the Dadar West market corner for three days. Waste piled up on footpath.",
            "Huge heap of organic waste and plastic spilled across Senapati Bapat Marg near flower market. Breeding mosquitoes and dogs.",
            "Uncleaned municipal trash bin near Dadar station market. Pedestrians forced to walk on road due to garbage mound on sidewalk.",
            "Piles of rotten flowers and wet waste dumped on Senapati Bapat Marg curb. BMC dumper hasn't arrived since Friday.",
            "Garbage overflow creating severe hygiene hazard outside Dadar Flower Market. Foul stench spreading across 200 meters."
        ]
    },
    {
        "cluster_id": "CLUST-SEWAGE-05",
        "category": "Sewage Overflow",
        "area_idx": 7,  # Kurla West
        "base_location": {"lat": 19.0715, "lng": 72.8825},
        "address": "LBS Marg, opposite Phoenix Marketcity bus stop, Kurla West",
        "incident_summary": "Manhole chamber overflowing with black drainage water and foul sewage flooding the sidewalk",
        "complaints": [
            "Drainage manhole overflowing opposite Phoenix Marketcity on LBS Marg. Foul smelling gutter water entering footpath.",
            "Severe sewage overflow on LBS Road Kurla West. Black drain water bubbling out of chamber and spreading onto street.",
            "Choked sewer line causing gutter overflow near the bus stand on LBS Marg. Health hazard for commuters and shopkeepers.",
            "Manhole cover leaking filthy drain water continuously in Kurla West. Please dispatch vacuum cleaning suction tanker.",
            "Open drainage leakage and filthy water stagnation outside Phoenix Mall gate on LBS road.",
            "Contaminated gutter sewage spilling all over the walkway near Phoenix bus stop Kurla. Commuters unable to step off buses."
        ]
    },
    {
        "cluster_id": "CLUST-STRAYANIMAL-06",
        "category": "Stray Animal",
        "area_idx": 1,  # Thane Naupada
        "base_location": {"lat": 19.1912, "lng": 72.9718},
        "address": "Ram Maruti Road, near Talao Pali junction, Naupada, Thane West",
        "incident_summary": "Pack of aggressive stray dogs chasing two-wheelers and morning joggers near Talao Pali",
        "complaints": [
            "Pack of 6-7 aggressive stray dogs barking and chasing two-wheelers on Ram Maruti Road near Talao Pali.",
            "Stray dog menace near Talao Pali garden Naupada. Two delivery boys were bitten over the weekend. Need TMC veterinary team to sterilize and vaccinate.",
            "Dangerous stray dogs attacking pedestrians walking towards Talao Pali in the early morning.",
            "Excessive stray dogs roaming aggressively in packs near Ram Maruti Road junction. Posing danger to children and senior citizens.",
            "Biker fell down trying to escape attacking pack of street dogs on Ram Maruti Road near Talao Pali corner.",
            "Furious stray dogs continuously growling at cyclists and joggers near Talao Pali lake side in Naupada."
        ]
    },
    {
        "cluster_id": "CLUST-NOISE-07",
        "category": "Noise Complaint",
        "area_idx": 2,  # Andheri Lokhandwala
        "base_location": {"lat": 19.1382, "lng": 72.8335},
        "address": "Lokhandwala Back Road, near High Street Market, Andheri West",
        "incident_summary": "Commercial party venue running heavy bass loudspeakers past 1:00 AM violating noise regulations",
        "complaints": [
            "Extremely loud music and DJ bass playing past 12:30 AM at Lokhandwala Back Road commercial venue. Cannot sleep.",
            "Illegal high decibel loudspeaker noise continuing after midnight near High Street Market, Lokhandwala. Disturbing entire residential society.",
            "Noise pollution violation on Lokhandwala back road. Blaring music with heavy subwoofers vibrating residential building windows late at night.",
            "Loud sound system operating till 1:30 AM in residential zone near Lokhandwala Complex. Please enforce 10 PM noise curfew rules.",
            "Commercial rooftop party blasting EDM and subwoofers on Lokhandwala Back Road well after 1 AM. Senior citizens unable to rest.",
            "Midnight loud music and acoustic thumping continuing unabated on Lokhandwala back road."
        ]
    },
    {
        "cluster_id": "CLUST-ILLEGALCONST-08",
        "category": "Illegal Construction",
        "area_idx": 9,  # Borivali West
        "base_location": {"lat": 19.2315, "lng": 72.8560},
        "address": "Near Shimpoli Signal, Link Road, Borivali West",
        "incident_summary": "Unauthorized commercial shed and tin barrier constructed on public pedestrian footpath",
        "complaints": [
            "Unauthorized tin shed construction on the municipal footpath near Shimpoli signal. Completely blocked pedestrian walkway.",
            "Illegal encroachment and commercial extension occupying the public sidewalk on Borivali Link Road near Shimpoli.",
            "New illegal structure being erected on public walkway without municipal BMC approval at Shimpoli junction.",
            "Encroachment on footpath by shopkeeper building temporary structure on Link Road Borivali West. Pedestrians forced into heavy traffic.",
            "Permanent tin sheet shed being erected over public pavement right next to Shimpoli signal Borivali West. Clear encroachment of municipal land.",
            "Sidewalk illegally seized and fenced off with iron sheets near Shimpoli Signal Borivali West."
        ]
    },
    {
        "cluster_id": "CLUST-POTHOLE-09",
        "category": "Pothole",
        "area_idx": 8,  # Powai JVLR
        "base_location": {"lat": 19.1230, "lng": 72.9150},
        "address": "JVLR Eastbound, near Powai Lake promenade junction, Powai",
        "incident_summary": "Cluster of 3 large continuous potholes on JVLR right lane before Powai Lake signal",
        "complaints": [
            "Series of sharp, deep potholes on JVLR eastbound lane near Powai lake. Multiple cars suffered tyre punctures.",
            "Horrible road condition on JVLR Powai stretch near the lake signal. Huge crater on right fast lane causing sudden braking.",
            "Dangerous pothole cluster on Jogeshwari Vikhroli Link Road near Powai promenade. High risk of fatal motorcycle crash.",
            "Please resurface the badly damaged road on JVLR near Powai Lake. Potholes are getting deeper with heavy vehicle movement.",
            "Huge crater on JVLR towards Kanjurmarg just before Powai Lake promenade. Severe traffic bottleneck every evening.",
            "Multiple deep pits in the road asphalt on JVLR near Powai promenade. Causing major risk of skidding for two wheelers."
        ]
    },
    {
        "cluster_id": "CLUST-WATERLEAK-10",
        "category": "Water Leak",
        "area_idx": 5,  # Bandra East BKC
        "base_location": {"lat": 19.0635, "lng": 72.8620},
        "address": "Near BKC Connector junction, Kalanagar, Bandra East",
        "incident_summary": "Main feeder waterline ruptured under pavement flooding BKC connector approach road",
        "complaints": [
            "Massive water pipe breakage under the footpath near BKC Connector entry Kalanagar. Clean water flooding both lanes.",
            "Pressurized drinking water pipeline burst at Kalanagar junction near BKC connector ramp. Huge volume of water being wasted.",
            "Water gushing onto the road from a broken BMC pipeline near BKC Connector, Bandra East. Causing waterlogging on morning commute.",
            "Huge water supply rupture outside Kalanagar towards BKC. Water stream rising 3 feet high and eroding the road curb.",
            "Urgent: main municipal supply pipe burst at BKC Connector junction Bandra East. Potable water flooding highway access lane.",
            "Water line leak near Kalanagar flyover approach. Clean municipal water gushing out since 5:00 AM."
        ]
    },
    {
        "cluster_id": "CLUST-GARBAGE-11",
        "category": "Garbage Collection",
        "area_idx": 0,  # Thane Majiwada & Ghodbunder
        "base_location": {"lat": 19.2310, "lng": 72.9860},
        "address": "Near Hiranandani Estate Gate, Patlipada, Ghodbunder Rd, Thane West",
        "incident_summary": "Illegal open dumping ground formed outside residential estate gate attracting stray cattle and foul odor",
        "complaints": [
            "Garbage and household waste piled high on service road outside Hiranandani Estate Gate at Patlipada. TMC garbage vans haven't cleared it.",
            "Illegal open garbage dump created along Ghodbunder Road near Patlipada Hiranandani Estate entrance. Severe stench and flies.",
            "Huge accumulation of uncollected trash and plastic bags at Patlipada junction, Thane West. Health risk for residential towers.",
            "TMC municipal bin overflowing and waste scattered all over the walkway near Hiranandani Estate Patlipada gate.",
            "Unattended municipal garbage dump outside Hiranandani Estate entrance Ghodbunder road. Rotten smell entering ground floor shops.",
            "Piles of municipal waste neglected for 4 days near Patlipada bridge turn towards Hiranandani Estate, Thane West."
        ]
    },
    {
        "cluster_id": "CLUST-STREETLIGHT-12",
        "category": "Streetlight",
        "area_idx": 2,  # Andheri West Lokhandwala & Link Road
        "base_location": {"lat": 19.1365, "lng": 72.8310},
        "address": "Link Road, between Infinity Mall and Oshiwara Metro, Andheri West",
        "incident_summary": "Continuous string of 8 median streetlights non-operational creating hazardous dark zone along metro corridor",
        "complaints": [
            "All median streetlights from Infinity Mall to Oshiwara Metro on Link Road are completely dark. Extremely dangerous driving conditions.",
            "Link Road Andheri West is pitch dark between Infinity Mall and Oshiwara station. None of the street lights are working for past 3 nights.",
            "Blackout of streetlights on Link Road stretch near Infinity Mall. High risk of pedestrian accidents while crossing.",
            "Series of streetlight poles off along the Link Road metro pillar line. Urgent maintenance needed from BMC ward team.",
            "No streetlights working outside Infinity Mall Andheri West on the main Link Road carriageway. Total darkness after sunset.",
            "Entire stretch of street lamps non-functional on Link Road between Oshiwara signal and Infinity Mall."
        ]
    },
    {
        "cluster_id": "CLUST-SEWAGE-13",
        "category": "Sewage Overflow",
        "area_idx": 6,  # Dadar West
        "base_location": {"lat": 19.0205, "lng": 72.8435},
        "address": "NC Kelkar Road, near Plaza Cinema junction, Dadar West",
        "incident_summary": "Collapsed municipal sewer line causing foul wastewater backflow onto crowded market sidewalk",
        "complaints": [
            "Severe sewage backflow from manhole on NC Kelkar Road near Plaza Cinema Dadar. Gutter water flooding the shopping street.",
            "Choked sewer line overflowing black drain water in front of shops near Plaza Cinema Dadar West. Pedestrians unable to cross.",
            "Filthy drainage water bubbling out of pavement chamber on NC Kelkar Marg. Unbearable stench in busy market area.",
            "Manhole blockage causing sewage overflow onto NC Kelkar Road near Plaza Cinema. Urgent desilting suction truck required.",
            "Open drainage spillage near Plaza Cinema signal Dadar West. Rotten gutter water entering storefronts.",
            "Gutter chamber cracked and overflowing with raw sewage right on NC Kelkar Road near Dadar Plaza. Major sanitary hazard."
        ]
    },
    {
        "cluster_id": "CLUST-ILLEGALCONST-14",
        "category": "Illegal Construction",
        "area_idx": 7,  # Kurla West
        "base_location": {"lat": 19.0680, "lng": 72.8790},
        "address": "Near Kurla West Railway Bus Depot, Station Road, Kurla West",
        "incident_summary": "Illegal permanent wooden & tin shop extensions blocking BEST bus turning radius outside station",
        "complaints": [
            "Unauthorized commercial shop extensions erected on public road outside Kurla West Bus Depot. BEST buses struggling to turn.",
            "Illegal wooden stalls and tin shed encroaching the bus depot entry lane at Kurla Station West. Causing massive traffic bottlenecks.",
            "Permanent illegal encroachment on station access road near Kurla West depot. Public footpath completely taken over by unauthorized vendors.",
            "Shopkeepers extending steel and tin structures onto the municipal road near Kurla Bus Depot. Severe obstruction to pedestrian flow.",
            "Encroachment on road boundary near Kurla West railway depot. Illegal constructions blocking emergency vehicle movement.",
            "New illegal shed constructed on municipal sidewalk outside Kurla station bus depot without any BMC municipal permit."
        ]
    },
    {
        "cluster_id": "CLUST-STRAYANIMAL-15",
        "category": "Stray Animal",
        "area_idx": 8,  # Powai Hiranandani & JVLR
        "base_location": {"lat": 19.1255, "lng": 72.9180},
        "address": "JVLR opposite IIT Bombay Main Gate, Powai",
        "incident_summary": "Herd of 6-8 unattended cattle sitting on central fast lane of JVLR near IIT Bombay causing traffic gridlock",
        "complaints": [
            "Herd of stray cows sitting in the middle of JVLR right opposite IIT Bombay Main Gate. Traffic backed up for 2 kms.",
            "Cattle menace on JVLR Powai near IIT entrance. Multiple cows blocking two main lanes, sudden braking causing near-accidents.",
            "Stray cattle wandering on the fast carriageway of JVLR in front of IIT Bombay. BMC cattle catcher van needed immediately.",
            "Big herd of stray cows blocking evening traffic near IIT Main Gate Powai on JVLR. Very dangerous for two-wheelers in low light.",
            "Stray cows gathered on JVLR road divider and carriageway opposite IIT gate. Huge vehicular traffic jam created.",
            "Several cows occupying the right lane on JVLR near IIT Bombay Powai gate. Heavy vehicles having to swerve dangerously."
        ]
    },
    {
        "cluster_id": "CLUST-NOISE-16",
        "category": "Noise Complaint",
        "area_idx": 6,  # Dadar West Shivaji Park
        "base_location": {"lat": 19.0265, "lng": 72.8390},
        "address": "Cadell Road, near Shivaji Park Gate 3, Dadar West",
        "incident_summary": "Commercial event using illegal high-decibel box speakers and DJ setup past midnight in silence zone",
        "complaints": [
            "Extremely loud amplified speakers blaring music after 11:30 PM near Shivaji Park Gate 3 on Cadell Road. Silence zone violation.",
            "Illegal DJ and loudspeaker system operating past midnight near Shivaji Park Cadell Road. High bass disturbing elderly residents.",
            "Noise pollution complaint: Heavy sound system running at high decibels near Cadell Road Shivaji Park entrance past permissible hours.",
            "Loud music and public address system continuing after midnight near Shivaji Park gate. Please take immediate action against organizers.",
            "Severe noise disturbance on Cadell Road Dadar near Shivaji Park due to midnight party speakers vibrating apartment windows.",
            "Sound limits completely exceeded past midnight near Shivaji Park Cadell Road. Please send police patrol van to stop the DJ music."
        ]
    },
    {
        "cluster_id": "CLUST-POTHOLE-17",
        "category": "Pothole",
        "area_idx": 9,  # Borivali West Gorai
        "base_location": {"lat": 19.2360, "lng": 72.8520},
        "address": "Near Gorai Bridge junction, Gorai 1, Borivali West",
        "incident_summary": "Series of deep waterlogged craters on descent of Gorai Bridge causing severe vehicular damage and bike falls",
        "complaints": [
            "Deadly pothole right at the bottom of Gorai Bridge slope in Borivali West. Multiple scooter riders slipping in waterlogged ditch.",
            "Massive craters formed on Gorai Bridge junction road Borivali West. Vehicles bottoming out and damaging suspensions.",
            "Broken road surface with deep holes near Gorai 1 bridge ramp. Daily traffic gridlock because auto rickshaws have to slow to a crawl.",
            "Deep pothole submerged under water near Gorai Bridge Borivali West. Very hazardous for two-wheelers traveling at normal speed.",
            "Severe road crater on the descent of Gorai bridge towards Link Road. Please do urgent cold mix patching before major accident occurs.",
            "Road completely ruined near Gorai Bridge junction Borivali West. Big potholes causing long vehicular queues during morning rush hour."
        ]
    }
]

# Single / distinct complaint templates across categories and neighborhoods
DISTINCT_TEMPLATES = [
    # Potholes
    ("Pothole", "Deep trench-like pothole observed around {landmark}. Vehicles are getting scratched underneath while passing."),
    ("Pothole", "Pothole formed around the storm drain manhole at {landmark}. Needs immediate asphalt patch work."),
    ("Pothole", "Uneven road surface and sunken patch along {landmark}, causing severe balance issues for two wheelers."),
    ("Pothole", "Large crater on the road near {landmark}. Buses cannot pull over properly to pick passengers."),
    ("Pothole", "Asphalt washed away creating multiple potholes outside the entrance of {landmark}."),
    ("Pothole", "Sharp-edged pothole on the left lane near {landmark}. Causing auto rickshaws to swerve into oncoming lane."),
    ("Pothole", "Sunken road patch and multiple small potholes developing rapidly along {landmark}."),
    ("Pothole", "Road surface stripped down to bare gravel and jagged stones near {landmark}."),
    
    # Streetlight
    ("Streetlight", "Streetlight pole flickering continuously outside {landmark}, causing visibility disturbance at night."),
    ("Streetlight", "Exposed wiring and sparking observed at the base of street lamp on {landmark}. Major safety hazard."),
    ("Streetlight", "Street light pole bent at 45 degree angle after vehicle collision near {landmark}. Might collapse anytime."),
    ("Streetlight", "Solar streetlight battery unit damaged and light not turning on near {landmark}."),
    ("Streetlight", "Underground cable fault caused single lamp outage opposite {landmark}."),
    ("Streetlight", "Sodium vapor lamp fused on the main mast light near {landmark}. Dark zone created on pedestrian crossing."),
    ("Streetlight", "Street lamp bracket broken and hanging loosely over traffic lane near {landmark}."),
    ("Streetlight", "Streetlight timer misconfigured; lights turning on at noon and switching off at dusk near {landmark}."),
    
    # Water Leak
    ("Water Leak", "Fire hydrant leaking clean water continuously on the pavement near {landmark}."),
    ("Water Leak", "Municipal water pipeline joint leaking into open stormwater drain near {landmark}."),
    ("Water Leak", "Slow water seepage through asphalt road surface creating a wet puddle outside {landmark}."),
    ("Water Leak", "Broken air valve on water supply line spraying water onto passing vehicles at {landmark}."),
    ("Water Leak", "Drinking water line connection cracked near public tap at {landmark}."),
    ("Water Leak", "Underground supply pipe leaking into stormwater gutter near {landmark}, massive wastage of potable water."),
    ("Water Leak", "Municipal distribution valve leaking water heavily onto the sidewalk near {landmark}."),
    ("Water Leak", "Submerged pipeline rupture causing fountain of drinking water near {landmark}."),
    
    # Garbage Collection
    ("Garbage Collection", "Green waste and tree branches dumped on the roadside near {landmark} not collected for a week."),
    ("Garbage Collection", "Community dustbin broken and garbage scattered around by animals near {landmark}."),
    ("Garbage Collection", "Construction debris and cement bags dumped illegally on the pavement near {landmark}."),
    ("Garbage Collection", "Dry waste collection van has not visited our locality near {landmark} for the past 5 days."),
    ("Garbage Collection", "Commercial vendor dumping organic waste in open drain near {landmark}."),
    ("Garbage Collection", "Litter bin overturned and plastic waste scattered across pedestrian walkway near {landmark}."),
    ("Garbage Collection", "Unsegregated garbage accumulation spreading across road curb near {landmark}."),
    ("Garbage Collection", "Hotel dumping discarded vegetable waste and plastic crates near {landmark} creating fly infestation."),
    
    # Sewage Overflow
    ("Sewage Overflow", "Storm water drain choked with plastic silt causing foul water to back up near {landmark}."),
    ("Sewage Overflow", "Broken drainage slab over nullah creating open sewage pool near {landmark}."),
    ("Sewage Overflow", "Underground drainage line blocked causing dirty water backflow in shops near {landmark}."),
    ("Sewage Overflow", "Gutter chamber overflowing into nearby residential compound gate near {landmark}."),
    ("Sewage Overflow", "Sewage water leaking into open garden area near {landmark}, strong unbearable odor."),
    ("Sewage Overflow", "Choked sewer inspection chamber discharging dark wastewater onto the street near {landmark}."),
    ("Sewage Overflow", "Blocked drain line causing contaminated gutter water to flood the footpath near {landmark}."),
    ("Sewage Overflow", "Broken nullah retaining wall spilling municipal sewage onto service road near {landmark}."),
    
    # Illegal Construction
    ("Illegal Construction", "Unauthorized hawker stalls erected on pedestrian walkway blocking fire exit near {landmark}."),
    ("Illegal Construction", "Residential building adding illegal cantilever structure without municipal NOC near {landmark}."),
    ("Illegal Construction", "Commercial restaurant converted open parking space into kitchen extension near {landmark}."),
    ("Illegal Construction", "Illegal billboard hoardings erected without structural stability certificate on {landmark}."),
    ("Illegal Construction", "Unauthorized road digging and trenching without municipal display board near {landmark}."),
    ("Illegal Construction", "Encroachment on storm water drain boundary by illegal tin shed shop near {landmark}."),
    ("Illegal Construction", "Unauthorized concrete ramp built across public footpath by commercial building near {landmark}."),
    ("Illegal Construction", "Illegal rooftop shed construction using corrugated metal sheets in residential building near {landmark}."),
    
    # Stray Animal
    ("Stray Animal", "Injured stray cow sitting in the middle of fast lane near {landmark}, causing traffic bottleneck."),
    ("Stray Animal", "Pack of aggressive stray dogs entered municipal park compound near {landmark}."),
    ("Stray Animal", "Stray cattle roaming around busy traffic junction near {landmark} during morning school hours."),
    ("Stray Animal", "Stray dog reported biting multiple passers-by near {landmark}. Urgent animal control needed."),
    ("Stray Animal", "Injured stray animal stuck on electric substation boundary wall near {landmark}."),
    ("Stray Animal", "Pack of feral dogs barking and chasing delivery bikes late at night near {landmark}."),
    ("Stray Animal", "Stray bulls fighting on main road causing pedestrian panic near {landmark}."),
    ("Stray Animal", "Injured stray dog in need of municipal veterinary rescue near {landmark}."),
    
    # Noise Complaint
    ("Noise Complaint", "Heavy construction drilling and rock excavation noise at 2:00 AM near residential flats at {landmark}."),
    ("Noise Complaint", "Auto repair workshop using loud pneumatic hammers and metal grinding in residential zone near {landmark}."),
    ("Noise Complaint", "Commercial banquet hall bursting firecrackers after midnight near {landmark}."),
    ("Noise Complaint", "Generator set of mobile tower making high decibel rattling noise 24/7 near {landmark}."),
    ("Noise Complaint", "Religious function using unauthorized horn loudspeakers above permissible decibel limits near {landmark}."),
    ("Noise Complaint", "Late night commercial loading and unloading causing loud clattering noise past 1:30 AM near {landmark}."),
    ("Noise Complaint", "Industrial exhaust fan vibrating loudly in residential building courtyard near {landmark}."),
    ("Noise Complaint", "Unauthorized musical event using high-wattage amplifiers without police/municipal permit near {landmark}.")
]


def random_citizen_id():
    """Generate realistic randomized citizen user id."""
    return f"usr_{random.randint(10000, 99999)}"


def random_timestamp_past_30_days(base_date=None):
    """Generate ISO 8601 timestamp within the last 30 days."""
    if base_date is None:
        # Reference current date September 2026
        base_date = datetime(2026, 8, 31, 20, 0, 0, tzinfo=timezone.utc)
    
    days_ago = random.uniform(0.1, 29.5)
    random_time = base_date - timedelta(days=days_ago)
    return random_time.strftime("%Y-%m-%dT%H:%M:%SZ")


def generate_dataset(target_total=350):
    """
    Generate dataset with:
    - Target: 350 total complaints
    - ~30% in realistic semantic duplicate clusters (~105 complaints across 17 clusters)
    - ~70% distinct single complaints (~245 complaints)
    """
    complaints = []
    cluster_records = []
    
    current_id_counter = 1001
    
    # 1. Generate Duplicate Clusters
    for cluster in CLUSTER_DEFINITIONS:
        c_id = cluster["cluster_id"]
        cat = cluster["category"]
        base_lat = cluster["base_location"]["lat"]
        base_lng = cluster["base_location"]["lng"]
        base_addr = cluster["address"]
        hub_idx = cluster["area_idx"]
        hub = NEIGHBORHOOD_HUBS[hub_idx]
        
        # Cluster base timestamp
        cluster_time_anchor = datetime(2026, 8, 31, 18, 0, 0, tzinfo=timezone.utc) - timedelta(days=random.uniform(1.0, 26.0))
        
        assigned_complaint_ids = []
        cluster_texts = cluster["complaints"]
        
        for text in cluster_texts:
            cmp_id = f"CMP_{current_id_counter:04d}"
            current_id_counter += 1
            assigned_complaint_ids.append(cmp_id)
            
            # Subtle GPS variation within 10 to 40 meters (0.0001 to 0.00035 degrees)
            jitter_lat = round(base_lat + random.uniform(-0.00025, 0.00025), 6)
            jitter_lng = round(base_lng + random.uniform(-0.00025, 0.00025), 6)
            
            # Timestamps for same cluster spread across 1 hour to 3 days
            ts_offset = timedelta(hours=random.uniform(0.5, 68.0))
            cmp_ts = (cluster_time_anchor + ts_offset).strftime("%Y-%m-%dT%H:%M:%SZ")
            
            complaints.append({
                "complaint_id": cmp_id,
                "citizen_id": random_citizen_id(),
                "description": text,
                "latitude": jitter_lat,
                "longitude": jitter_lng,
                "address_context": base_addr,
                "timestamp": cmp_ts,
                "category": cat,
                "is_duplicate_cluster": True,
                "cluster_id": c_id
            })
            
        cluster_records.append({
            "cluster_id": c_id,
            "category": cat,
            "incident_summary": cluster["incident_summary"],
            "neighborhood": hub["area"],
            "base_coordinates": {"latitude": base_lat, "longitude": base_lng},
            "address_context": base_addr,
            "cluster_size": len(assigned_complaint_ids),
            "complaint_ids": assigned_complaint_ids
        })

    cluster_complaint_count = len(complaints)
    distinct_target_count = target_total - cluster_complaint_count

    # 2. Generate Distinct Complaints (~70% of total)
    distinct_sample_templates = []
    while len(distinct_sample_templates) < distinct_target_count:
        # Pick from templates and cycle with randomized neighborhood hubs
        for cat, template in DISTINCT_TEMPLATES:
            if len(distinct_sample_templates) >= distinct_target_count:
                break
            hub = random.choice(NEIGHBORHOOD_HUBS)
            loc_entry = random.choice(hub["locations"])
            landmark = loc_entry["landmark"]
            addr = loc_entry["address"]
            
            lat = round(random.uniform(hub["lat_range"][0], hub["lat_range"][1]), 6)
            lng = round(random.uniform(hub["lng_range"][0], hub["lng_range"][1]), 6)
            
            desc = template.format(landmark=landmark)
            
            distinct_sample_templates.append({
                "category": cat,
                "description": desc,
                "latitude": lat,
                "longitude": lng,
                "address_context": addr,
                "timestamp": random_timestamp_past_30_days(),
            })

    # Shuffle distinct templates to ensure category/area variety
    random.shuffle(distinct_sample_templates)

    for item in distinct_sample_templates:
        cmp_id = f"CMP_{current_id_counter:04d}"
        current_id_counter += 1
        complaints.append({
            "complaint_id": cmp_id,
            "citizen_id": random_citizen_id(),
            "description": item["description"],
            "latitude": item["latitude"],
            "longitude": item["longitude"],
            "address_context": item["address_context"],
            "timestamp": item["timestamp"],
            "category": item["category"],
            "is_duplicate_cluster": False,
            "cluster_id": None
        })

    # Shuffle the combined dataset so cluster items are distributed realistically across time and index
    random.shuffle(complaints)
    
    return complaints, cluster_records


def export_files(complaints, cluster_records, output_dir="data"):
    """Export dataset to CSV, Citizen Intake JSON, and Known Clusters JSON."""
    os.makedirs(output_dir, exist_ok=True)
    
    csv_path = os.path.join(output_dir, "synthetic_complaints.csv")
    json_path = os.path.join(output_dir, "synthetic_complaints.json")
    clusters_path = os.path.join(output_dir, "known_duplicate_clusters.json")
    
    # 1. Export CSV
    csv_fields = [
        "complaint_id",
        "citizen_id",
        "category",
        "description",
        "latitude",
        "longitude",
        "address_context",
        "timestamp"
    ]
    
    with open(csv_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=csv_fields)
        writer.writeheader()
        for c in complaints:
            writer.writerow({
                "complaint_id": c["complaint_id"],
                "citizen_id": c["citizen_id"],
                "category": c["category"],
                "description": c["description"],
                "latitude": c["latitude"],
                "longitude": c["longitude"],
                "address_context": c["address_context"],
                "timestamp": c["timestamp"]
            })
            
    # 2. Export Citizen Intake Contract JSON format
    intake_json_data = {
        "metadata": {
            "dataset_version": "1.1.0",
            "region": "Mumbai / Thane Metropolitan Region (MMR)",
            "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "total_records": len(complaints),
            "cluster_records_count": sum(1 for c in complaints if c["is_duplicate_cluster"]),
            "distinct_records_count": sum(1 for c in complaints if not c["is_duplicate_cluster"])
        },
        "complaints": [
            {
                "complaint_id": c["complaint_id"],
                "citizen_id": c["citizen_id"],
                "description": c["description"],
                "category": c["category"],
                "location": {
                    "lat": c["latitude"],
                    "lng": c["longitude"]
                },
                "address_context": c["address_context"],
                "timestamp": c["timestamp"]
            }
            for c in complaints
        ]
    }
    
    with open(json_path, mode="w", encoding="utf-8") as f:
        json.dump(intake_json_data, f, indent=2, ensure_ascii=False)
        
    # 3. Export Ground Truth Duplicate Clusters JSON
    known_clusters_data = {
        "metadata": {
            "description": "Ground-truth semantic duplicate complaint clusters for benchmarking AI deduplication model",
            "evaluation_metric": "Precision, Recall, and F1-Score of Cluster Assignment / Pairwise Duplicate Matching",
            "total_clusters": len(cluster_records),
            "total_clustered_complaints": sum(c["cluster_size"] for c in cluster_records)
        },
        "clusters": cluster_records
    }
    
    with open(clusters_path, mode="w", encoding="utf-8") as f:
        json.dump(known_clusters_data, f, indent=2, ensure_ascii=False)

    return csv_path, json_path, clusters_path


if __name__ == "__main__":
    complaints, cluster_records = generate_dataset(target_total=350)
    csv_file, json_file, cluster_file = export_files(complaints, cluster_records, output_dir="data")
    
    total = len(complaints)
    clustered = sum(1 for c in complaints if c["is_duplicate_cluster"])
    distinct = total - clustered
    
    print(f"=== Synthetic Data Generation Completed ===")
    print(f"Total Complaints Generated : {total}")
    print(f"Clustered Complaints      : {clustered} ({clustered/total*100:.1f}%) across {len(cluster_records)} clusters")
    print(f"Distinct One-Offs         : {distinct} ({distinct/total*100:.1f}%)")
    print(f"CSV Output                : {csv_file}")
    print(f"JSON Output               : {json_file}")
    print(f"Clusters Ground Truth     : {cluster_file}")

