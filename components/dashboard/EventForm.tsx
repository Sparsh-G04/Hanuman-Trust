"use client";

import { useState, useRef, useEffect } from "react";
import type { TrustEvent } from "@/lib/events";

interface EventFormProps {
  event: TrustEvent | null; // null = creating new, non-null = editing
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const isEditing = event !== null;

  const [eventId, setEventId] = useState(event?.id ?? "");
  const [title, setTitle] = useState(event?.title ?? "");
  const [date, setDate] = useState(event?.date ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [images, setImages] = useState<string[]>(event?.images ?? []);
  const [videos, setVideos] = useState<string[]>(event?.videos ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Fetch next ID for new events
  useEffect(() => {
    if (!isEditing) {
      fetch("/api/events/next-id")
        .then((res) => res.json())
        .then((data) => setEventId(data.nextId))
        .catch(() => setEventId(""));
    }
  }, [isEditing]);

  // ── File Upload ───────────────────────────────────────────────
  const uploadFile = async (file: File, id: string, type: "images" | "videos"): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("eventId", id);
    formData.append("type", type);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "अपलोड विफल");
    }

    const data = await res.json();
    return data.fileName;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!eventId) {
      setError("Event ID उपलब्ध नहीं है। कृपया पुनः प्रयास करें।");
      return;
    }

    setUploading(true);
    setError("");
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setUploadProgress(`फोटो अपलोड हो रहा है ${i + 1}/${files.length}...`);
      try {
        const fileName = await uploadFile(files[i], eventId, "images");
        if (fileName) newImages.push(fileName);
      } catch (err) {
        setError(`${files[i].name} अपलोड विफल: ${(err as Error).message}`);
      }
    }

    setImages([...images, ...newImages]);
    setUploading(false);
    setUploadProgress("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!eventId) {
      setError("Event ID उपलब्ध नहीं है। कृपया पुनः प्रयास करें।");
      return;
    }

    setUploading(true);
    setError("");
    const newVideos: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setUploadProgress(`वीडियो अपलोड हो रहा है ${i + 1}/${files.length}...`);
      try {
        const fileName = await uploadFile(files[i], eventId, "videos");
        if (fileName) newVideos.push(fileName);
      } catch (err) {
        setError(`${files[i].name} अपलोड विफल: ${(err as Error).message}`);
      }
    }

    setVideos([...videos, ...newVideos]);
    setUploading(false);
    setUploadProgress("");
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  // ── Manual entry management ───────────────────────────────────
  const addVideo = () => setVideos([...videos, ""]);
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const removeVideo = (index: number) => setVideos(videos.filter((_, i) => i !== index));
  const updateVideo = (index: number, value: string) => {
    const updated = [...videos];
    updated[index] = value;
    setVideos(updated);
  };

  // ── Submit (single create or update) ──────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const cleanImages = images.filter((img) => img.trim() !== "");
    const cleanVideos = videos.filter((vid) => vid.trim() !== "");

    const body = {
      title: title.trim(),
      date,
      description: description.trim(),
      images: cleanImages,
      videos: cleanVideos,
    };

    try {
      let res: Response;

      if (isEditing) {
        // Update existing event
        res = await fetch(`/api/events/${event.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        // Create new event — single POST, only here
        res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "कुछ गलत हो गया");
        setSaving(false);
        return;
      }

      onSuccess();
    } catch {
      setError("सर्वर से कनेक्ट नहीं हो पाया");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditing ? `संपादित करें: ${event.id}` : "नया कार्यक्रम जोड़ें"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← वापस जाएँ
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {uploading && (
        <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {uploadProgress}
        </div>
      )}

      {/* Event ID display */}
      <div className="mb-4 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600">
        Event ID: <code className="font-mono font-bold">{eventId || "..."}</code>
        {!isEditing && <span className="ml-2 text-xs text-gray-400">(स्वचालित)</span>}
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          शीर्षक *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="हनुमान जन्मोत्सव 2027"
        />
      </div>

      {/* Date */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          तारीख *
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          विवरण *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="कार्यक्रम का विवरण..."
        />
      </div>

      {/* ── Images Section ─────────────────────────────────────────── */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-bold text-gray-800">
            🖼️ फोटो ({images.length})
          </label>
        </div>

        {/* Upload button */}
        <div className="mb-4">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label
            htmlFor="image-upload"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition hover:border-blue-400 hover:text-blue-600"
          >
            📁 फोटो चुनें (JPG, PNG, WebP)
          </label>
          <p className="mt-2 text-xs text-gray-400">
            फाइलें सहेजी जाएँगी: public/events/{eventId}/images/
          </p>
        </div>

        {/* Image list */}
        {images.length > 0 && (
          <div className="space-y-2">
            {images.map((img, index) => (
              <div key={index} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                <span className="flex-1 truncate text-sm text-gray-700">{img}</span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Videos Section ─────────────────────────────────────────── */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-bold text-gray-800">
            🎬 वीडियो ({videos.length})
          </label>
          <button
            type="button"
            onClick={addVideo}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + YouTube लिंक जोड़ें
          </button>
        </div>

        {/* Video upload button */}
        <div className="mb-4">
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm"
            multiple
            onChange={handleVideoUpload}
            className="hidden"
            id="video-upload"
            disabled={uploading}
          />
          <label
            htmlFor="video-upload"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition hover:border-blue-400 hover:text-blue-600"
          >
            📁 वीडियो चुनें (MP4, WebM)
          </label>
          <p className="mt-2 text-xs text-gray-400">
            फाइलें सहेजी जाएँगी: public/events/{eventId}/videos/
          </p>
        </div>

        {/* Video list */}
        {videos.length > 0 && (
          <div className="space-y-2">
            {videos.map((vid, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={vid}
                  onChange={(e) => updateVideo(index, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                  placeholder="https://youtube.com/watch?v=... या video_001.mp4"
                />
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "सहेजा जा रहा है..." : isEditing ? "अपडेट करें" : "कार्यक्रम बनाएँ"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
        >
          रद्द करें
        </button>
      </div>
    </form>
  );
}
