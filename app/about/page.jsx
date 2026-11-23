"use client";

import Link from "next/link";
import {
  ShieldCheck,
  HeartHandshake,
  SearchCheck,
  BellRing,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const AboutPage = () => {
  const features = [
    {
      icon: SearchCheck,
      title: "Find the right stay",
      description:
        "Discover hotels, apartments, and short-let stays based on your preferred location and budget.",
    },
    {
      icon: ShieldCheck,
      title: "Stay with confidence",
      description:
        "TripGuard is designed around traveller safety, helping you make more informed accommodation choices.",
    },
    {
      icon: BellRing,
      title: "Keep someone informed",
      description:
        "Choose someone you trust and let them know where you're staying when you check in and check out.",
    },
    {
      icon: HeartHandshake,
      title: "Travel with peace of mind",
      description:
        "Enjoy your journey knowing that someone you trust can have your back throughout your stay.",
    },
  ];

  const values = [
    {
      title: "Safety first",
      description:
        "We believe travellers deserve more than a comfortable place to stay. They deserve peace of mind.",
    },
    {
      title: "Simple by design",
      description:
        "Finding and booking accommodation should feel straightforward, clear, and stress-free.",
    },
    {
      title: "Built around trust",
      description:
        "TripGuard gives travellers a simple way to keep someone they trust informed.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#172322]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#173C37] text-white">
        <div className="absolute right-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#63E6BE]/10 blur-3xl" />

        <div className="absolute bottom-[-180px] left-[-120px] h-[400px] w-[400px] rounded-full bg-[#63E6BE]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-[#63E6BE]" />
              Travel with someone looking out for you
            </div>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              More than a place to stay.
              <br />
              <span className="text-[#63E6BE]">
                A safer way to travel.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              TripGuard makes it easier to discover accommodation while giving
              you an additional layer of reassurance throughout your journey.
            </p>
          </div>
        </div>
      </section>

      {/* INTRODUCTION - WHITE */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
              About TripGuard
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#172322] sm:text-4xl">
              We believe where you stay should feel safe.
            </h2>
          </div>

          <div className="space-y-5 text-[15px] leading-7 text-[#75817D]">
            <p>
              Travelling should be exciting. Whether you're travelling for
              work, taking a holiday, visiting family, or simply exploring
              somewhere new, choosing where to stay is an important part of
              the journey.
            </p>

            <p>
              But finding a beautiful place to stay is only part of the
              experience. There is also the reassurance that comes from knowing
              someone you trust knows where you are.
            </p>

            <p>
              That is why we built TripGuard — an accommodation platform
              designed to combine convenience with a safety-focused experience.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION - DARK GREEN */}
      <section className="bg-[#173C37] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-center">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#63E6BE]/15">
                <ShieldCheck className="h-7 w-7 text-[#63E6BE]" />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
                Our mission
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Making accommodation booking feel safer.
              </h2>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/10 p-8 backdrop-blur-sm sm:p-10">
              <p className="text-lg leading-8 text-white/90">
                Our mission is simple: help people find accommodation that
                fits their needs while giving them the tools to travel with
                greater confidence.
              </p>

              <p className="mt-5 text-[15px] leading-7 text-white/60">
                TripGuard gives travellers a simple way to search for stays,
                make bookings, and choose someone they trust to receive
                important information about their stay.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-5">
                  <p className="text-2xl font-semibold text-[#173C37]">
                    Safety
                  </p>
                  <p className="mt-1 text-sm text-[#7A8581]">
                    Built into the experience
                  </p>
                </div>

                <div className="rounded-2xl bg-[#63E6BE] p-5">
                  <p className="text-2xl font-semibold text-[#173C37]">
                    Trust
                  </p>
                  <p className="mt-1 text-sm text-[#277765]">
                    Someone has your back
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - WHITE */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
              What we offer
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#172322] sm:text-4xl">
              Designed around the traveller.
            </h2>

            <p className="mt-4 leading-7 text-[#75817D]">
              Every part of TripGuard is designed to make your accommodation
              experience easier while keeping safety and reassurance at the
              centre.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group rounded-[24px] border border-[#E4E3DC] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1F5ED] text-[#277765] transition group-hover:bg-[#173C37] group-hover:text-[#63E6BE]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-[#172322]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#75817D]">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - DARK GREEN */}
      <section className="bg-[#173C37] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
                How TripGuard works
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Find your place.
                <br />
                Travel with confidence.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-white/60">
                We keep the experience simple so you can spend less time
                worrying about accommodation and more time enjoying your
                journey.
              </p>

              <div className="mt-8 space-y-6">
                {[
                  {
                    number: "01",
                    title: "Discover",
                    text: "Search for hotels, apartments, and short-let stays based on your location and budget.",
                  },
                  {
                    number: "02",
                    title: "Choose",
                    text: "Explore accommodation details and choose a stay that fits your needs.",
                  },
                  {
                    number: "03",
                    title: "Stay informed",
                    text: "Choose someone you trust to receive important information about your stay.",
                  },
                ].map((step) => (
                  <div key={step.number} className="flex gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#63E6BE] text-sm font-semibold text-[#173C37]">
                      {step.number}
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-white/55">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-8 text-[#172322] shadow-2xl sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1F5ED]">
                <HeartHandshake className="h-7 w-7 text-[#277765]" />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
                The TripGuard difference
              </p>

              <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[#173C37]">
                Someone looking out for you.
              </h3>

              <p className="mt-5 leading-7 text-[#75817D]">
                We believe that one of the simplest ways to make travel feel
                safer is to make sure someone you trust knows where you are.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Choose someone you trust",
                  "Share important stay information",
                  "Keep them informed at check-in",
                  "Let them know when you check out",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#596661]"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#277765]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES - WHITE */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
              What matters to us
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#172322] sm:text-4xl">
              Built on a few simple principles.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <article
                key={value.title}
                className={`rounded-[24px] border p-7 ${
                  index === 1
                    ? "border-[#173C37] bg-[#173C37] text-white"
                    : "border-[#E4E3DC] bg-white"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                    index === 1
                      ? "bg-[#63E6BE] text-[#173C37]"
                      : "bg-[#E1F5ED] text-[#277765]"
                  }`}
                >
                  0{index + 1}
                </div>

                <h3
                  className={`mt-6 text-xl font-semibold ${
                    index === 1 ? "text-white" : "text-[#172322]"
                  }`}
                >
                  {value.title}
                </h3>

                <p
                  className={`mt-3 text-sm leading-7 ${
                    index === 1 ? "text-white/65" : "text-[#75817D]"
                  }`}
                >
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - DARK GREEN */}
      <section className="bg-[#173C37] text-white">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center lg:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#63E6BE]/15">
            <ShieldCheck className="h-7 w-7 text-[#63E6BE]" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
            Ready to explore?
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Find your place.
            <br />
            Travel with confidence.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/65">
            Discover hotels, apartments, and short-let stays with TripGuard.
          </p>

          <Link
            href="/accommodations"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#63E6BE] px-6 py-3 font-semibold text-[#173C37] transition hover:bg-[#4fd3ab]"
          >
            Explore accommodations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;

