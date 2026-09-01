import type { ComplaintsResponse } from "../types/complaint";

const API_URL =
  "http://localhost:8000/api/v1/admin/complaints";

export async function getComplaints(): Promise<ComplaintsResponse> {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Backend returned ${response.status}`
    );
  }

  return response.json();
}