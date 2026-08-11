"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Mail,
  MessageCircle,
  ShieldCheck,
  Send,
  Building2,
  Headphones,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Connect this to your backend/email service later.
    console.log("Contact form submitted:", formData);
  };

  const contactOptions = [
    {
      icon: Headphones,
      title: "General Support",
      description:
        "Need help using TripGuard or have a question about your account?",
      action: "Get support",
    },
    {
      icon: Building2,
      title: "Booking & Accommodation",
      description:
        "Questions about a booking, accommodation, check-in, or check-out?",
      action: "Ask about a booking",
    },
    {
      icon: ShieldCheck,
      title: "Safety Concerns",
      description:
        "Have a safety concern or need to report something important?",
      action: "Report a concern",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#172322]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#173C37] text-white">
        <div className="absolute right-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#63E6BE]/10 blur-3xl" />

        <div className="absolute bottom-[-180px] left-[-120px] h-[400px] w-[400px] rounded-full bg-[#63E6BE]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium">
              <MessageCircle className="h-4 w-4 text-[#63E6BE]" />
              We&apos;re here to help
            </div>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Have a question?
              <br />
              <span className="text-[#63E6BE]">Let&apos;s talk.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Whether you need help with a booking, have a question about
              TripGuard, or want to report a concern, our team is here to
              listen.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
              How can we help?
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#172322] sm:text-4xl">
              Choose the support you need.
            </h2>

            <p className="mt-4 leading-7 text-[#75817D]">
              Tell us what you need and we&apos;ll make sure your message gets
              to the right place.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {contactOptions.map((option) => {
              const Icon = option.icon;

              return (
                <div
                  key={option.title}
                  className="group rounded-[24px] border border-[#E4E3DC] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1F5ED] text-[#277765] transition group-hover:bg-[#173C37] group-hover:text-[#63E6BE]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-[#173C37]">
                    {option.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#75817D]">
                    {option.description}
                  </p>

                  <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#277765]">
                    {option.action}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="bg-[#173C37] text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-8 lg:py-24">
          {/* LEFT */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
              Send us a message
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              We&apos;d love to hear from you.
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-white/60">
              Have something on your mind? Fill out the form and send us a
              message. We&apos;ll review your request and get back to you.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#63E6BE]/15">
                  <Mail className="h-5 w-5 text-[#63E6BE]" />
                </div>

                <div>
                  <p className="font-semibold">Email us</p>
                  <p className="mt-1 text-sm text-white/50">
                    We&apos;ll respond as soon as possible.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#63E6BE]/15">
                  <ShieldCheck className="h-5 w-5 text-[#63E6BE]" />
                </div>

                <div>
                  <p className="font-semibold">Safety comes first</p>
                  <p className="mt-1 text-sm text-white/50">
                    Safety-related concerns receive priority attention.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] bg-white p-7 shadow-2xl sm:p-9"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#394844]"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-[#DCDDD7] bg-white px-4 py-3 text-sm text-[#172322] outline-none transition placeholder:text-[#A0A9A5] focus:border-[#397A69] focus:ring-2 focus:ring-[#63E6BE]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#394844]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#DCDDD7] bg-white px-4 py-3 text-sm text-[#172322] outline-none transition placeholder:text-[#A0A9A5] focus:border-[#397A69] focus:ring-2 focus:ring-[#63E6BE]/20"
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-[#394844]"
              >
                Subject
              </label>

              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#DCDDD7] bg-white px-4 py-3 text-sm text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#63E6BE]/20"
              >
                <option value="">Select a subject</option>
                <option value="general">General enquiry</option>
                <option value="booking">Booking & accommodation</option>
                <option value="payment">Payment issue</option>
                <option value="account">Account support</option>
                <option value="safety">Safety concern</option>
                <option value="other">Something else</option>
              </select>
            </div>

            <div className="mt-5">
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-[#394844]"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell us how we can help..."
                className="w-full resize-none rounded-xl border border-[#DCDDD7] bg-white px-4 py-3 text-sm text-[#172322] outline-none transition placeholder:text-[#A0A9A5] focus:border-[#397A69] focus:ring-2 focus:ring-[#63E6BE]/20"
              />
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#23584E]"
            >
              Send message
              <Send className="h-4 w-4 text-[#63E6BE]" />
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-[#9AA39F]">
              By submitting this form, you agree that TripGuard may use the
              information provided to respond to your enquiry.
            </p>
          </form>
        </div>
      </section>

      {/* SUPPORT CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center lg:px-8 lg:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1F5ED]">
            <ShieldCheck className="h-7 w-7 text-[#277765]" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
            Travel with confidence
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#173C37] sm:text-4xl">
            Your journey matters to us.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#75817D]">
            From finding the right accommodation to completing your stay,
            TripGuard is here to make the experience easier and safer.
          </p>

          <Link
            href="/accommodations"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#173C37] px-6 py-3 font-semibold text-white transition hover:bg-[#23584E]"
          >
            Explore accommodations
            <ArrowRight className="h-4 w-4 text-[#63E6BE]" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;

