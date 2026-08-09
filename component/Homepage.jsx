"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getStatesData } from "nigeria-state-lga-data";
import {
  Search,
  MapPin,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Star,
  HeartHandshake,
  Heart,
  Users,
} from "lucide-react";

const nigeriaStatesData = getStatesData();

const reviews = [
  {
    name: "Amaka Okafor",
    location: "Lagos, Nigeria",
    initials: "AO",
    text: "Finding a comfortable place was easy, but knowing someone I trusted would be notified about my stay gave me an extra level of confidence.",
  },
  {
    name: "Daniel Williams",
    location: "Abuja, Nigeria",
    initials: "DW",
    text: "The whole experience felt simple and reassuring. I found a beautiful apartment and loved the idea that my loved one could know where I was staying.",
  },
  {
    name: "Sarah Adeyemi",
    location: "Port Harcourt, Nigeria",
    initials: "SA",
    text: "TripGuard makes booking feel different. It's not just about finding a nice place to stay; there's a real sense that someone's looking out for you.",
  },
  {
    name: "Chinedu Okoro",
    location: "Enugu, Nigeria",
    initials: "CO",
    text: "The booking experience was smooth from start to finish. I especially appreciated the safety features because I travel frequently on my own.",
  },
  {
    name: "Fatima Bello",
    location: "Kano, Nigeria",
    initials: "FB",
    text: "I loved how easy it was to find a place that matched what I needed. Having someone I trust kept informed made the whole trip feel even better.",
  },
];

