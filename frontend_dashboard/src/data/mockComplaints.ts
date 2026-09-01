export interface Complaint {
  id: string;
  title: string;
  category: string;
  department: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Pending" | "In Progress" | "Resolved";
  location: string;
  date: string;
}

export const complaints: Complaint[] = [
  {
    id: "GRV-1024",
    title: "Large pothole near City School",
    category: "Road Damage",
    department: "Roads",
    priority: "High",
    status: "Pending",
    location: "Shivaji Nagar",
    date: "01 Sep 2026",
  },
  {
    id: "GRV-1023",
    title: "Garbage not collected for several days",
    category: "Garbage",
    department: "Sanitation",
    priority: "Medium",
    status: "In Progress",
    location: "Andheri East",
    date: "01 Sep 2026",
  },
  {
    id: "GRV-1022",
    title: "Street light not working",
    category: "Street Lighting",
    department: "Electrical",
    priority: "Low",
    status: "Resolved",
    location: "Dadar",
    date: "31 Aug 2026",
  },
  {
    id: "GRV-1021",
    title: "Water pipeline leakage on main road",
    category: "Water Supply",
    department: "Water Department",
    priority: "Critical",
    status: "In Progress",
    location: "Kurla",
    date: "31 Aug 2026",
  },
  {
    id: "GRV-1020",
    title: "Blocked drainage causing water accumulation",
    category: "Drainage",
    department: "Municipal",
    priority: "High",
    status: "Pending",
    location: "Borivali",
    date: "30 Aug 2026",
  },
];