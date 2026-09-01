import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const hotspots = [
  {
    area: "Sector 12",
    complaints: 284,
    critical: 32,
    duplicates: 48,
    issue: "Water Supply",
    severity: "Critical",
  },
  {
    area: "Gandhi Nagar",
    complaints: 231,
    critical: 21,
    duplicates: 37,
    issue: "Road Damage",
    severity: "High",
  },
  {
    area: "Shivaji Chowk",
    complaints: 198,
    critical: 15,
    duplicates: 29,
    issue: "Electricity",
    severity: "High",
  },
  {
    area: "Civil Lines",
    complaints: 176,
    critical: 9,
    duplicates: 24,
    issue: "Sanitation",
    severity: "Medium",
  },
  {
    area: "Station Road",
    complaints: 143,
    critical: 7,
    duplicates: 18,
    issue: "Traffic",
    severity: "Medium",
  },
  {
    area: "MG Road",
    complaints: 119,
    critical: 5,
    duplicates: 13,
    issue: "Street Lighting",
    severity: "Low",
  },
];

export default function Hotspots() {
  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-[#f1f3f8]">
          Grievance Hotspots
        </h1>

        <p className="mt-2 text-sm text-[#929db6]">
          Identify geographical areas with high concentrations of citizen complaints.
        </p>
      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Active Hotspots
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#e57979]">
            6
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            High complaint density
          </p>

        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Critical Areas
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#e57979]">
            2
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Require immediate attention
          </p>

        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Complaints in Hotspots
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#f1f3f8]">
            1,151
          </h2>

          <p className="mt-1 text-xs text-[#6fcdb5]">
            47.8% of total complaints
          </p>

        </div>


        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs uppercase text-[#929db6]">
            Duplicate Complaints
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6573ff]">
            169
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Grouped by AI
          </p>

        </div>

      </div>


      {/* MAP PLACEHOLDER */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold text-[#f1f3f8]">
              Geographical Hotspot Map
            </h2>

            <p className="mt-1 text-xs text-[#929db6]">
              Complaint density across monitored areas
            </p>

          </div>

          <span className="rounded-[4px] bg-[#6573ff]/10 px-3 py-2 text-xs text-[#6573ff]">
            GIS View
          </span>

        </div>


        {/* MOCK MAP */}

        <div className="relative mt-5 h-[400px] overflow-hidden rounded-[4px] border border-[#303a55] bg-[#151c30]">

          {/* Grid */}

          <div className="absolute inset-0 opacity-20">

            <div className="grid h-full w-full grid-cols-8 grid-rows-6">

              {Array.from({ length: 48 }).map((_, index) => (
                <div
                  key={index}
                  className="border border-[#6573ff]/20"
                />
              ))}

            </div>

          </div>


          {/* Roads */}

          <div className="absolute left-0 top-1/2 h-[2px] w-full rotate-[-8deg] bg-[#303a55]" />

          <div className="absolute left-1/2 top-0 h-full w-[2px] rotate-[15deg] bg-[#303a55]" />

          <div className="absolute left-0 top-[30%] h-[2px] w-full rotate-[12deg] bg-[#303a55]" />


          {/* HOTSPOT MARKERS */}

          <div className="absolute left-[20%] top-[25%] flex flex-col items-center">

            <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-[#e57979]/20">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e57979] text-xs font-bold text-white">
                284
              </div>

            </div>

            <span className="mt-1 text-[10px] font-semibold text-[#f1f3f8]">
              Sector 12
            </span>

          </div>


          <div className="absolute left-[65%] top-[20%] flex flex-col items-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e5b45e]/20">

              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e5b45e] text-[9px] font-bold text-white">
                231
              </div>

            </div>

            <span className="mt-1 text-[10px] text-[#f1f3f8]">
              Gandhi Nagar
            </span>

          </div>


          <div className="absolute left-[45%] top-[55%] flex flex-col items-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e5b45e]/20">

              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e5b45e] text-[9px] font-bold text-white">
                198
              </div>

            </div>

            <span className="mt-1 text-[10px] text-[#f1f3f8]">
              Shivaji Chowk
            </span>

          </div>


          <div className="absolute left-[75%] top-[65%] flex flex-col items-center">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6573ff]/20">

              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6573ff] text-[8px] font-bold text-white">
                176
              </div>

            </div>

            <span className="mt-1 text-[10px] text-[#f1f3f8]">
              Civil Lines
            </span>

          </div>


          <div className="absolute left-[30%] top-[70%] flex flex-col items-center">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6573ff]/20">

              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#6573ff] text-[7px] font-bold text-white">
                143
              </div>

            </div>

            <span className="mt-1 text-[10px] text-[#f1f3f8]">
              Station Road
            </span>

          </div>


          {/* LEGEND */}

          <div className="absolute bottom-4 left-4 rounded-[4px] border border-[#303a55] bg-[#1b233a]/95 p-3">

            <p className="mb-2 text-[10px] font-semibold text-[#f1f3f8]">
              Complaint Density
            </p>

            <div className="flex gap-4 text-[9px]">

              <span className="text-[#e57979]">
                ● Critical
              </span>

              <span className="text-[#e5b45e]">
                ● High
              </span>

              <span className="text-[#6573ff]">
                ● Medium
              </span>

              <span className="text-[#6fcdb5]">
                ● Low
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* HOTSPOT CHART */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <h2 className="text-lg font-semibold text-[#f1f3f8]">
          Complaints by Area
        </h2>

        <p className="mt-1 text-xs text-[#929db6]">
          Areas ranked by number of citizen complaints
        </p>

        <div className="mt-6 h-[300px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={hotspots}
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
                dataKey="area"
                width={100}
                stroke="#929db6"
                tick={{
                  fill: "#c4cada",
                  fontSize: 11,
                }}
              />

              <Tooltip />

              <Bar
                dataKey="complaints"
                fill="#6573ff"
                radius={[0, 3, 3, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* HOTSPOT DETAILS */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <h2 className="text-lg font-semibold text-[#f1f3f8]">
          Hotspot Details
        </h2>

        <div className="mt-5 overflow-x-auto">

          <table className="w-full min-w-[800px] text-left">

            <thead className="bg-[#1b233a]">

              <tr>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Area
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Main Issue
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Complaints
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Critical
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Duplicates
                </th>

                <th className="px-4 py-3 text-xs uppercase text-[#929db6]">
                  Severity
                </th>

              </tr>

            </thead>


            <tbody>

              {hotspots.map((hotspot) => (

                <tr
                  key={hotspot.area}
                  className="border-t border-[#303a55] hover:bg-[#29334f]"
                >

                  <td className="px-4 py-4 text-sm font-semibold text-[#f1f3f8]">
                    📍 {hotspot.area}
                  </td>

                  <td className="px-4 py-4 text-xs text-[#c4cada]">
                    {hotspot.issue}
                  </td>

                  <td className="px-4 py-4 text-sm font-bold text-[#f1f3f8]">
                    {hotspot.complaints}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#e57979]">
                    {hotspot.critical}
                  </td>

                  <td className="px-4 py-4 text-sm text-[#6573ff]">
                    {hotspot.duplicates}
                  </td>

                  <td className="px-4 py-4">

                    <span
                      className={`rounded-[4px] px-2 py-1 text-[10px] font-bold ${
                        hotspot.severity === "Critical"
                          ? "bg-[#e57979]/10 text-[#e57979]"
                          : hotspot.severity === "High"
                          ? "bg-[#e5b45e]/10 text-[#e5b45e]"
                          : hotspot.severity === "Medium"
                          ? "bg-[#6573ff]/10 text-[#6573ff]"
                          : "bg-[#6fcdb5]/10 text-[#6fcdb5]"
                      }`}
                    >
                      {hotspot.severity}
                    </span>

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