const HomePage = () => {
  const [reviewStart, setReviewStart] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLga, setSelectedLga] = useState("");

  const selectedStateRecord = nigeriaStatesData.find(
    (countryState) => countryState.name === selectedState
  );

  const cityOptions = selectedStateRecord?.towns ?? [];
  const lgaOptions = selectedStateRecord?.lgas ?? [];

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
                          value={selectedState}
                          onChange={(e) => {
                            setSelectedState(e.target.value);
                            setSelectedCity("");
                            setSelectedLga("");
                          }}
                          className="h-12 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                        >
                          <option value="">
                            State
                          </option>
                          {nigeriaStatesData.map((countryState) => (
                            <option key={countryState.name} value={countryState.name}>
                              {countryState.name}
                            </option>
                          ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />
                      </div>

                      {/* CITY */}
                      <div className="relative">
                        <select
                          value={selectedCity}
                          onChange={(e) => {
                            setSelectedCity(e.target.value);
                            setSelectedLga("");
                          }}
                          disabled={!selectedState}
                          className="h-12 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition disabled:cursor-not-allowed disabled:bg-[#F3F4F1] disabled:text-[#A0A8A5] focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                        >
                          <option value="">
                            City
                          </option>

                          {cityOptions.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8581]" />
                      </div>

                      {/* LGA */}
                      <div className="relative">
                        <select
                          value={selectedLga}
                          onChange={(e) => setSelectedLga(e.target.value)}
                          disabled={!selectedState}
                          className="h-12 w-full appearance-none rounded-xl border border-[#E2E3DD] bg-white px-3 pr-9 text-sm font-medium text-[#172322] outline-none transition disabled:cursor-not-allowed disabled:bg-[#F3F4F1] disabled:text-[#A0A8A5] focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                        >
                          <option value="">
                            LGA
                          </option>

                          {lgaOptions.map((lga) => (
                            <option key={lga} value={lga}>
                              {lga}
                            </option>
                          ))}
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
      className="hidden items-center gap-2 text-sm font-semibold text-[#173C37] transition hover:text-[#397A69] sm:flex"
    >
      Explore all
      <ArrowRight className="h-4 w-4" />
    </Link>
  </div>

  <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-3">
    {[
      {
        id: "the-meridian-house",
        name: "The Meridian House",
        location: "Victoria Island, Lagos",
        price: 185000,
        rating: 4.9,
        reviews: 128,
        type: "Luxury Hotel",
        guests: 2,
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=90",
        amenities: ["Wi-Fi", "Parking", "Restaurant", "Pool"],
        description:
          "A refined stay in the heart of Victoria Island with contemporary comfort and a peaceful atmosphere.",
      },
      {
        id: "palm-court-residence",
        name: "Palm Court Residence",
        location: "Lekki Phase 1, Lagos",
        price: 95000,
        rating: 4.8,
        reviews: 94,
        type: "Serviced Apartment",
        guests: 2,
        image:
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
        amenities: ["Wi-Fi", "Parking", "Kitchen", "Housekeeping"],
        description:
          "A stylish and comfortable serviced apartment close to some of Lagos's most popular destinations.",
      },
      {
        id: "cedar-view-suites",
        name: "Cedar View Suites",
        location: "Wuse 2, Abuja",
        price: 120000,
        rating: 4.9,
        reviews: 76,
        type: "Boutique Hotel",
        guests: 2,
        image:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=90",
        amenities: ["Wi-Fi", "Parking", "Restaurant", "Pool"],
        description:
          "A calm and sophisticated stay in Wuse 2, designed for travellers who value comfort and convenience.",
      },
    ].map((stay) => (
      <article
        key={stay.id}
        className="group overflow-hidden rounded-[24px] border border-[#E4E3DC] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* IMAGE */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link href={`/accommodations/${stay.id}`}>
            <Image
              src={stay.image}
              alt={stay.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </Link>

          {/* TYPE */}
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#173C37] shadow-sm">
              {stay.type}
            </span>
          </div>

          {/* SAVE */}
          <button
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105"
            aria-label="Save accommodation"
          >
            <Heart className="h-5 w-5 text-[#173C37]" />
          </button>
        </div>

        {/* CARD CONTENT */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <Link
              href={`/accommodations/${stay.id}`}
              className="min-w-0"
            >
              <h3 className="truncate text-lg font-semibold text-[#172322] transition group-hover:text-[#397A69]">
                {stay.name}
              </h3>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-[#7A8581]">
                <MapPin className="h-3.5 w-3.5 text-[#397A69]" />
                {stay.location}
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#173C37]">
              <Star className="h-4 w-4 fill-[#F3C95D] text-[#F3C95D]" />
              {stay.rating}
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#75817D]">
            {stay.description}
          </p>

          {/* AMENITIES */}
          <div className="mt-5 flex flex-wrap gap-2">
            {stay.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="rounded-lg bg-[#F3F5F1] px-2.5 py-1.5 text-[11px] font-medium text-[#596661]"
              >
                {amenity}
              </span>
            ))}

            {stay.amenities.length > 3 && (
              <span className="rounded-lg bg-[#F3F5F1] px-2.5 py-1.5 text-[11px] font-medium text-[#596661]">
                +{stay.amenities.length - 3}
              </span>
            )}
          </div>

          {/* BOTTOM */}
          <div className="mt-5 flex items-end justify-between border-t border-[#ECEBE5] pt-5">
            <div>
              <span className="text-xl font-bold text-[#173C37]">
                ₦{stay.price.toLocaleString()}
              </span>

              <span className="text-xs text-[#7A8581]">
                {" "}
                / night
              </span>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8A9390]">
                <Users className="h-3.5 w-3.5" />
                Up to {stay.guests} guests
              </div>
            </div>

            <Link
              href={`/accommodations/${stay.id}`}
              className="rounded-xl bg-[#173C37] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#23584E]"
            >
              View stay
            </Link>
          </div>

          {/* REVIEWS */}
          <div className="mt-4 flex items-center gap-1.5 text-xs text-[#7A8581]">
            <Star className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]" />

            <span className="font-semibold text-[#596661]">
              {stay.rating}
            </span>

            <span>·</span>

            <span>{stay.reviews} reviews</span>
          </div>
        </div>
      </article>
    ))}
  </div>

  {/* MOBILE EXPLORE LINK */}
  <div className="mt-8 flex justify-center sm:hidden">
    <Link
      href="/accommodations"
      className="flex items-center gap-2 text-sm font-semibold text-[#173C37]"
    >
      Explore all stays
      <ArrowRight className="h-4 w-4" />
    </Link>
  </div>
</section>

      {/* CUSTOMER REVIEWS */}

<section className="bg-[#F7F6F0] py-24">
  <div className="mx-auto max-w-7xl px-5 lg:px-8">


{/* SECTION HEADER */}
<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
  <div className="max-w-2xl">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
      Guest experiences
    </p>

    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#172322] sm:text-4xl lg:text-5xl">
      Stories from happy travellers.
    </h2>

    <p className="mt-4 max-w-xl text-base leading-7 text-[#75817D]">
      Discover why travellers choose TripGuard when they want a
      comfortable stay and the reassurance of knowing someone has
      their back.
    </p>
  </div>

  {/* RATING + NAVIGATION */}
  <div className="flex items-center gap-3">
    {/* RATING */}
    <div className="flex items-center gap-3 rounded-2xl border border-[#E2E1DA] bg-white px-5 py-4 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E1F5ED]">
        <Star className="h-5 w-5 fill-[#F3C95D] text-[#F3C95D]" />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#173C37]">
            4.9
          </span>

          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]"
              />
            ))}
          </div>
        </div>

        <p className="mt-0.5 text-xs text-[#7A8581]">
          Loved by our guests
        </p>
      </div>
    </div>

    {/* NAVIGATION BUTTONS */}
    <button
      type="button"
      onClick={() =>
        setReviewStart((current) => Math.max(current - 1, 0))
      }
      disabled={reviewStart === 0}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#DCDDD6] bg-white text-[#173C37] shadow-sm transition hover:bg-[#173C37] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#173C37]"
      aria-label="Previous reviews"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>

    <button
      type="button"
      onClick={() =>
        setReviewStart((current) =>
          Math.min(current + 1, reviews.length - 3)
        )
      }
      disabled={reviewStart === reviews.length - 3}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#173C37] bg-[#173C37] text-white shadow-sm transition hover:bg-[#23584E] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#173C37]"
      aria-label="Next reviews"
    >
      <ArrowRight className="h-5 w-5" />
    </button>
  </div>
