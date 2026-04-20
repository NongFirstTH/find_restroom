import type { Restroom } from "../../../types";
import { formatTime } from "../../../utils/helpers";
import { Chip } from "../../../components/Chip";

interface Props {
  restroom: Restroom;
  currentUserId: string;
  onEdit: (r: Restroom) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function RestroomCard({ restroom, currentUserId, onEdit, onDelete, onClose }: Props) {
  const isOwner = restroom.createdBy === currentUserId;

  const typeEmoji = { flush: "🚽", squat: "🪣", other: "🚻" }[restroom.type ?? "flush"];
  const typeLabel = { flush: "Flush", squat: "Squat", other: "Other" }[restroom.type ?? "flush"];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 w-72 overflow-hidden">
      {/* Header */}
      <div className="bg-teal-600 dark:bg-teal-800 px-4 py-3 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-base truncate">{restroom.name}</p>
          {restroom.address && (
            <p className="text-teal-100 text-xs mt-0.5 truncate">{restroom.address}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 text-teal-100 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {restroom.detail}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Chip label="Type" value={`${typeEmoji} ${typeLabel}`} />
          <Chip
            label="Fee"
            value={restroom.isFree ? "🟢 Free" : "🔴 Paid"}
          />
          <Chip
            label="Opens"
            value={formatTime(restroom.openingHours)}
          />
          <Chip
            label="Closes"
            value={formatTime(restroom.closingHours)}
          />
        </div>

        {isOwner && (
          <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => onEdit(restroom)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-xl transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(restroom.restroomId)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
