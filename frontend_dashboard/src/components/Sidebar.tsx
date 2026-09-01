import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  MapPinned,
  BarChart3,
  Settings,
  X,
  ShieldCheck,
  ChevronRight,
  CircleHelp,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Complaints",
    path: "/complaints",
    icon: ClipboardList,
  },
  {
    name: "Departments",
    path: "/departments",
    icon: Building2,
  },
  {
    name: "Hotspots",
    path: "/hotspots",
    icon: MapPinned,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col bg-[#222b45] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-[82px] items-center border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={23} strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="text-[17px] font-bold tracking-wide">
                GrievanceAI
              </h1>

              <p className="text-[11px] text-slate-400">
                Authority Control Center
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-7">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Main Navigation
          </p>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-medium transition-all ${
                      isActive
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-500 group-hover:text-slate-300"
                        }
                      />

                      <span>{item.name}</span>

                      {isActive && (
                        <ChevronRight
                          size={15}
                          className="ml-auto"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            System
          </p>

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-medium transition ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>

          {/* Help */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <CircleHelp size={18} />
            </div>

            <p className="text-xs font-semibold text-white">
              Need assistance?
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Access the authority help center and documentation.
            </p>

            <button className="mt-3 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300">
              Open Help Center →
            </button>
          </div>
        </div>

        {/* User */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold">
              AD
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">
                Authority Admin
              </p>

              <p className="truncate text-[10px] text-slate-500">
                Municipal Administration
              </p>
            </div>

            <div className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </aside>
    </>
  );
}