import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-[#303a55] bg-[#222b45] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-[28px] font-bold tracking-tight text-[#f1f3f8]">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor} transition-transform duration-200 group-hover:scale-110`}
        >
          <Icon size={20} />
        </div>

      </div>

      <div className="mt-4 flex items-center gap-2">

        {trend && (
          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
            {trend}
          </span>
        )}

        <p className="text-[11px] text-slate-400">
          {description}
        </p>

      </div>

    </div>
  );
}