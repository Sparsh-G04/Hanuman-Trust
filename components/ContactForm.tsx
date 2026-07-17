"use client";

import { useState } from "react";
import { waLink } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons";

/**
 * Contact form → WhatsApp redirect (spec §4).
 * Builds a wa.me deep link with the message pre-filled — no backend, no email service.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `नाम: ${name}\nसंदेश: ${message}`;
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1 block font-medium text-maroon-900">
          नाम
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="अपना नाम लिखें"
          className="w-full rounded-xl border-2 border-saffron-200 bg-white px-4 py-3 outline-none transition focus:border-saffron-500"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block font-medium text-maroon-900">
          संदेश
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="अपना संदेश लिखें"
          className="w-full rounded-xl border-2 border-saffron-200 bg-white px-4 py-3 outline-none transition focus:border-saffron-500"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white transition hover:brightness-110"
      >
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp पर भेजें
      </button>
      <p className="text-xs text-maroon-600">
        भेजें पर क्लिक करने से आपका संदेश WhatsApp में खुलेगा — वहाँ से भेजना पूर्ण करें।
      </p>
    </form>
  );
}
