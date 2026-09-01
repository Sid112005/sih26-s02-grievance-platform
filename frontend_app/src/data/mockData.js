// JanSeva AI - Mock Data Store

export const DEMO_USER = {
  id: "usr_98765",
  name: "Siddhi",
  mobile: "9876543210",
  email: "siddhi.citizen@example.com",
  address: "Flat 402, Green Park Society, Ward 4, Central Zone",
  role: "CITIZEN"
};

export const INITIAL_COMPLAINTS = [
  {
    complaint_id: "GRV-2026-8941",
    citizen_id: "usr_98765",
    title: "Water pipe leak on MG Road Ward 4",
    description: "Main underground water pipe is leaking heavily near MG Road Signal Ward 4. Water is overflowing onto the street causing traffic congestion and water shortage in local buildings.",
    location: {
      lat: 19.1834,
      lng: 72.9633,
      address_context: "MG Road Signal, Ward 4, Central Zone"
    },
    category: "Water Supply & Sanitation",
    department: "Municipal Corporation",
    priority_score: 8.8,
    urgency: "HIGH",
    status: "IN_PROGRESS",
    assigned_officer: "Rajesh V. (Zonal Engineer)",
    duplicate_detection: {
      is_duplicate: true,
      cluster_id: "cluster_water_042",
      similarity_score: 0.94,
      similar_count: 3
    },
    image: {
      file_name: "water_leak_mg_road.jpg",
      preview_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80"
    },
    created_at: "2026-09-01T08:30:00Z",
    updated_at: "2026-09-01T10:15:00Z"
  },
  {
    complaint_id: "GRV-2026-8890",
    citizen_id: "usr_98765",
    title: "Street light malfunction near Sector 12 Park",
    description: "Three consecutive streetlights are out near Sector 12 community park. The entire stretch has been completely dark at night for the past 4 days.",
    location: {
      lat: 19.1792,
      lng: 72.9580,
      address_context: "Sector 12 Park Outer Road"
    },
    category: "Electricity & Power",
    department: "Municipal Electrical Dept",
    priority_score: 6.2,
    urgency: "MEDIUM",
    status: "RESOLVED",
    assigned_officer: "Amit Kumar (Electrical Supervisor)",
    duplicate_detection: {
      is_duplicate: false,
      cluster_id: null,
      similarity_score: 0.0,
      similar_count: 0
    },
    image: {
      file_name: "streetlight_sector12.jpg",
      preview_url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80"
    },
    created_at: "2026-08-29T14:20:00Z",
    updated_at: "2026-08-31T11:00:00Z"
  },
  {
    complaint_id: "GRV-2026-8812",
    citizen_id: "usr_98765",
    title: "Delayed birth certificate processing at Zonal office",
    description: "Applied for birth certificate (App Ref #BC-9921) over 3 weeks ago. The counter staff stated processing is delayed due to backlog.",
    location: {
      lat: 19.1850,
      lng: 72.9710,
      address_context: "Zonal Civil Registration Office, Gate 2"
    },
    category: "Revenue & Admin Services",
    department: "Revenue Department",
    priority_score: 4.1,
    urgency: "LOW",
    status: "PENDING",
    assigned_officer: "S. K. Kulkarni (Despatch Officer)",
    duplicate_detection: {
      is_duplicate: false,
      cluster_id: null,
      similarity_score: 0.0,
      similar_count: 0
    },
    image: null,
    created_at: "2026-08-25T11:00:00Z",
    updated_at: "2026-08-25T11:00:00Z"
  },
  {
    complaint_id: "GRV-2026-8755",
    citizen_id: "usr_98765",
    title: "Uncollected garbage dump behind Central Market",
    description: "Solid waste has been piling up behind the Central Wholesale Market for 5 days without daily sanitation pickup. Strong odor and pest risk.",
    location: {
      lat: 19.1810,
      lng: 72.9650,
      address_context: "Behind Lane 3, Central Wholesale Market"
    },
    category: "Public Health & Sanitation",
    department: "Sanitation Department",
    priority_score: 8.1,
    urgency: "HIGH",
    status: "ASSIGNED",
    assigned_officer: "Dr. P. N. Deshmukh (Health Inspector)",
    duplicate_detection: {
      is_duplicate: true,
      cluster_id: "cluster_sanitation_102",
      similarity_score: 0.89,
      similar_count: 5
    },
    image: {
      file_name: "garbage_dump_market.jpg",
      preview_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80"
    },
    created_at: "2026-08-22T09:15:00Z",
    updated_at: "2026-08-23T10:00:00Z"
  },
  {
    complaint_id: "GRV-2026-8952",
    citizen_id: "usr_98765",
    title: "Dangerous deep pothole near railway station exit",
    description: "There is a large pothole near the railway station exit that has been causing traffic problems and two-wheeler skidding for the last three days.",
    location: {
      lat: 19.1834,
      lng: 72.9633,
      address_context: "Main Station Road, West Exit"
    },
    category: "Public Infrastructure",
    department: "Municipal Corporation",
    priority_score: 8.5,
    urgency: "HIGH",
    status: "IN_PROGRESS",
    assigned_officer: "Zonal Roads Engineer - Zone 3",
    duplicate_detection: {
      is_duplicate: true,
      cluster_id: "cluster_infra_009",
      similarity_score: 0.92,
      similar_count: 4
    },
    image: {
      file_name: "pothole_station_road.jpg",
      preview_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
    },
    created_at: "2026-09-01T09:55:00Z",
    updated_at: "2026-09-01T09:56:00Z"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif_101",
    complaint_id: "GRV-2026-8941",
    message: "Your complaint GRV-2026-8941 has been assigned to the Municipal Corporation.",
    time: "2 hours ago",
    read: false,
    type: "ASSIGNMENT"
  },
  {
    id: "notif_102",
    complaint_id: "GRV-2026-8890",
    message: "GRV-2026-8890 has been resolved by Municipal Electrical Dept.",
    time: "Yesterday",
    read: true,
    type: "RESOLUTION"
  },
  {
    id: "notif_103",
    complaint_id: "GRV-2026-8812",
    message: "GRV-2026-8812 is awaiting authority action.",
    time: "3 days ago",
    read: true,
    type: "STATUS_UPDATE"
  }
];
