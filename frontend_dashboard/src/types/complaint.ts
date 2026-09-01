export interface Location {
  lat: number;
  lng: number;
  address_context: string;
}

export interface Classification {
  category: string;
  department_routing: string;
  priority_score: number;
  urgency: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

export interface DuplicateInfo {
  is_duplicate: boolean;
  cluster_id: string;
  similarity_score: number;
}

export interface Complaint {
  complaint_id: string;
  citizen_id: string;
  description: string;

  location: Location;

  image_url: string;

  classification: Classification;

  duplicate_info: DuplicateInfo;

  status: string;

  timestamp: string;
}

export interface ComplaintsResponse {
  total_count: number;
  complaints: Complaint[];
}