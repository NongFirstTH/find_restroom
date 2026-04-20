export function LegendRow({
  color,
  label,
  border,
}: {
  color: string;
  label: string;
  border?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3.5 h-3.5 rounded-full flex-shrink-0"
        style={{
          background: color,
          border: border ? "2px solid #f59e0b" : "2px solid white",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
        }}
      />
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}
