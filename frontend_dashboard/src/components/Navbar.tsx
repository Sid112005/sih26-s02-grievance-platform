import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  CalendarDays,
} from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#303a55] bg-[#11172b]/95 px-4 shadow-sm backdrop-blur sm:px-6 lg:px-8">

      {/* Left */}
      <div className="flex items-center gap-4">

        <button
          onClick={onMenuClick}
          className="rounded-xl p-2.5 text-app-text-muted hover:bg-app-card-hover lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div>
          <p className="hidden text-[11px] font-medium uppercase tracking-wider text-app-text-muted sm:block">
            Municipal Administration
          </p>

          <p className="text-sm font-semibold text-app-text sm:mt-0.5">
            Grievance Management
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Date */}
        <div className="hidden items-center gap-2 rounded-xl bg-app-card px-3 py-2 text-xs text-app-text-muted md:flex">
          <CalendarDays size={15} />
          01 September 2026
        </div>

        {/* Search */}
        <button className="rounded-lg border border-app-border bg-app-card px-3 py-2 text-xs text-app-text-secondary">
          <Search size={19} />
        </button>

        {/* Notification */}
        <button className="relative rounded-xl p-2.5 text-app-text-muted hover:bg-app-card-hover">
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-app-danger ring-2 ring-app-text" />
        </button>

        <div className="hidden h-8 w-px bg-app-border sm:block" />

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 hover:bg-app-card-hover">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-app-primary text-xs font-bold text-app-text">
            AD
          </div>

          <div className="hidden text-left md:block">
            <p className="text-xs font-semibold text-app-text">
              Authority Admin
            </p>

            <p className="text-[10px] text-app-text-muted">
              Administrator
            </p>
          </div>

          <ChevronDown
            size={15}
            className="hidden text-app-text-muted md:block"
          />

        </button>
      </div>
    </header>
  );
}