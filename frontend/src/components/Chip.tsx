export function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-0.5">
        {label}
      </p>
      <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{value}</p>
    </div>
  );
}
