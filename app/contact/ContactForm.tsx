"use client";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { setStatus("sent"); form.reset(); }
    else setStatus("error");
  }

  const field =
    "w-full rounded-xl border border-[#F6EAD8]/20 bg-transparent px-4 py-3 placeholder:text-[#F6EAD8]/50 focus:outline-none focus:border-[#F6EAD8]";

  return (
    <form onSubmit={handleSubmit} className="mt-14 grid gap-4">
      <input name="name" required placeholder="Your name" className={field} />
      <input name="email" type="email" required placeholder="Your email" className={field} />
      <input name="phone" placeholder="Phone (optional)" className={field} />
      <textarea name="message" required rows={5} placeholder="Tell us about your space" className={field} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-xl bg-[#F6EAD8] px-6 py-3 text-[#3B0700] uppercase tracking-[0.2em] disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      {status === "sent" && <p>Thank you! We will get back to you soon.</p>}
      {status === "error" && <p>Something went wrong. Please try again or call us.</p>}
    </form>
  );
}