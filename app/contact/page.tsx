import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact | Tatva Studio",
  description: "Get in touch with Tatva Studio by phone or email.",
};

// Change these values if the contact details ever change.
const PHONE_DISPLAY = "+91 89284 66820";
const PHONE_LINK = "+918928466820";
const EMAIL = "realhrishikeshmishra@gmail.com";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#3B0700] text-[#F6EAD8]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#3B0700]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <span className="text-sm font-semibold uppercase tracking-[0.3em]">
            Contact
          </span>
        </div>
      </nav>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 pt-40 pb-24">
        <p className="text-xs uppercase tracking-[0.3em] opacity-70">
          Let&apos;s talk
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-light leading-tight">
          Get in touch with Tatva
        </h1>
        <p className="mt-6 max-w-xl text-base md:text-lg opacity-80">
          Planning a home or a space? Call or write to us and we will get back
          to you as soon as we can.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <a
            href={`tel:${PHONE_LINK}`}
            className="group rounded-2xl border border-[#F6EAD8]/20 p-8 transition-colors hover:bg-[#F6EAD8] hover:text-[#3B0700]"
          >
            <Phone className="w-6 h-6" />
            <p className="mt-6 text-xs uppercase tracking-[0.3em] opacity-70">
              Phone
            </p>
            <p className="mt-2 text-xl">{PHONE_DISPLAY}</p>
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className="group rounded-2xl border border-[#F6EAD8]/20 p-8 transition-colors hover:bg-[#F6EAD8] hover:text-[#3B0700]"
          >
            <Mail className="w-6 h-6" />
            <p className="mt-6 text-xs uppercase tracking-[0.3em] opacity-70">
              Email
            </p>
            <p className="mt-2 text-xl break-all">{EMAIL}</p>
          </a>
        </div>

        <ContactForm />
      </section>
    </main>
  );
}