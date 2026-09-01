import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
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

export default function Analytics() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getComplaints();
        setComplaints(data.complaints);
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the grievance backend.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // -----------------------------------------
  // PRIORITY DATA
  // -----------------------------------------

  const priorityData = useMemo(() => {
    const priorities = [
      "CRITICAL",
      "HIGH",
      "MEDIUM",
      "LOW",
    ];

    return priorities.map((priority) => ({
      priority,
      complaints: complaints.filter(
        (c) =>
          c.classification.urgency ===
          priority
      ).length,
    }));
  }, [complaints]);

  // -----------------------------------------
  // STATUS DATA
  // -----------------------------------------

  const statusData = useMemo(() => {
    const statuses: Record<
      string,
      number
    > = {};

    complaints.forEach((complaint) => {
      const status =
        complaint.status.replace(
          /_/g,
          " "
        );

      statuses[status] =
        (statuses[status] || 0) + 1;
    });

    return Object.entries(statuses).map(
      ([status, count]) => ({
        status,
        count,
      })
    );
  }, [complaints]);

  // -----------------------------------------
  // CATEGORY DATA
  // -----------------------------------------

  const categoryData = useMemo(() => {
    const categories: Record<
      string,
      number
    > = {};

    complaints.forEach((complaint) => {
      const category =
        complaint.classification
          .category;

      categories[category] =
        (categories[category] || 0) + 1;
    });

    return Object.entries(categories)
      .map(([category, count]) => ({
        category,
        count,
      }))
      .sort(
        (a, b) => b.count - a.count
      )
      .slice(0, 8);
  }, [complaints]);

  // -----------------------------------------
  // DEPARTMENT DATA
  // -----------------------------------------

  const departmentData = useMemo(() => {
    const departments: Record<
      string,
      number
    > = {};

    complaints.forEach((complaint) => {
      const department =
        complaint.classification
          .department_routing;

      departments[department] =
        (departments[department] || 0) + 1;
    });

    return Object.entries(departments)
      .map(([department, count]) => ({
        department,
        count,
      }))
      .sort(
        (a, b) => b.count - a.count
      );
  }, [complaints]);

  // -----------------------------------------
  // DUPLICATES
  // -----------------------------------------

  const duplicateCount = complaints.filter(
    (c) =>
      c.duplicate_info.is_duplicate
  ).length;

  const uniqueCount =
    complaints.length - duplicateCount;

  const duplicateData = [
    {
      name: "Unique",
      value: uniqueCount,
    },
    {
      name: "Duplicates",
      value: duplicateCount,
    },
  ];

  // -----------------------------------------
  // SUMMARY
  // -----------------------------------------

  const total = complaints.length;

  const critical = complaints.filter(
    (c) =>
      c.classification.urgency ===
      "CRITICAL"
  ).length;

  const high = complaints.filter(
    (c) =>
      c.classification.urgency ===
      "HIGH"
  ).length;

  const resolved = complaints.filter(
    (c) =>
      c.status === "RESOLVED"
  ).length;

  const resolutionRate =
    total > 0
      ? ((resolved / total) * 100).toFixed(
          1
        )
      : "0";

  const pieColors = [
    "#6573ff",
    "#e57979",
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#303a55] border-t-[#6573ff]" />

          <p className="mt-4 text-sm text-[#929db6]">
            Loading analytics...
          </p>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">

        <h1 className="text-3xl font-bold text-[#f1f3f8]">
          Analytics
        </h1>

        <div className="rounded-[6px] border border-[#e57979]/30 bg-[#e57979]/10 p-6">

          <p className="font-semibold text-[#e57979]">
            Backend connection failed
          </p>

          <p className="mt-2 text-sm text-[#929db6]">
            {error}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-[#f1f3f8]">
          Analytics
        </h1>

        <p className="mt-2 text-sm text-[#929db6]">
          AI-powered insights from citizen grievance data.
        </p>

      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Total Complaints
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#f1f3f8]">
            {total}
          </h2>

          <p className="mt-1 text-xs text-[#6fcdb5]">
            Live backend data
          </p>

        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Critical + High
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#e57979]">
            {critical + high}
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            High-priority grievances
          </p>

        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            AI Duplicates
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6573ff]">
            {duplicateCount}
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Semantically grouped
          </p>

        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Resolution Rate
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6fcdb5]">
            {resolutionRate}%
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Based on current data
          </p>

        </div>

      </div>


      {/* ROW 1 */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* PRIORITY */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            Complaints by Priority
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            AI-generated urgency classification
          </p>

          <div className="mt-6 h-[300px]">

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
                />

                <Tooltip />

                <Bar
                  dataKey="complaints"
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


        {/* STATUS */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            Complaint Status
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Current grievance lifecycle
          </p>

          <div className="mt-6 h-[300px]">

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

                <Tooltip />

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

          </div>

        </div>

      </div>


      {/* ROW 2 */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* CATEGORY */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            Complaints by Category
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Most common grievance types
          </p>

          <div className="mt-6 h-[320px]">

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
                  width={150}
                  stroke="#929db6"
                  tick={{
                    fill: "#c4cada",
                    fontSize: 9,
                  }}
                />

                <Tooltip />

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

          </div>

        </div>


        {/* DUPLICATES */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            AI Duplicate Detection
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Unique versus semantically similar complaints
          </p>

          <div className="mt-6 h-[320px]">

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
                  outerRadius={100}
                  label
                >

                  {duplicateData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          pieColors[
                            index
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* DEPARTMENT ANALYTICS */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <h2 className="text-lg font-semibold text-[#f1f3f8]">
          Department Workload
        </h2>

        <p className="mt-1 text-xs text-[#929db6]">
          Number of grievances routed to each department by the AI classification system.
        </p>

        <div className="mt-6 h-[320px]">

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
                width={180}
                stroke="#929db6"
                tick={{
                  fill: "#c4cada",
                  fontSize: 9,
                }}
              />

              <Tooltip />

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

        </div>

      </div>

    </div>
  );
}