</div>

{/* REVIEWS */}
<div className="mt-14 overflow-hidden">
  <div
    className="flex gap-6 transition-transform duration-500 ease-out"
    style={{
      transform: `translateX(calc(-${reviewStart * (100 / 3)}% - ${
        reviewStart * 8
      }px))`,
    }}
  >
    {reviews.map((review, index) => (
      <article
        key={review.name}
        className={`group flex min-w-full flex-col rounded-[28px] border border-[#E4E3DC] p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] sm:p-8 ${
          index === 1
            ? "bg-[#173C37] text-white"
            : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-4 w-4 fill-[#F3C95D] text-[#F3C95D]"
              />
            ))}
          </div>

          <span
            className={`text-3xl font-serif leading-none ${
              index === 1
                ? "text-white/15"
                : "text-[#DCEAE5]"
            }`}
          >
            “
          </span>
        </div>

        <p
          className={`mt-6 flex-1 text-[15px] leading-7 ${
            index === 1
              ? "text-white/75"
              : "text-[#46534F]"
          }`}
        >
          “{review.text}”
        </p>

        <div
          className={`mt-8 flex items-center gap-3 border-t pt-6 ${
            index === 1
              ? "border-white/10"
              : "border-[#ECEBE5]"
          }`}
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              index === 1
                ? "bg-[#63E6BE] text-[#173C37]"
                : index === 2
                ? "bg-[#E1F5ED] text-[#277765]"
                : "bg-[#173C37] text-[#63E6BE]"
            }`}
          >
            {review.initials}
          </div>

          <div>
            <p
              className={`font-semibold ${
                index === 1
                  ? "text-white"
                  : "text-[#172322]"
              }`}
            >
              {review.name}
            </p>

            <p
              className={`mt-0.5 text-xs ${
                index === 1
                  ? "text-white/50"
                  : "text-[#7A8581]"
              }`}
            >
              {review.location}
            </p>
          </div>
        </div>
      </article>
    ))}
  </div>
</div>

{/* SLIDE INDICATORS */}
<div className="mt-8 flex justify-center gap-2">
  {reviews.slice(0, reviews.length - 2).map((_, index) => (
    <button
      key={index}
      type="button"
      onClick={() => setReviewStart(index)}
      aria-label={`Go to review group ${index + 1}`}
      className={`h-2 rounded-full transition-all duration-300 ${
        reviewStart === index
          ? "w-7 bg-[#173C37]"
          : "w-2 bg-[#CBD3CF]"
      }`}
    />
  ))}
</div>
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