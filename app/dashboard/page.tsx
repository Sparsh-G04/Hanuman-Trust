"use client";

import { useState, useEffect, useCallback } from "react";
import type { TrustEvent } from "@/lib/events";
import EventList from "@/components/dashboard/EventList";
import EventForm from "@/components/dashboard/EventForm";

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checking, setChecking] = useState(false);

  const [events, setEvents] = useState<TrustEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<TrustEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cleanupMessage, setCleanupMessage] = useState("");

  // Check if already authenticated in this session
  useEffect(() => {
    const stored = sessionStorage.getItem("dashboard_auth");
    if (stored === "true") setAuthenticated(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setPasswordError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      if (res.ok) {
        setAuthenticated(true);
        sessionStorage.setItem("dashboard_auth", "true");
      } else {
        setPasswordError("गलत password। पुनः प्रयास करें।");
      }
    } catch {
      setPasswordError("सर्वर से कनेक्ट नहीं हो पाया");
    }

    setChecking(false);
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchEvents();
  }, [authenticated, fetchEvents]);

  const handleCreate = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEdit = (event: TrustEvent) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप इस कार्यक्रम को हटाना चाहते हैं?")) return;

    await fetch(`/api/events/${id}`, { method: "DELETE" });
    fetchEvents();
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleCleanup = async () => {
    setCleanupMessage("सफाई हो रही है...");
    const res = await fetch("/api/cleanup", { method: "POST" });
    const data = await res.json();
    setCleanupMessage(data.message);
    setTimeout(() => setCleanupMessage(""), 5000);
  };

  // ── Password gate ─────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <h2 className="mb-6 text-center text-xl font-bold text-gray-800">
            🔒 Dashboard Login
          </h2>
          <div className="mb-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password दर्ज करें"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
          {passwordError && (
            <p className="mb-4 text-center text-sm text-red-600">
              {passwordError}
            </p>
          )}
          <button
            type="submit"
            disabled={checking}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {checking ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  // ── Dashboard content ─────────────────────────────────────────
  if (loading) {
    return <p className="text-center text-gray-500">लोड हो रहा है...</p>;
  }

  return (
    <div>
      {showForm ? (
        <EventForm
          event={editingEvent}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              सभी कार्यक्रम ({events.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCleanup}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                🧹 अनावश्यक फाइलें हटाएँ
              </button>
              <button
                onClick={handleCreate}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                + नया कार्यक्रम जोड़ें
              </button>
            </div>
          </div>
          {cleanupMessage && (
            <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {cleanupMessage}
            </div>
          )}
          <EventList
            events={events}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}
