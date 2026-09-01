import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";


// ================================
// MOCK DATA
// ================================

const complaintsTrend = [
  { month: "Jan", complaints: 320, resolved: 240 },
  { month: "Feb", complaints: 410, resolved: 310 },
  { month: "Mar", complaints: 380, resolved: 290 },
  { month: "Apr", complaints: 520, resolved: 390 },
  { month: "May", complaints: 610, resolved: 470 },
  { month: "Jun", complaints: 580, resolved: 510 },
  { month: "Jul", complaints: 720, resolved: 590 },
  { month: "Aug", complaints: 680, resolved: 620 },
];

const departmentData = [
  { department: "Water Supply", complaints: 1240 },
  { department: "Electricity", complaints: 980 },
  { department: "Roads", complaints: 860 },
  { department: "Sanitation", complaints: 720 },
  { department: "Public Safety", complaints: 540 },
  { department: "Transport", complaints: 420 },
];

const priorityData = [
  { name: "Critical", value: 120 },
  { name: "High", value: 360 },
  { name: "Medium", value: 850 },
  { name: "Low", value: 520 },
];

const statusData = [
  { name: "Resolved", value: 1240 },
  { name: "In Progress", value: 680 },
  { name: "Pending", value: 390 },
  { name: "Escalated", value: 140 },
];

const duplicateData = [
  { month: "Jan", duplicates: 42 },
  { month: "Feb", duplicates: 56 },
  { month: "Mar", duplicates: 49 },
  { month: "Apr", duplicates: 71 },
  { month: "May", duplicates: 83 },
  { month: "Jun", duplicates: 94 },
  { month: "Jul", duplicates: 110 },
  { month: "Aug", duplicates: 102 },
];


// ================================
// COLORS
// ================================

const PURPLE = "#6573ff";
const TEAL = "#6fcdb5";
const PINK = "#e5b9b5";
const YELLOW = "#e5b45e";
const RED = "#e57979";

const priorityColors = [
  RED,
  PINK,
  YELLOW,
  TEAL,
];

const statusColors = [
  TEAL,
  PURPLE,
  YELLOW,
  RED,
];


// ================================
// CUSTOM TOOLTIP
// ================================

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-[4px] border border-[#303a55] bg-[#1b233a] px-4 py-3 shadow-xl">
      <p className="mb-2 text-xs font-semibold text-[#f1f3f8]">
        {label}
      </p>

      {payload.map((item: any, index: number) => (
        <p
          key={index}
          className="text-xs text-[#c4cada]"
        >
          {item.name}:{" "}
          <span className="font-bold text-[#6fcdb5]">
            {item.value}
          </span>
        </p>
      ))}
    </div>
  );
}


// ================================
// ANALYTICS PAGE
// ================================

