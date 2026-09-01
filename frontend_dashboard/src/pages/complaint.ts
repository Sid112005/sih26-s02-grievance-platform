export interface Complaint {
  complaint_id: string;
  citizen_id: string;
  description: string;

  location: {
    lat: number;
    lng: number;
    address_context: string;
  };

  image_url: string;

  classification: {
    category: string;
    department_routing: string;
    priority_score: number;
    urgency: string;
  };

  duplicate_info: {
    is_duplicate: boolean;
    cluster_id: string;
    similarity_score: number;
  };

  status: string;
  timestamp: string;
}

export interface ComplaintsResponse {
  total_count: number;
  complaints: Complaint[];
}