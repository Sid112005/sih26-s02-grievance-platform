import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const departments = [
  {
    name: "Water Supply",
    head: "Anil Mehta",
    complaints: 1240,
    resolved: 940,
    pending: 210,
    critical: 90,
    avgTime: "2.4 days",
  },
  {
    name: "Electricity",
    head: "Rajesh Kumar",
    complaints: 980,
    resolved: 790,
    pending: 140,
    critical: 50,
    avgTime: "1.8 days",
  },
  {
    name: "Roads & Infrastructure",
    head: "Sanjay Verma",
    complaints: 860,
    resolved: 610,
    pending: 180,
    critical: 70,
    avgTime: "4.2 days",
  },
  {
    name: "Sanitation",
    head: "Meena Joshi",
    complaints: 720,
    resolved: 590,
    pending: 100,
    critical: 30,
    avgTime: "2.1 days",
  },
  {
    name: "Public Safety",
    head: "Vivek Singh",
    complaints: 540,
    resolved: 420,
    pending: 80,
    critical: 40,
    avgTime: "1.5 days",
  },
  {
    name: "Transport",
    head: "Karan Patel",
    complaints: 420,
    resolved: 330,
    pending: 70,
    critical: 20,
    avgTime: "3.1 days",
  },
];

const chartData = departments.map((department) => ({
  department: department.name,
  complaints: department.complaints,
  resolved: department.resolved,
}));

export default function Departments() {
  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-[#f1f3f8]">
          Departments
        </h1>

        <p className="mt-2 text-sm text-[#929db6]">
          Monitor department workload, performance and grievance resolution.
        </p>
      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">
          <p className="text-xs uppercase text-[#929db6]">
            Active Departments
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6573ff]">
            6
          </h2>
        </div>

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">
          <p className="text-xs uppercase text-[#929db6]">
            Total Assigned
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#f1f3f8]">
            4,760
          </h2>
        </div>

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">
          <p className="text-xs uppercase text-[#929db6]">
            Overall Resolution
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6fcdb5]">
            77.8%
          </h2>
        </div>

      </div>


      {/* CHART */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <h2 className="text-lg font-semibold text-[#f1f3f8]">
          Department Workload
        </h2>

        <p className="mt-1 text-xs text-[#929db6]">
          Assigned complaints versus resolved complaints
        </p>

        <div className="mt-6 h-[320px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={chartData}>

              <CartesianGrid
                stroke="#303a55"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="department"
                stroke="#929db6"
                tick={{
                  fill: "#929db6",
                  fontSize: 10,
                }}
              />

              <YAxis
                stroke="#929db6"
                tick={{
                  fill: "#929db6",
                  fontSize: 11,
                }}
              />

              <Tooltip />

              <Bar
                dataKey="complaints"
                name="Complaints"
                fill="#6573ff"
              />

              <Bar
                dataKey="resolved"
                name="Resolved"
                fill="#6fcdb5"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* DEPARTMENT TABLE */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <h2 className="text-lg font-semibold text-[#f1f3f8]">
          Department Performance
        </h2>

        <div className="mt-5 overflow-x-auto">

          <table className="w-full min-w-[900px] text-left">

            <thead className="bg-[#1b233a]">

              <tr>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Department
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Head
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Complaints
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Resolved
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Pending
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Critical
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Avg. Time
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Performance
                </th>

              </tr>

            </thead>


            <tbody>

              {departments.map((department) => {

                const performance = Math.round(
                  (department.resolved /
                    department.complaints) *
                    100
                );

                return (
                  <tr
                    key={department.name}
                    className="border-t border-[#303a55] hover:bg-[#29334f]"
                  >

                    <td className="px-4 py-4 text-sm font-semibold text-[#f1f3f8]">
                      {department.name}
                    </td>

                    <td className="px-4 py-4 text-xs text-[#c4cada]">
                      {department.head}
                    </td>

                    <td className="px-4 py-4 text-sm text-[#c4cada]">
                      {department.complaints}
                    </td>

                    <td className="px-4 py-4 text-sm text-[#6fcdb5]">
                      {department.resolved}
                    </td>

                    <td className="px-4 py-4 text-sm text-[#e5b45e]">
                      {department.pending}
                    </td>

                    <td className="px-4 py-4 text-sm text-[#e57979]">
                      {department.critical}
                    </td>

                    <td className="px-4 py-4 text-xs text-[#929db6]">
                      {department.avgTime}
                    </td>

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        <div className="h-2 w-20 overflow-hidden rounded-full bg-[#151c30]">

                          <div
                            className="h-full bg-[#6573ff]"
                            style={{
                              width: `${performance}%`,
                            }}
                          />

                        </div>

                        <span className="text-xs text-[#c4cada]">
                          {performance}%
                        </span>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}