import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { getComplaints } from "../api/complaintsApi";
import type { Complaint } from "../types/complaint";

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH REAL DATA FROM BACKEND
  // =========================================================

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getComplaints();

      setComplaints(data.complaints);
    } catch (err) {
      console.error("Dashboard API error:", err);

      setError(
        "Unable to load dashboard data from the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // =========================================================
  // SUMMARY STATISTICS
  // =========================================================

  const totalComplaints = complaints.length;

  const criticalComplaints = complaints.filter(
    (complaint) =>
      complaint.classification.urgency === "CRITICAL"
  ).length;

  const highComplaints = complaints.filter(
    (complaint) =>
      complaint.classification.urgency === "HIGH"
  ).length;

  const pendingComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "UNASSIGNED" ||
      complaint.status === "PENDING"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "RESOLVED"
  ).length;

  const duplicateComplaints = complaints.filter(
    (complaint) =>
      complaint.duplicate_info.is_duplicate
  ).length;

  // =========================================================
  // RESOLUTION RATE
  // =========================================================

  const resolutionRate =
    totalComplaints > 0
      ? (
          (resolvedComplaints / totalComplaints) *
          100
        ).toFixed(1)
      : "0.0";

  // =========================================================
  // DEPARTMENT DATA
  // =========================================================

  const departmentData = useMemo(() => {
    const departmentMap: Record<string, number> = {};

    complaints.forEach((complaint) => {
      const department =
        complaint.classification.department_routing ||
        "Unassigned";

      departmentMap[department] =
        (departmentMap[department] || 0) + 1;
    });

    return Object.entries(departmentMap)
      .map(([department, count]) => ({
        department,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  // =========================================================
  // PRIORITY DATA
  // =========================================================

  const priorityData = useMemo(() => {
    const priorities = [
      "CRITICAL",
      "HIGH",
      "MEDIUM",
      "LOW",
    ];

    return priorities.map((priority) => ({
      priority,
      count: complaints.filter(
        (complaint) =>
          complaint.classification.urgency ===
          priority
      ).length,
    }));
  }, [complaints]);

  // =========================================================
  // STATUS DATA
  // =========================================================

  const statusData = useMemo(() => {
    const statusMap: Record<string, number> = {};

    complaints.forEach((complaint) => {
      const status =
        complaint.status
          ?.replace(/_/g, " ")
          .toUpperCase() || "UNKNOWN";

      statusMap[status] =
        (statusMap[status] || 0) + 1;
    });

    return Object.entries(statusMap).map(
      ([status, count]) => ({
        status,
        count,
      })
    );
  }, [complaints]);

  // =========================================================
  // CATEGORY DATA
  // =========================================================

  const categoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    complaints.forEach((complaint) => {
      const category =
        complaint.classification.category ||
        "Other";

      categoryMap[category] =
        (categoryMap[category] || 0) + 1;
    });

    return Object.entries(categoryMap)
      .map(([category, count]) => ({
        category,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [complaints]);

  // =========================================================
  // DUPLICATE DATA
  // =========================================================

  const duplicateData = [
    {
      name: "Unique",
      value:
        totalComplaints - duplicateComplaints,
    },
    {
      name: "Duplicates",
      value: duplicateComplaints,
    },
  ];

  // =========================================================
  // RECENT COMPLAINTS
  // =========================================================

  const recentComplaints = useMemo(() => {
    return [...complaints]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() -
          new Date(a.timestamp).getTime()
      )
      .slice(0, 5);
  }, [complaints]);

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#303a55] border-t-[#6573ff]" />

          <p className="mt-4 text-sm text-[#929db6]">
            Loading dashboard data...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-[#f1f3f8]">
            Authority Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#929db6]">
            AI-powered citizen grievance monitoring
          </p>
        </div>

        <div className="rounded-[6px] border border-[#e57979]/30 bg-[#e57979]/10 p-6">

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="font-semibold text-[#e57979]">
                Backend connection failed
              </p>

              <p className="mt-2 text-sm text-[#929db6]">
                {error}
              </p>

              <p className="mt-3 text-xs text-[#66718a]">
                API:
                {" "}
                http://localhost:8000/api/v1/admin/complaints
              </p>

            </div>

            <button
              onClick={loadComplaints}
              className="rounded-[4px] bg-[#6573ff] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              Retry
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN DASHBOARD
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <h1 className="text-3xl font-bold text-[#f1f3f8]">
            Authority Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#929db6]">
            AI-powered citizen grievance monitoring and analysis.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <div className="flex items-center gap-2 rounded-[4px] border border-[#303a55] bg-[#222b45] px-3 py-2">

            <span className="h-2 w-2 rounded-full bg-[#6fcdb5]" />

            <span className="text-xs text-[#929db6]">
              Live Backend Data
            </span>

          </div>

          <button
            onClick={loadComplaints}
            className="rounded-[4px] border border-[#303a55] bg-[#222b45] px-4 py-2 text-xs font-semibold text-[#6573ff] hover:border-[#6573ff]"
          >
            ↻ Refresh
          </button>

        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

        {/* TOTAL */}

        <div className="rounded-[5px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase tracking-wide text-[#929db6]">
            Total Complaints
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#f1f3f8]">
            {totalComplaints}
          </h2>

          <p className="mt-2 text-xs text-[#929db6]">
            Received by the system
          </p>

        </div>


        {/* CRITICAL */}

        <div className="rounded-[5px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase tracking-wide text-[#929db6]">
            Critical
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#e57979]">
            {criticalComplaints}
          </h2>

          <p className="mt-2 text-xs text-[#929db6]">
            Immediate attention
          </p>

        </div>


        {/* HIGH */}

        <div className="rounded-[5px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase tracking-wide text-[#929db6]">
            High Priority
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#e5b45e]">
            {highComplaints}
          </h2>

          <p className="mt-2 text-xs text-[#929db6]">
            Require timely action
          </p>

        </div>


        {/* DUPLICATES */}

        <div className="rounded-[5px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase tracking-wide text-[#929db6]">
            AI Duplicates
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#6573ff]">
            {duplicateComplaints}
          </h2>

          <p className="mt-2 text-xs text-[#929db6]">
            Semantically similar
          </p>

        </div>


        {/* RESOLUTION */}

        <div className="rounded-[5px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase tracking-wide text-[#929db6]">
            Resolution Rate
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#6fcdb5]">
            {resolutionRate}%
          </h2>

          <p className="mt-2 text-xs text-[#929db6]">
            Current resolved ratio
          </p>

        </div>

      </div>


      {/* =====================================================
          PRIORITY + STATUS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* PRIORITY CHART */}

        <div className="rounded-[5px] border border-[#303a55] bg-[#222b45] p-6">

          <div>

            <h2 className="text-lg font-semibold text-[#f1f3f8]">
              Complaint Priority
            </h2>

            <p className="mt-1 text-xs text-[#929db6]">
              AI-generated urgency classification
            </p>

          </div>

          <div className="mt-6 h-[280px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={priorityData}>

                <CartesianGrid
                  stroke="#303a55"
                  vertical={false}
                />

                <XAxis
                  dataKey="priority"
                  stroke="#929db6"
                  tick={{
                    fill: "#c4cada",
                    fontSize: 10,
                  }}
                />

                <YAxis
                  stroke="#929db6"
                  tick={{
                    fill: "#929db6",
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1b233a",
                    border:
                      "1px solid #303a55",
                    borderRadius: "4px",
                    color: "#f1f3f8",
                  }}
                />

                <Bar
                  dataKey="count"
                  fill="#6573ff"
                  radius={[
                    3,
                    3,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* STATUS CHART */}

        <div className="rounded-[5px] border border-[#303a55] bg-[#222b45] p-6">

          <div>

            <h2 className="text-lg font-semibold text-[#f1f3f8]">
              Complaint Status
            </h2>

            <p className="mt-1 text-xs text-[#929db6]">
              Current grievance lifecycle
            </p>

          </div>

          <div className="mt-6 h-[280px]">

            {statusData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart data={statusData}>

                  <CartesianGrid
                    stroke="#303a55"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="status"
                    stroke="#929db6"
                    tick={{
                      fill: "#c4cada",
                      fontSize: 9,
                    }}
                    angle={-20}
                    textAnchor="end"
                    height={70}
                  />

                  <YAxis
                    stroke="#929db6"
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        "#1b233a",
                      border:
                        "1px solid #303a55",
                      borderRadius: "4px",
                      color: "#f1f3f8",
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="#6fcdb5"
                    radius={[
                      3,
                      3,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-full items-center justify-center text-sm text-[#929db6]">
                No status data available
              </div>

            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          DEPARTMENT + DUPLICATE
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* DEPARTMENT */}

        <div className="rounded-[5px] border border-[#303a55] bg-[#222b45] p-6">

          <div>

            <h2 className="text-lg font-semibold text-[#f1f3f8]">
              Department Workload
            </h2>

            <p className="mt-1 text-xs text-[#929db6]">
              Complaints routed by the AI classification system
            </p>

          </div>

          <div className="mt-6 h-[300px]">

            {departmentData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={departmentData}
                  layout="vertical"
                >

                  <CartesianGrid
                    stroke="#303a55"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    stroke="#929db6"
                  />

                  <YAxis
                    type="category"
                    dataKey="department"
                    width={160}
                    stroke="#929db6"
                    tick={{
                      fill: "#c4cada",
                      fontSize: 9,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        "#1b233a",
                      border:
                        "1px solid #303a55",
                      borderRadius: "4px",
                      color: "#f1f3f8",
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="#6573ff"
                    radius={[
                      0,
                      3,
                      3,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-full items-center justify-center text-sm text-[#929db6]">
                No department data available
              </div>

            )}

          </div>

        </div>


        {/* DUPLICATE */}

        <div className="rounded-[5px] border border-[#303a55] bg-[#222b45] p-6">

          <div>

            <h2 className="text-lg font-semibold text-[#f1f3f8]">
              AI Duplicate Detection
            </h2>

            <p className="mt-1 text-xs text-[#929db6]">
              Unique versus duplicate grievances
            </p>

          </div>

          <div className="mt-6 h-[300px]">

            {totalComplaints > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={duplicateData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={95}
                    label
                  >

                    <Cell fill="#6573ff" />

                    <Cell fill="#e57979" />

                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        "#1b233a",
                      border:
                        "1px solid #303a55",
                      borderRadius: "4px",
                      color: "#f1f3f8",
                    }}
                  />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-full items-center justify-center text-sm text-[#929db6]">
                No complaint data available
              </div>

            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          CATEGORY
      ===================================================== */}

      <div className="rounded-[5px] border border-[#303a55] bg-[#222b45] p-6">

        <div>

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            Top Complaint Categories
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Most frequently reported grievance categories
          </p>

        </div>

        <div className="mt-6 h-[280px]">

          {categoryData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={categoryData}
                layout="vertical"
              >

                <CartesianGrid
                  stroke="#303a55"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  stroke="#929db6"
                />

                <YAxis
                  type="category"
                  dataKey="category"
                  width={180}
                  stroke="#929db6"
                  tick={{
                    fill: "#c4cada",
                    fontSize: 9,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      "#1b233a",
                    border:
                      "1px solid #303a55",
                    borderRadius: "4px",
                    color: "#f1f3f8",
                  }}
                />

                <Bar
                  dataKey="count"
                  fill="#e5b45e"
                  radius={[
                    0,
                    3,
                    3,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div className="flex h-full items-center justify-center text-sm text-[#929db6]">
              No category data available
            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          RECENT COMPLAINTS
      ===================================================== */}

      <div className="rounded-[5px] border border-[#303a55] bg-[#222b45]">

        <div className="flex items-center justify-between border-b border-[#303a55] px-6 py-5">

          <div>

            <h2 className="text-lg font-semibold text-[#f1f3f8]">
              Recent Complaints
            </h2>

            <p className="mt-1 text-xs text-[#929db6]">
              Latest grievances received by the authority
            </p>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-left">

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
                  Duplicate
                </th>

                <th className="px-5 py-4 text-xs uppercase text-[#929db6]">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {recentComplaints.length > 0 ? (

                recentComplaints.map(
                  (complaint) => (

                    <tr
                      key={
                        complaint.complaint_id
                      }
                      className="border-t border-[#303a55] hover:bg-[#29334f]"
                    >

                      {/* COMPLAINT */}

                      <td className="px-5 py-4">

                        <p className="text-xs font-bold text-[#6573ff]">
                          {
                            complaint.complaint_id
                          }
                        </p>

                        <p className="mt-1 max-w-[320px] truncate text-sm font-medium text-[#f1f3f8]">
                          {
                            complaint.description
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-[#929db6]">
                          {
                            complaint.location
                              .address_context
                          }
                        </p>

                      </td>


                      {/* CATEGORY */}

                      <td className="px-5 py-4 text-xs text-[#c4cada]">

                        {
                          complaint
                            .classification
                            .category
                        }

                      </td>


                      {/* DEPARTMENT */}

                      <td className="px-5 py-4 text-xs text-[#c4cada]">

                        {
                          complaint
                            .classification
                            .department_routing
                        }

                      </td>


                      {/* PRIORITY */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-[4px] px-2 py-1 text-[10px] font-bold ${
                            complaint
                              .classification
                              .urgency ===
                            "CRITICAL"
                              ? "bg-[#e57979]/10 text-[#e57979]"
                              : complaint
                                    .classification
                                    .urgency ===
                                "HIGH"
                              ? "bg-[#e5b45e]/10 text-[#e5b45e]"
                              : complaint
                                    .classification
                                    .urgency ===
                                "MEDIUM"
                              ? "bg-[#6573ff]/10 text-[#6573ff]"
                              : "bg-[#6fcdb5]/10 text-[#6fcdb5]"
                          }`}
                        >

                          {
                            complaint
                              .classification
                              .urgency
                          }

                        </span>

                      </td>


                      {/* DUPLICATE */}

                      <td className="px-5 py-4">

                        {complaint
                          .duplicate_info
                          .is_duplicate ? (

                          <span className="text-[10px] font-semibold text-[#e57979]">
                            Duplicate
                          </span>

                        ) : (

                          <span className="text-[10px] font-semibold text-[#6fcdb5]">
                            Unique
                          </span>

                        )}

                      </td>


                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span className="text-xs text-[#c4cada]">
                          ●{" "}
                          {complaint.status.replace(
                            /_/g,
                            " "
                          )}
                        </span>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-[#929db6]"
                  >
                    No complaints available from the backend.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          FOOTER INFORMATION
      ===================================================== */}

      <div className="flex flex-col gap-2 border-t border-[#303a55] pt-4 text-[10px] text-[#66718a] md:flex-row md:justify-between">

        <span>
          Data source: Authority grievance API
        </span>

        <span>
          GET /api/v1/admin/complaints
        </span>

      </div>

    </div>
  );
}