import { useState, useEffect } from "react";
import type { Restroom, RestroomFormData } from "../../../types";
import { Field } from "../../../components/Field";

interface Props {
  onClose: () => void;
  onSubmit: (data: RestroomFormData) => Promise<void>;
  initialData?: Restroom | null;
  defaultCoords?: { latitude: number; longitude: number } | null;
}

const EMPTY: RestroomFormData = {
  name: "",
  detail: "",
  address: "",
  openingHours: "08:00",
  closingHours: "20:00",
  type: "flush",
  isFree: true,
  latitude: 0,
  longitude: 0,
};

export default function RestroomModal({
  onClose,
  onSubmit,
  initialData,
  defaultCoords,
}: Props) {
  const [form, setForm] = useState<RestroomFormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        detail: initialData.detail,
        address: initialData.address ?? "",
        openingHours: initialData.openingHours ?? "08:00",
        closingHours: initialData.closingHours ?? "20:00",
        type: initialData.type,
        isFree: initialData.isFree,
        latitude: initialData.latitude,
        longitude: initialData.longitude,
      });
    } else {
      setForm({ ...EMPTY, ...(defaultCoords ?? {}) });
    }
    setError("");
  }, [initialData, defaultCoords, open]);

  const set = (k: keyof RestroomFormData, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name) return setError("Name is required");
    if (!form.detail) return setError("Detail is required");
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {initialData ? "Edit Restroom" : "Add Restroom"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-xl">
              {error}
            </div>
          )}

          <Field label="Place Name *">
            <input
              className="input-field"
              placeholder="e.g. Central Park Restroom"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>

          <Field label="Detail *">
            <textarea
              className="input-field resize-none"
              rows={2}
              placeholder="Brief description, floor, landmark..."
              value={form.detail}
              onChange={(e) => set("detail", e.target.value)}
            />
          </Field>

          <Field label="Address">
            <input
              className="input-field"
              placeholder="Street address (optional)"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Opening Time">
              <input
                type="time"
                className="input-field"
                value={form.openingHours}
                onChange={(e) => set("openingHours", e.target.value)}
              />
            </Field>
            <Field label="Closing Time">
              <input
                type="time"
                className="input-field"
                value={form.closingHours}
                onChange={(e) => set("closingHours", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Restroom Type">
            <div className="flex gap-2">
              {(["flush", "squat", "other"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => set("type", t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                    form.type === t
                      ? "bg-teal-600 text-white border-teal-600"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-teal-400"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Entrance Fee">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                {form.isFree ? "🟢 Free to use" : "🔴 Paid entry"}
              </span>
              <button
                role="switch"
                aria-checked={form.isFree}
                onClick={() => set("isFree", !form.isFree)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  form.isFree ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    form.isFree ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </Field>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold transition-colors"
          >
            {loading ? "Saving…" : initialData ? "Save Changes" : "Add Restroom"}
          </button>
        </div>
      </div>
    </div>
  );
}