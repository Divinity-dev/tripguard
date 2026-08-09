import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  Star,
  HeartHandshake,
} from "lucide-react";

import Navbar from "../component/Navbar";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#172322]">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-[#10201E]">
        {/* BACKGROUND IMAGE */}
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2200&q=90"
          alt="Luxury accommodation"
          fill
          priority
          className="object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-[#07110F]/55" />

        {/* GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07110F]/75 via-[#07110F]/25 to-[#10201E]/95" />

        {/* NAVBAR */}
        <Navbar />

        {/* HERO CONTENT */}
        <div className="relative z-10 flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-28 lg:px-8">
            <div className="max-w-5xl">
              {/* BADGE */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <ShieldCheck className="h-4 w-4 text-[#63E6BE]" />
                Travel with someone looking out for you
              </div>

              {/* HEADING */}
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[82px]">
                Find your place.
                <br />
                <span className="text-[#63E6BE]">
                  Travel with confidence.
                </span>
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                Discover hotels, apartments and short-let stays wherever your
                journey takes you. TripGuard helps someone you trust know where
                you're staying.
              </p>

              {/* SEARCH CARD */}
              <div className="mt-10 max-w-6xl rounded-[28px] border border-white/20 bg-white p-3 shadow-2xl">
                <div className="grid gap-3 lg:grid-cols-[2fr_1.2fr_auto]">
                  {/* LOCATION GROUP */}
                  <div className="rounded-2xl bg-[#F7F7F3] p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#397A69]" />

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8581]">
                          Location
                        </p>

                        <p className="text-xs text-[#9AA29F]">
                          Where are you staying?
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      {/* STATE */}
                      <div className="relative">
                        <select
                          defaultValue=""
                          className="h-12 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                        >
                          <option value="" disabled>
                            State
                          </option>
                          <option>Lagos</option>
                          <option>Abuja</option>
                          <option>Rivers</option>
                          <option>Oyo</option>
                          <option>Delta</option>
                          <option>Edo</option>
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />
                      </div>

                      {/* CITY */}
                      <div className="relative">
                        <select
                          defaultValue=""
                          className="h-12 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                        >
                          <option value="" disabled>
                            City
                          </option>
                          <option>Lagos</option>
                          <option>Ikeja</option>
                          <option>Victoria Island</option>
                          <option>Lekki</option>
                          <option>Abuja</option>
                          <option>Port Harcourt</option>
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />
                      </div>

                      {/* LGA */}
                      <div className="relative">
                        <select
                          defaultValue=""
                          className="h-12 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                        >
                          <option value="" disabled>
                            LGA
                          </option>
                          <option>Ikeja</option>
                          <option>Eti-Osa</option>
                          <option>Surulere</option>
                          <option>Alimosho</option>
                          <option>Kosofe</option>
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />
                      </div>
                    </div>
                  </div>

                  {/* PRICE RANGE */}
                  <div className="rounded-2xl bg-[#F7F7F3] p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#E1F5ED] text-xs font-bold text-[#397A69]">
                        ₦
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8581]">
                          Price range
                        </p>

                        <p className="text-xs text-[#9AA29F]">
                          Per night
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        defaultValue=""
                        className="h-12 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                      >
                        <option value="" disabled>
                          Select price range
                        </option>

                        <option value="10000-50000">
                          ₦10,000 – ₦50,000
                        </option>

                        <option value="50000-100000">
                          ₦50,000 – ₦100,000
                        </option>

                        <option value="100000-200000">
                          ₦100,000 – ₦200,000
                        </option>

                        <option value="200000-500000">
                          ₦200,000 – ₦500,000
                        </option>

                        <option value="500000-1000000">
                          ₦500,000 – ₦1,000,000
                        </option>

                        <option value="1000000+">
                          ₦1,000,000+
                        </option>
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />
                    </div>
                  </div>

                  {/* SEARCH BUTTON */}
                  <button
                    type="button"
                    className="flex min-h-[90px] items-center justify-center gap-2 rounded-2xl bg-[#173C37] px-8 font-semibold text-white transition hover:bg-[#23584E] lg:min-h-full"
                  >
                    <Search className="h-5 w-5" />

                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* TRUST INDICATOR */}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/65">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#63E6BE]" />
                  Trusted-contact notifications
                </div>

                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-[#63E6BE]" />
                  Built with traveller safety in mind
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM INDICATOR */}
        <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/40 sm:flex">
          <span>Discover</span>

          <div className="h-px w-10 bg-white/30" />

          <span>Stay</span>

          <div className="h-px w-10 bg-white/30" />

          <span>Stay safe</span>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="border-b border-[#E2E1DA] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-7 sm:flex-row lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E1F5ED]">
              <ShieldCheck className="h-5 w-5 text-[#277765]" />
            </div>

            <div>
              <p className="font-semibold text-[#172322]">
                Your journey doesn't have to be a secret.
              </p>

              <p className="mt-1 text-sm text-[#75817D]">
                Choose someone you trust and we'll keep them informed.
              </p>
            </div>
          </div>

          <Link
            href="#safety"
            className="flex items-center gap-2 text-sm font-semibold text-[#277765]"
          >
            Learn more
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* FEATURED STAYS */}
      <section id="stays" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
              Popular right now
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Places worth staying.
            </h2>
          </div>

          <Link
            href="/accommodations"
            className="hidden items-center gap-2 text-sm font-semibold text-[#173C37] sm:flex"
          >
            Explore all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-7 md:grid-cols-3">
          {[
            {
              name: "The Meridian House",
              location: "Victoria Island, Lagos",
              price: "₦185,000",
              image:
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
            },
            {
              name: "Palm Court Residence",
              location: "Lekki Phase 1, Lagos",
              price: "₦95,000",
              image:
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
            },
            {
              name: "Cedar View Suites",
              location: "Wuse 2, Abuja",
              price: "₦120,000",
              image:
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
            },
          ].map((stay) => (
            <Link
              key={stay.name}
              href="/accommodations"
              className="group overflow-hidden rounded-3xl bg-white ring-1 ring-[#E5E4DD] transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={stay.image}
                  alt={stay.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#173C37]">
                  <Star className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]" />
                  4.9
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold">{stay.name}</h3>

                <div className="mt-2 flex items-center gap-1.5 text-sm text-[#7A8581]">
                  <MapPin className="h-3.5 w-3.5" />
                  {stay.location}
                </div>

                <div className="mt-5 border-t border-[#ECEBE5] pt-4">
                  <span className="font-bold text-[#173C37]">
                    {stay.price}
                  </span>

                  <span className="text-sm text-[#8A9390]"> / night</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SAFETY SECTION */}
      <section id="safety" className="bg-[#173C37] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#63E6BE]/15">
              <ShieldCheck className="h-7 w-7 text-[#63E6BE]" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
              The TripGuard difference
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Book your stay.
              <br />
              Let someone know you're safe.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">
              During booking, choose someone you trust. When you check in,
              we'll let them know where you're staying. When you check out,
              we'll let them know you're on your way.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;