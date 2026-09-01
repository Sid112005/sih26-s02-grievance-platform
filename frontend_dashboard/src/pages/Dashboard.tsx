import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Users,
  BrainCircuit,
  MapPin,
} from "lucide-react";

import StatCard from "../components/StatCard";
import PriorityBadge from "../components/PriorityBadge";
import { complaints } from "../data/mockComplaints";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">

      {/* HEADER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10182d] via-[#18264a] to-indigo-700 p-6 text-white shadow-xl sm:p-8">

        <div className="relative z-10 max-w-2xl">

          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
              AI-Powered Governance
            </span>

            <span className="flex items-center gap-1.5 text-[10px] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              System Operational
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Good Morning, Authority Admin
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
            Monitor citizen grievances, manage departmental workflows,
            identify urgent issues and make data-driven decisions.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            <button className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 shadow-lg transition hover:bg-slate-100">
              View Complaints
            </button>

            <button className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/15">
              Explore Analytics
            </button>

          </div>
        </div>

        {/* Decorative AI icon */}
        <div className="absolute -right-10 -top-16 hidden h-72 w-72 rounded-full border-[30px] border-white/5 lg:block" />

        <div className="absolute bottom-8 right-16 hidden rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md lg:block">
          <BrainCircuit size={42} className="text-cyan-300" />
        </div>

      </section>

      {/* KPI CARDS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Complaints"
          value="12,450"
          description="vs. previous month"
          trend="+8.2%"
          icon={ClipboardList}
          iconBg="bg-app-primary/20"
          iconColor="text-app-primary"
        />

        <StatCard
          title="Pending Complaints"
          value="3,210"
          description="Awaiting action"
          trend="-4.1%"
          icon={Clock3}
          iconBg="bg-app-warning/20"
          iconColor="text-app-warning"
        />

        <StatCard
          title="Resolved"
          value="8,940"
          description="Overall resolution rate"
          trend="71.8%"
          icon={CheckCircle2}
          iconBg="bg-app-success/20"
          iconColor="text-app-success"
        />

        <StatCard
          title="Critical Issues"
          value="312"
          description="Require immediate action"
          trend="+2.4%"
          icon={AlertTriangle}
          iconBg="bg-app-danger/20"
          iconColor="text-app-danger"
        />

      </section>

      {/* ANALYTICS ROW */}
      <section className="grid gap-6 xl:grid-cols-3">

        {/* Complaint Trend */}
        <div className="rounded-2xl border border-app-border bg-app-card p-6 shadow-sm xl:col-span-2">

          <div className="flex items-start justify-between">

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-app-text">
                  Complaint Trends
                </h2>

                <TrendingUp
                  size={16}
                  className="text-app-success"
                />
              </div>

              <p className="mt-1 text-xs text-app-text-muted">
                Complaints received over the last 7 days
              </p>
            </div>

            <select className="rounded-lg border border-app-border bg-app-card-hover px-3 py-2 text-xs font-medium text-app-text outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>

          </div>

          {/* Chart */}
          <div className="mt-8 flex h-56 items-end gap-3 sm:gap-5">

            {[42, 62, 48, 78, 58, 91, 70].map(
              (height, index) => (
                <div
                  key={index}
                  className="group flex h-full flex-1 flex-col justify-end"
                >

                  <div className="relative flex flex-1 items-end">

                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-app-primary to-app-primary-light transition-all duration-300 group-hover:from-app-primary-light group-hover:to-app-primary"
                      style={{ height: `${height}%` }}
                    />

                  </div>

                  <span className="mt-3 text-center text-[10px] font-medium text-app-text-muted">
                    {
                      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                        index
                      ]
                    }
                  </span>

                </div>
              )
            )}

          </div>

        </div>

        {/* AI INSIGHTS */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-lg">

          <div className="flex items-center justify-between">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <BrainCircuit size={21} />
            </div>

            <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-200">
              AI Active
            </span>

          </div>

          <h2 className="mt-6 text-lg font-bold">
            AI Insights
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-indigo-100">
            Automated analysis of incoming grievances.
          </p>

          <div className="mt-6 space-y-3">

            <Insight
              title="Duplicate Detection"
              value="94.2%"
              description="accuracy"
            />

            <Insight
              title="Auto Classification"
              value="91.8%"
              description="confidence"
            />

            <Insight
              title="Urgent Issues"
              value="37"
              description="detected today"
            />

          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-xs font-semibold transition hover:bg-white/20">
            View AI Analysis
            <ArrowUpRight size={14} />
          </button>

        </div>

      </section>

      {/* LOWER ROW */}
      <section className="grid gap-6 xl:grid-cols-3">

        {/* Recent complaints */}
        <div className="overflow-hidden rounded-2xl border border-app-border bg-app-card shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between border-b border-app-border px-6 py-5">

            <div>
              <h2 className="text-base font-bold text-app-text">
                Recent Complaints
              </h2>

              <p className="mt-1 text-xs text-app-text-muted">
                Latest citizen submissions
              </p>
            </div>

            <button className="flex items-center gap-1 text-xs font-bold text-app-primary hover:text-app-primary-light">
              View All
              <ArrowUpRight size={14} />
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px] text-left">

              <thead className="bg-app-card-hover">

                <tr className="text-[10px] font-bold uppercase tracking-wider text-app-text-muted">

                  <th className="px-6 py-3">
                    Complaint
                  </th>

                  <th className="px-6 py-3">
                    Department
                  </th>

                  <th className="px-6 py-3">
                    Priority
                  </th>

                  <th className="px-6 py-3">
                    Status
                  </th>

                  <th className="px-6 py-3">
                    Location
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-app-border">

                {complaints.map((complaint) => (

                  <tr
                    key={complaint.id}
                    className="transition hover:bg-app-card-hover"
                  >

                    <td className="px-6 py-4">

                      <div>
                        <p className="max-w-[250px] truncate text-xs font-semibold text-app-text">
                          {complaint.title}
                        </p>

                        <p className="mt-1 text-[10px] text-app-text-muted">
                          {complaint.id} • {complaint.date}
                        </p>
                      </div>

                    </td>

                    <td className="px-6 py-4 text-xs text-app-text-secondary">
                      {complaint.department}
                    </td>

                    <td className="px-6 py-4">
                      <PriorityBadge
                        priority={complaint.priority}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={complaint.status} />
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-1 text-xs text-app-text-muted">
                        <MapPin size={13} />
                        {complaint.location}
                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        </div>

        {/* Department Performance */}
        <div className="rounded-2xl border border-app-border bg-app-card p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-base font-bold text-app-text">
                Department Performance
              </h2>

              <p className="mt-1 text-xs text-app-text-muted">
                Resolution efficiency
              </p>
            </div>

            <Users size={18} className="text-app-text-muted" />

          </div>

          <div className="mt-6 space-y-5">

            <Department
              name="Sanitation"
              value={92}
              complaints="2,430"
            />

            <Department
              name="Water Supply"
              value={84}
              complaints="1,820"
            />

            <Department
              name="Roads"
              value={76}
              complaints="1,650"
            />

            <Department
              name="Electrical"
              value={71}
              complaints="1,230"
            />

          </div>

          <button className="mt-6 w-full rounded-xl border border-app-border py-2.5 text-xs font-semibold text-app-text transition hover:bg-app-card-hover">
            View Department Report
          </button>

        </div>

      </section>

    </div>
  );
}

/* ---------------- Components ---------------- */

function Insight({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">

      <div>
        <p className="text-xs font-semibold">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-indigo-200">
          {description}
        </p>
      </div>

      <p className="text-lg font-bold">
        {value}
      </p>

    </div>
  );
}

function Department({
  name,
  value,
  complaints,
}: {
  name: string;
  value: number;
  complaints: string;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold text-app-text">
            {name}
          </p>

          <p className="text-[10px] text-app-text-muted">
            {complaints} complaints
          </p>
        </div>

        <span className="text-xs font-bold text-app-text">
          {value}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-app-card">

        <div
          className="h-full rounded-full bg-gradient-to-r from-app-primary to-app-secondary"
          style={{ width: `${value}%` }}
        />

      </div>

    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "Pending" | "In Progress" | "Resolved";
}) {
  const styles = {
    Pending: "bg-app-warning/20 text-app-warning ring-app-warning/30",
    "In Progress": "bg-app-info/20 text-app-info ring-app-info/30",
    Resolved: "bg-app-success/20 text-app-success ring-app-success/30",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
}