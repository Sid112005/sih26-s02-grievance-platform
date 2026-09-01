import { useEffect, useMemo, useState } from "react";
import { getComplaints } from "../api/complaintsApi";
import type { Complaint } from "../types/complaint";

export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // ---------------------------------------------
  // FETCH DATA FROM BACKEND
  // ---------------------------------------------

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getComplaints();

        setComplaints(data.complaints);
      } catch (err) {
        console.error("Complaint API Error:", err);

        setError(
          "Unable to connect to the grievance backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  // ---------------------------------------------
  // FILTER COMPLAINTS
  // ---------------------------------------------

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        complaint.complaint_id
          .toLowerCase()
          .includes(searchText) ||

        complaint.citizen_id
          .toLowerCase()
          .includes(searchText) ||

        complaint.description
          .toLowerCase()
          .includes(searchText) ||

        complaint.location.address_context
          .toLowerCase()
          .includes(searchText) ||

        complaint.classification.category
          .toLowerCase()
          .includes(searchText);

      const backendStatus =
        complaint.status.replace(/_/g, " ");

      const backendPriority =
        complaint.classification.urgency;

      const matchesStatus =
        statusFilter === "All" ||
        backendStatus.toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesPriority =
        priorityFilter === "All" ||
        backendPriority.toLowerCase() ===
          priorityFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    complaints,
    search,
    statusFilter,
    priorityFilter,
  ]);

  // ---------------------------------------------
  // SUMMARY COUNTS
  // ---------------------------------------------

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "UNASSIGNED" ||
      complaint.status === "PENDING"
  ).length;

  const criticalComplaints = complaints.filter(
    (complaint) =>
      complaint.classification.urgency === "CRITICAL"
  ).length;

  const duplicateComplaints = complaints.filter(
    (complaint) =>
      complaint.duplicate_info.is_duplicate
  ).length;

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#303a55] border-t-[#6573ff]" />

          <p className="mt-4 text-sm font-medium text-[#929db6]">
            Loading complaints...
          </p>

          <p className="mt-1 text-xs text-[#66718a]">
            Connecting to grievance backend
          </p>

        </div>
      </div>
    );
  }

  // ---------------------------------------------
  // ERROR
  // ---------------------------------------------

  if (error) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-[#f1f3f8]">
            Complaints
          </h1>

          <p className="mt-2 text-sm text-[#929db6]">
            Manage, classify, prioritize and track
            citizen grievances.
          </p>
        </div>

        <div className="rounded-[6px] border border-[#e57979]/30 bg-[#e57979]/10 p-6">

          <div className="flex items-start gap-4">

            <div className="text-2xl">
              ⚠️
            </div>

            <div>

              <h2 className="font-semibold text-[#e57979]">
                Backend connection failed
              </h2>

              <p className="mt-2 text-sm text-[#929db6]">
                {error}
              </p>

              <div className="mt-4 rounded-[4px] bg-[#171d2d] p-3">

                <p className="text-[10px] uppercase tracking-wider text-[#66718a]">
                  API Endpoint
                </p>

                <p className="mt-1 break-all font-mono text-xs text-[#6573ff]">
                  GET http://localhost:8000/api/v1/admin/complaints
                </p>

              </div>

              <p className="mt-4 text-xs text-[#66718a]">
                Make sure the backend is running and CORS
                allows your frontend.
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ---------------------------------------------
  // MAIN UI
  // ---------------------------------------------

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-[#f1f3f8]">
          Complaints
        </h1>

        <p className="mt-2 text-sm text-[#929db6]">
          Manage, classify, prioritize and track citizen grievances.
        </p>

      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Total Complaints
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#f1f3f8]">
            {totalComplaints.toLocaleString()}
          </h2>

          <p className="mt-1 text-xs text-[#6fcdb5]">
            Live from backend
          </p>

        </div>


        {/* PENDING */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Pending
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#e5b45e]">
            {pendingComplaints}
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Awaiting action
          </p>

        </div>


        {/* CRITICAL */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Critical
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#e57979]">
            {criticalComplaints}
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Require immediate action
          </p>

        </div>


        {/* DUPLICATES */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Duplicates
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6573ff]">
            {duplicateComplaints}
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Detected by AI
          </p>

        </div>

      </div>


      {/* FILTERS */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-4">

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search complaint, citizen or location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="rounded-[4px] border border-[#303a55] bg-[#1b233a] px-4 py-2.5 text-sm text-[#f1f3f8] outline-none placeholder:text-[#66718a] focus:border-[#6573ff]"
          />


          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-[4px] border border-[#303a55] bg-[#1b233a] px-4 py-2.5 text-sm text-[#f1f3f8] outline-none focus:border-[#6573ff]"
          >

            <option value="All">
              All Status
            </option>

            <option value="UNASSIGNED">
              Unassigned
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="ASSIGNED">
              Assigned
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="RESOLVED">
              Resolved
            </option>

            <option value="ESCALATED">
              Escalated
            </option>

          </select>


          {/* PRIORITY */}

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
            className="rounded-[4px] border border-[#303a55] bg-[#1b233a] px-4 py-2.5 text-sm text-[#f1f3f8] outline-none focus:border-[#6573ff]"
          >

            <option value="All">
              All Priority
            </option>

            <option value="CRITICAL">
              Critical
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="LOW">
              Low
            </option>

          </select>

        </div>

      </div>


      {/* TABLE */}

      <div className="overflow-hidden rounded-[4px] border border-[#303a55] bg-[#222b45]">

        <div className="flex items-center justify-between border-b border-[#303a55] px-5 py-4">

          <div>

            <h2 className="text-sm font-semibold text-[#f1f3f8]">
              Citizen Complaints
            </h2>

            <p className="mt-1 text-xs text-[#66718a]">
              AI-classified grievances received from citizens
            </p>

          </div>

          <span className="rounded-[4px] bg-[#6573ff]/10 px-3 py-1 text-xs font-semibold text-[#6573ff]">
            {filteredComplaints.length} Results
          </span>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px] text-left">

            <thead className="bg-[#1b233a]">

              <tr>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Complaint
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Category
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Department
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Priority
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  AI Duplicate
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Status
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Evidence
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredComplaints.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >

                    <p className="text-2xl">
                      🔎
                    </p>

                    <p className="mt-3 text-sm font-semibold text-[#f1f3f8]">
                      No complaints found
                    </p>

                    <p className="mt-1 text-xs text-[#66718a]">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredComplaints.map(
                  (complaint) => (

                    <tr
                      key={complaint.complaint_id}
                      className="border-t border-[#303a55] hover:bg-[#29334f]"
                    >

                      {/* COMPLAINT */}

                      <td className="px-5 py-4">

                        <p className="text-xs font-bold text-[#6573ff]">
                          {complaint.complaint_id}
                        </p>

                        <p className="mt-1 max-w-[300px] text-sm font-medium text-[#f1f3f8]">
                          {complaint.description}
                        </p>

                        <p className="mt-1 text-[10px] text-[#929db6]">
                          {complaint.citizen_id}
                        </p>

                        <p className="mt-1 text-[10px] text-[#929db6]">
                          📍{" "}
                          {complaint.location.address_context}
                        </p>

                        <p className="mt-1 text-[10px] text-[#66718a]">
                          {new Date(
                            complaint.timestamp
                          ).toLocaleString()}
                        </p>

                      </td>


                      {/* CATEGORY */}

                      <td className="px-5 py-4">

                        <span className="rounded-[4px] bg-[#6573ff]/10 px-2 py-1 text-xs font-medium text-[#7f8aff]">

                          {
                            complaint.classification
                              .category
                          }

                        </span>

                      </td>


                      {/* DEPARTMENT */}

                      <td className="px-5 py-4 text-xs text-[#c4cada]">

                        {
                          complaint.classification
                            .department_routing
                        }

                      </td>


                      {/* PRIORITY */}

                      <td className="px-5 py-4">

                        <div className="flex flex-col gap-1">

                          <span
                            className={`w-fit rounded-[4px] px-2 py-1 text-[10px] font-bold ${
                              complaint.classification
                                .urgency === "CRITICAL"
                                ? "bg-[#e57979]/10 text-[#e57979]"
                                : complaint.classification
                                    .urgency === "HIGH"
                                ? "bg-[#e5b45e]/10 text-[#e5b45e]"
                                : complaint.classification
                                    .urgency === "MEDIUM"
                                ? "bg-[#6573ff]/10 text-[#6573ff]"
                                : "bg-[#6fcdb5]/10 text-[#6fcdb5]"
                            }`}
                          >

                            {
                              complaint.classification
                                .urgency
                            }

                          </span>

                          <span className="text-[10px] text-[#929db6]">

                            Score:{" "}
                            {
                              complaint.classification
                                .priority_score
                            }

                            /10

                          </span>

                        </div>

                      </td>


                      {/* DUPLICATE */}

                      <td className="px-5 py-4">

                        {complaint.duplicate_info
                          .is_duplicate ? (

                          <div>

                            <span className="rounded-[4px] bg-[#e57979]/10 px-2 py-1 text-[10px] font-semibold text-[#e57979]">
                              ⚠ Duplicate
                            </span>

                            <p className="mt-2 text-[10px] text-[#929db6]">
                              Cluster:{" "}
                              {
                                complaint
                                  .duplicate_info
                                  .cluster_id
                              }
                            </p>

                            <p className="mt-1 text-[10px] text-[#929db6]">
                              Similarity:{" "}
                              {
                                complaint
                                  .duplicate_info
                                  .similarity_score
                              }
                            </p>

                          </div>

                        ) : (

                          <span className="rounded-[4px] bg-[#6fcdb5]/10 px-2 py-1 text-[10px] font-semibold text-[#6fcdb5]">
                            ✓ Unique
                          </span>

                        )}

                      </td>


                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span className="text-xs text-[#c4cada]">

                          <span className="mr-1 text-[#6573ff]">
                            ●
                          </span>

                          {complaint.status.replace(
                            /_/g,
                            " "
                          )}

                        </span>

                      </td>


                      {/* IMAGE */}

                      <td className="px-5 py-4">

                        {complaint.image_url ? (

                          <button
                            onClick={() =>
                              window.open(
                                complaint.image_url,
                                "_blank"
                              )
                            }
                            className="overflow-hidden rounded-[4px] border border-[#303a55] hover:border-[#6573ff]"
                          >

                            <img
                              src={
                                complaint.image_url
                              }
                              alt="Complaint evidence"
                              className="h-12 w-16 object-cover"
                            />

                          </button>

                        ) : (

                          <span className="text-[10px] text-[#66718a]">
                            No image
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}