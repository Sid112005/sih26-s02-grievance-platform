interface PriorityBadgeProps {
  priority: "Low" | "Medium" | "High" | "Critical";
}

export default function PriorityBadge({
  priority,
}: PriorityBadgeProps) {
  const styles = {
    Low: "bg-app-success/20 text-app-success",
    Medium: "bg-app-warning/20 text-app-warning",
    High: "bg-app-danger/20 text-app-danger",
    Critical: "bg-app-danger/30 text-app-danger",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}