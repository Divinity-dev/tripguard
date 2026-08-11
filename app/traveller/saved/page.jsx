"use client";

import {
  ArrowRight,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialSavedStays = [
  {
    id: "TG-HOTEL-001",
    name: "Palm Court Residence",
    location: "Lekki Phase 1, Lagos",
    price: "₦75,000",
    priceLabel: "per night",
    rating: "4.7",
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
    protection: true,
  },
  {
    id: "TG-HOTEL-002",
    name: "Cedar View Suites",
    location: "Ikeja, Lagos",
    price: "₦62,000",
    priceLabel: "per night",
    rating: "4.8",
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=90",
    protection: true,
  },
  {
    id: "TG-HOTEL-003",
    name: "The Haven Apartments",
    location: "Yaba, Lagos",
    price: "₦48,000",
    priceLabel: "per night",
    rating: "4.6",
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=90",
    protection: true,
  },
  {
    id: "TG-HOTEL-004",
    name: "Victoria Grand Hotel",
    location: "Victoria Island, Lagos",
    price: "₦95,000",
    priceLabel: "per night",
    rating: "4.9",
    reviews: 211,
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=90",
    protection: true,
  },
  {
    id: "TG-HOTEL-005",
    name: "Azure Luxury Apartments",
    location: "Ikoyi, Lagos",
    price: "₦110,000",
    priceLabel: "per night",
    rating: "4.8",
    reviews: 143,
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90",
    protection: true,
  },
  {
    id: "TG-HOTEL-006",
    name: "Greenfield Suites",
    location: "Surulere, Lagos",
    price: "₦55,000",
    priceLabel: "per night",
    rating: "4.5",
    reviews: 61,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=90",
    protection: true,
  },
];

const SafeStaysPage = () => {
  const [savedStays, setSavedStays] = useState(initialSavedStays);
  const [search, setSearch] = useState("");

  const removeStay = (id) => {
    setSavedStays((current) =>
      current.filter((stay) => stay.id !== id)
    );
  };

  const filteredStays = savedStays.filter((stay) => {
    const searchTerm = search.toLowerCase();

    return (
      stay.name.toLowerCase().includes(searchTerm) ||
      stay.location.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
                  <Heart size={22} fill="currentColor" />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#16a765]">
                    Traveller Dashboard
                  </p>

                  <h1 className="mt-0.5 text-2xl font-bold tracking-tight sm:text-3xl">
                    Safe Stays
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Your saved accommodations. Keep your favourite stays
                close so you can book them whenever you're ready.
              </p>
            </div>

            <Link
              href="/accommodations"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
            >
              Find a Stay
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Count */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">
              Saved accommodations
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {savedStays.length}{" "}
              {savedStays.length === 1 ? "stay" : "stays"} saved
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search saved stays..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#16a765] focus:ring-2 focus:ring-[#16a765]/10"
            />
          </div>
        </section>

        {/* Safety Notice */}
        <section className="mt-6 flex gap-4 rounded-2xl border border-[#16a765]/20 bg-[#16a765]/5 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16a765]/10 text-[#16a765]">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h3 className="text-sm font-bold">
              Look for TripGuard Protection
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">
              Protected accommodations allow you to add a safety
              contact and keep your loved ones informed about your
              trip.
            </p>
          </div>
        </section>

        {/* Saved Stays */}
        {filteredStays.length > 0 ? (
          <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStays.map((stay) => (
              <StayCard
                key={stay.id}
                stay={stay}
                onRemove={removeStay}
              />
            ))}
          </section>
        ) : (
          <EmptyState
            hasSearch={Boolean(search)}
            onClear={() => setSearch("")}
          />
        )}

        {/* Bottom CTA */}
        {savedStays.length > 0 && (
          <section className="mt-10 overflow-hidden rounded-2xl bg-gray-900 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#63E6BE]">
                  <ShieldCheck size={19} />

                  <span className="text-sm font-semibold">
                    Travel with confidence
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-bold sm:text-2xl">
                  Find your next safe stay.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                  Discover accommodations and protect your trips
                  with TripGuard.
                </p>
              </div>

              <Link
                href="/accommodations"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
              >
                Explore stays
                <ArrowRight size={17} />
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function StayCard({ stay, onRemove }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={stay.image}
          alt={stay.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          {stay.protection && (
            <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#16a765] shadow-sm">
              <ShieldCheck size={14} />
              Protected
            </div>
          )}

          <button
            type="button"
            onClick={() => onRemove(stay.id)}
            aria-label={`Remove ${stay.name} from saved stays`}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-red-50"
          >
            <Heart size={18} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold">
              {stay.name}
            </h3>

            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin
                size={15}
                className="shrink-0 text-[#16a765]"
              />

              <span className="truncate">{stay.location}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-yellow-50 px-2.5 py-1.5 text-xs font-bold text-yellow-700">
            <Star size={13} fill="currentColor" />
            {stay.rating}
          </div>
        </div>

        <p className="mt-2 text-xs text-gray-400">
          {stay.reviews} reviews
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <span className="text-lg font-bold">
              {stay.price}
            </span>

            <span className="ml-1 text-xs text-gray-400">
              {stay.priceLabel}
            </span>
          </div>

          <Link
            href={`/accommodations/${stay.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#16a765] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#128c55]"
          >
            View Stay
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ hasSearch, onClear }) {
  return (
    <section className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#16a765]/10 text-[#16a765]">
        {hasSearch ? (
          <Search size={26} />
        ) : (
          <Heart size={26} />
        )}
      </div>

      <h2 className="mt-5 text-lg font-bold">
        {hasSearch
          ? "No saved stays found"
          : "You haven't saved any stays yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasSearch
          ? "Try searching with a different property name or location."
          : "When you find an accommodation you love, save it here so you can easily come back to it later."}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        {hasSearch && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Clear Search
          </button>
        )}

        <Link
          href="/accommodations"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
        >
          Explore accommodations
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
export default SafeStaysPage;