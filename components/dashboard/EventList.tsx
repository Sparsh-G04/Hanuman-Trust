"use client";

import type { TrustEvent } from "@/lib/events";

interface EventListProps {
  events: TrustEvent[];
  onEdit: (event: TrustEvent) => void;
  onDelete: (id: string) => void;
}

export default function EventList({ events, onEdit, onDelete }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
        कोई कार्यक्रम नहीं है। नया कार्यक्रम जोड़ें।
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-600">
                {event.id}
              </span>
              <span className="text-xs text-gray-500">{event.date}</span>
            </div>
            <h3 className="truncate text-base font-bold text-gray-900">
              {event.title}
            </h3>
            <p className="mt-1 truncate text-sm text-gray-600">
              {event.description}
            </p>
            <div className="mt-2 flex gap-3 text-xs text-gray-500">
              <span>🖼️ {event.images.length} फोटो</span>
              <span>🎬 {(event.videos ?? []).length} वीडियो</span>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => onEdit(event)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              ✏️ संपादित
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              🗑️ हटाएँ
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