export default function Analytics() {
  return (
    <div className="space-y-6">

      {/* ============================
          PAGE HEADER
          ============================ */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#f1f3f8]">
            Analytics
          </h1>

          <p className="mt-2 text-sm text-[#929db6]">
            Monitor grievance trends, department performance,
            AI classification and complaint resolution.
          </p>
        </div>

        <button className="rounded-[4px] bg-[#6573ff] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#7582ff]">
          Download Report
        </button>

      </div>


      {/* ============================
          SUMMARY CARDS
          ============================ */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Complaints */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs font-semibold uppercase tracking-wide text-[#929db6]">
            Total Complaints
          </p>

          <div className="mt-2 flex items-end justify-between">

            <h2 className="text-3xl font-bold text-[#f1f3f8]">
              2,410
            </h2>

            <span className="text-xs font-semibold text-[#6fcdb5]">
              +12.8%
            </span>

          </div>

          <p className="mt-2 text-xs text-[#929db6]">
            Compared with last month
          </p>

        </div>


        {/* Resolution Rate */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs font-semibold uppercase tracking-wide text-[#929db6]">
            Resolution Rate
          </p>

          <div className="mt-2 flex items-end justify-between">

            <h2 className="text-3xl font-bold text-[#6fcdb5]">
              78.4%
            </h2>

            <span className="text-xs font-semibold text-[#6fcdb5]">
              +5.2%
            </span>

          </div>

          <p className="mt-2 text-xs text-[#929db6]">
            Complaints successfully resolved
          </p>

        </div>


        {/* Duplicate Detection */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs font-semibold uppercase tracking-wide text-[#929db6]">
            Duplicate Detected
          </p>

          <div className="mt-2 flex items-end justify-between">

            <h2 className="text-3xl font-bold text-[#6573ff]">
              607
            </h2>

            <span className="text-xs font-semibold text-[#6fcdb5]">
              25.2%
            </span>

          </div>

          <p className="mt-2 text-xs text-[#929db6]">
            Similar complaints grouped by AI
          </p>

        </div>


        {/* AI Accuracy */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-5">

          <p className="text-xs font-semibold uppercase tracking-wide text-[#929db6]">
            AI Accuracy
          </p>

          <div className="mt-2 flex items-end justify-between">

            <h2 className="text-3xl font-bold text-[#e5b9b5]">
              94.2%
            </h2>

            <span className="text-xs font-semibold text-[#6fcdb5]">
              +2.4%
            </span>

          </div>

          <p className="mt-2 text-xs text-[#929db6]">
            Classification accuracy
          </p>

        </div>

      </div>


      {/* ============================
          COMPLAINT TREND
          ============================ */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            Complaint Trends
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Complaints received vs resolved over the last 8 months
          </p>

        </div>

        <div className="h-[330px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={complaintsTrend}>

              <CartesianGrid
                stroke="#303a55"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
                stroke="#929db6"
                tick={{ fill: "#929db6", fontSize: 12 }}
              />

              <YAxis
                stroke="#929db6"
                tick={{ fill: "#929db6", fontSize: 12 }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                wrapperStyle={{
                  color: "#c4cada",
                  fontSize: "12px",
                }}
              />

              <Line
                type="monotone"
                dataKey="complaints"
                name="Complaints"
                stroke={PINK}
                strokeWidth={3}
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="resolved"
                name="Resolved"
                stroke={TEAL}
                strokeWidth={3}
                dot={{ r: 4 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* ============================
          DEPARTMENT + PRIORITY
          ============================ */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Department */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            Complaints by Department
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Number of complaints assigned to each department
          </p>

          <div className="mt-6 h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={departmentData}
                layout="vertical"
                margin={{
                  left: 10,
                  right: 20,
                }}
              >

                <CartesianGrid
                  stroke="#303a55"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  stroke="#929db6"
                  tick={{ fill: "#929db6", fontSize: 11 }}
                />

                <YAxis
                  type="category"
                  dataKey="department"
                  width={100}
                  stroke="#929db6"
                  tick={{ fill: "#c4cada", fontSize: 11 }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="complaints"
                  name="Complaints"
                  fill={PURPLE}
                  radius={[0, 3, 3, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* Priority */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            Priority Distribution
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Complaints categorized according to urgency
          </p>

          <div className="mt-4 h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >

                  {priorityData.map((_, index) => (
                    <Cell
                      key={`priority-${index}`}
                      fill={priorityColors[index]}
                    />
                  ))}

                </Pie>

                <Tooltip content={<CustomTooltip />} />

                <Legend
                  wrapperStyle={{
                    color: "#c4cada",
                    fontSize: "12px",
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* ============================
          STATUS + DUPLICATES
          ============================ */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Status */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            Complaint Status
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Current status of submitted grievances
          </p>

          <div className="mt-4 h-[300px]">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >

                  {statusData.map((_, index) => (
                    <Cell
                      key={`status-${index}`}
                      fill={statusColors[index]}
                    />
                  ))}

                </Pie>

                <Tooltip content={<CustomTooltip />} />

                <Legend
                  wrapperStyle={{
                    color: "#c4cada",
                    fontSize: "12px",
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* Duplicate Detection */}

        <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

          <h2 className="text-lg font-semibold text-[#f1f3f8]">
            AI Duplicate Detection
          </h2>

          <p className="mt-1 text-xs text-[#929db6]">
            Duplicate complaints detected by semantic similarity
          </p>

          <div className="mt-6 h-[280px]">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={duplicateData}>

                <defs>

                  <linearGradient
                    id="duplicateGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor={PURPLE}
                      stopOpacity={0.4}
                    />

                    <stop
                      offset="95%"
                      stopColor={PURPLE}
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  stroke="#303a55"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                  stroke="#929db6"
                  tick={{ fill: "#929db6", fontSize: 12 }}
                />

                <YAxis
                  stroke="#929db6"
                  tick={{ fill: "#929db6", fontSize: 12 }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="duplicates"
                  name="Duplicates"
                  stroke={PURPLE}
                  strokeWidth={3}
                  fill="url(#duplicateGradient)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* ============================
          AI INSIGHTS
          ============================ */}

      <div className="rounded-[4px] border border-[#303a55] bg-[#222b45] p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#6573ff]/10 text-[#6573ff]">
            ✦
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#f1f3f8]">
              AI Insights
            </h2>

            <p className="text-xs text-[#929db6]">
              Automatically generated observations from grievance data
            </p>
          </div>

        </div>


        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="border-l-2 border-[#e57979] bg-[#1b233a] p-4">

            <p className="text-xs font-semibold text-[#e57979]">
              HIGH PRIORITY
            </p>

            <p className="mt-2 text-sm text-[#c4cada]">
              Water supply complaints have increased by
              <span className="font-bold text-[#f1f3f8]">
                {" "}28%
              </span>
              this month.
            </p>

          </div>


          <div className="border-l-2 border-[#6573ff] bg-[#1b233a] p-4">

            <p className="text-xs font-semibold text-[#6573ff]">
              DUPLICATE PATTERN
            </p>

            <p className="mt-2 text-sm text-[#c4cada]">
              Multiple complaints regarding the same
              road damage have been grouped automatically.
            </p>

          </div>


          <div className="border-l-2 border-[#6fcdb5] bg-[#1b233a] p-4">

            <p className="text-xs font-semibold text-[#6fcdb5]">
              PERFORMANCE
            </p>

            <p className="mt-2 text-sm text-[#c4cada]">
              Average complaint resolution time has
              improved by
              <span className="font-bold text-[#f1f3f8]">
                {" "}18%
              </span>.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}