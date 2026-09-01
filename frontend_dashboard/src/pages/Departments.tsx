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

export default function Departments() {
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

  const departments = useMemo(() => {
    const map: Record<
      string,
      {
        department: string;
        complaints: number;
        critical: number;
        high: number;
        pending: number;
        resolved: number;
        duplicates: number;
      }
    > = {};

    complaints.forEach((complaint) => {
      const department =
        complaint.classification.department_routing ||
        "Unassigned Department";

      if (!map[department]) {
        map[department] = {
          department,
          complaints: 0,
          critical: 0,
          high: 0,
          pending: 0,
          resolved: 0,
          duplicates: 0,
        };
      }

      map[department].complaints++;

      if (
        complaint.classification.urgency === "CRITICAL"
      ) {
        map[department].critical++;
      }

      if (
        complaint.classification.urgency === "HIGH"
      ) {
        map[department].high++;
      }

      if (
        complaint.status === "UNASSIGNED" ||
        complaint.status === "PENDING"
      ) {
        map[department].pending++;
      }

      if (
        complaint.status === "RESOLVED"
      ) {
        map[department].resolved++;
      }

      if (
        complaint.duplicate_info.is_duplicate
      ) {
        map[department].duplicates++;
      }
    });

    return Object.values(map).sort(
      (a, b) => b.complaints - a.complaints
    );
  }, [complaints]);

  const totalDepartments = departments.length;

  const criticalComplaints = complaints.filter(
    (c) => c.classification.urgency === "CRITICAL"
  ).length;

  const pendingComplaints = complaints.filter(
    (c) =>
      c.status === "UNASSIGNED" ||
      c.status === "PENDING"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "RESOLVED"
  ).length;

  const pieData = departments.map((item) => ({
    name: item.department,
    value: item.complaints,
  }));

  const pieColors = [
    "#6573ff",
    "#6fcdb5",
    "#e5b45e",
    "#e57979",
    "#8b7cff",
    "#5da9e9",
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#303a55] border-t-[#6573ff]" />

          <p className="mt-4 text-sm text-[#929db6]">
            Loading department data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#f1f3f8]">
          Departments
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
          Department Overview
        </h1>

        <p className="mt-2 text-sm text-[#929db6]">
          Monitor grievance distribution and workload across government departments.
        </p>
      </div>


      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">
          <p className="text-xs uppercase text-[#929db6]">
            Departments
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#f1f3f8]">
            {totalDepartments}
          </h2>

          <p className="mt-1 text-xs text-[#6fcdb5]">
            Receiving complaints
          </p>
        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">
          <p className="text-xs uppercase text-[#929db6]">
            Critical
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#e57979]">
            {criticalComplaints}
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Immediate attention
          </p>
        </div>


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


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">
          <p className="text-xs uppercase text-[#929db6]">
            Resolved
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6fcdb5]">
            {resolvedComplaints}
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Successfully closed
          </p>
        </div>

      </div>


      {/* CHARTS */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* BAR CHART */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            Complaints by Department
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Department-wise grievance workload
          </p>

          <div className="mt-6 h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={departments}>

                <CartesianGrid
                  stroke="#303a55"
                  vertical={false}
                />

                <XAxis
                  dataKey="department"
                  stroke="#929db6"
                  tick={{
                    fill: "#c4cada",
                    fontSize: 10,
                  }}
                  angle={-20}
                  textAnchor="end"
                  height={80}
                />

                <YAxis
                  stroke="#929db6"
                  tick={{
                    fill: "#929db6",
                    fontSize: 10,
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="complaints"
                  fill="#6573ff"
                  radius={[3, 3, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* PIE CHART */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            Department Distribution
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Share of total complaints
          </p>

          <div className="mt-6 h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={100}
                  label
                >

                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        pieColors[
                          index % pieColors.length
                        ]
                      }
                    />
                  ))}

                </Pie>

                <Tooltip />

                <Legend
                  wrapperStyle={{
                    fontSize: "10px",
                    color: "#929db6",
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* DEPARTMENT TABLE */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <h2 className="text-lg font-semibold text-[#f1f3f8]">
          Department Performance
        </h2>

        <p className="mt-1 text-xs text-[#929db6]">
          Live statistics calculated from citizen complaints
        </p>

        <div className="mt-5 overflow-x-auto">

          <table className="w-full min-w-[900px] text-left">

            <thead className="bg-[#1b233a]">

              <tr>
                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Department
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Complaints
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Critical
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  High
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Pending
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Resolved
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Duplicates
                </th>
              </tr>

            </thead>

            <tbody>

              {departments.map((department) => (

                <tr
                  key={department.department}
                  className="border-t border-[#303a55] hover:bg-[#29334f]"
                >

                  <td className="px-4 py-4 text-sm font-semibold text-[#f1f3f8]">
                    {department.department}
                  </td>

                  <td className="px-4 py-4 text-sm font-bold text-[#6573ff]">
                    {department.complaints}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#e57979]">
                    {department.critical}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#e5b45e]">
                    {department.high}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#e5b45e]">
                    {department.pending}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#6fcdb5]">
                    {department.resolved}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#6573ff]">
                    {department.duplicates}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}