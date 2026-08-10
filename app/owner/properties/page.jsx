"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Eye,
  MapPin,
  MoreHorizontal,
  Plus,
  Star,
  Users,
} from "lucide-react";

const properties = [
  {
    id: "the-meridian-house",
    name: "The Meridian House",
    type: "Luxury Hotel",
    location: "Victoria Island, Lagos",
    price: "₦185,000",
    period: "/ night",
    rating: "4.9",
    reviews: 128,
    guests: 2,
    bookings: 14,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=90",
    description:
      "A refined stay in the heart of Victoria Island with contemporary comfort and a peaceful atmosphere.",
  },
  {
    id: "palm-court-residence",
    name: "Palm Court Residence",
    type: "Serviced Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "₦95,000",
    period: "/ night",
    rating: "4.8",
    reviews: 94,
    guests: 2,
    bookings: 9,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=90",
    description:
      "A stylish and comfortable serviced apartment close to some of Lagos's most popular destinations.",
  },
  {
    id: "cedar-view-suites",
    name: "Cedar View Suites",
    type: "Boutique Hotel",
    location: "Wuse 2, Abuja",
    price: "₦120,000",
    period: "/ night",
    rating: "4.9",
    reviews: 76,
    guests: 2,
    bookings: 5,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=90",
    description:
      "A calm and sophisticated stay in Wuse 2 for travellers who value comfort and convenience.",
  },
];

const OwnerPropertiesPage = () => {
  return (
    <main className="min-h-screen bg-[#F7F7F2] text-[#172322]">
      {/* HEADER */}
      <section className="border-b border-[#E4E3DC] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
                Owner dashboard
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                My properties
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#75817D]">
                Manage your accommodations, pricing, availability and
                property information.
              </p>
            </div>

            <Link
              href="/owner/properties/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#23584E]"
            >
              <Plus className="h-4 w-4 text-[#63E6BE]" />
              Add new property
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* SUMMARY */}
        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total properties"
            value="3"
            description="Properties listed"
          />

          <SummaryCard
            label="Active listings"
            value="3"
            description="Currently visible"
          />

          <SummaryCard
            label="Total bookings"
            value="28"
            description="Across all properties"
          />
        </section>

        {/* PROPERTY LIST */}
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Your listings
              </h2>

              <p className="mt-1 text-sm text-[#7A8581]">
                {properties.length} properties
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        </section>

        {/* EMPTY STATE */}
        {properties.length === 0 && (
          <section className="mt-8 rounded-[28px] border border-[#E3E3DC] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E1F5ED]">
              <Plus className="h-7 w-7 text-[#277765]" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              You haven't listed a property yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A8581]">
              Start earning by listing your hotel, apartment or
              short-let accommodation on TripGuard.
            </p>

            <Link
              href="/owner/properties/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#173C37] px-5 py-3 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4 text-[#63E6BE]" />
              List your property
            </Link>
          </section>
        )}

        {/* HELP / CTA */}
        <section className="mt-10 overflow-hidden rounded-[28px] bg-[#173C37]">
          <div className="flex flex-col gap-6 p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
                Grow with TripGuard
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                Have another property?
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/65">
                Add another accommodation to your portfolio and
                reach more travellers looking for comfortable and
                trustworthy places to stay.
              </p>
            </div>

            <Link
              href="/owner/properties/new"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#63E6BE] px-5 py-3.5 text-sm font-bold text-[#173C37] transition hover:bg-[#8AF0D0]"
            >
              Add property
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default OwnerPropertiesPage;

const SummaryCard = ({ label, value, description }) => {
  return (
    <div className="rounded-[22px] border border-[#E3E3DC] bg-white p-5">
      <p className="text-sm font-medium text-[#75817D]">
        {label}
      </p>

      <div className="mt-2 flex items-end justify-between gap-4">
        <p className="text-2xl font-bold text-[#173C37]">
          {value}
        </p>

        <span className="text-xs text-[#8A9390]">
          {description}
        </span>
      </div>
    </div>
  );
};

const PropertyCard = ({ property }) => {
  return (
    <article className="overflow-hidden rounded-[26px] border border-[#E3E3DC] bg-white">
      <div className="grid lg:grid-cols-[300px_1fr]">
        {/* IMAGE */}
        <div className="relative h-[230px] lg:h-full lg:min-h-[300px]">
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover"
          />

          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#277765] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#397A69]" />
              {property.status}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5">
            {/* TOP */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-[#E1F5ED] px-3 py-1 text-[10px] font-bold text-[#277765]">
                  {property.type}
                </span>

                <h2 className="mt-3 text-xl font-semibold tracking-tight">
                  {property.name}
                </h2>

                <div className="mt-2 flex items-center gap-1.5 text-sm text-[#75817D]">
                  <MapPin className="h-4 w-4 text-[#397A69]" />
                  {property.location}
                </div>
              </div>

              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E3E5E0] text-[#75817D] transition hover:bg-[#F4F5F1] hover:text-[#173C37]"
                aria-label={`More options for ${property.name}`}
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* DESCRIPTION */}
            <p className="max-w-2xl text-sm leading-6 text-[#697570]">
              {property.description}
            </p>

            {/* INFO */}
            <div className="grid grid-cols-2 gap-4 border-y border-[#ECEBE5] py-5 sm:grid-cols-4">
              <InfoItem
                label="Price"
                value={
                  <>
                    {property.price}
                    <span className="ml-1 text-[10px] font-normal text-[#8A9390]">
                      {property.period}
                    </span>
                  </>
                }
              />

              <InfoItem
                label="Rating"
                value={
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]" />
                    {property.rating}
                  </span>
                }
              />

              <InfoItem
                label="Reviews"
                value={property.reviews}
              />

              <InfoItem
                label="Bookings"
                value={property.bookings}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-[#8A9390]">
                <Users className="h-4 w-4" />
                Up to {property.guests} guests
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/accommodations/${property.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE2DF] px-4 py-2.5 text-xs font-semibold text-[#173C37] transition hover:border-[#173C37] hover:bg-[#F7F8F4]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Link>

                <Link
                  href={`/owner/properties/${property.id}/edit`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE2DF] px-4 py-2.5 text-xs font-semibold text-[#173C37] transition hover:border-[#173C37] hover:bg-[#F7F8F4]"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </Link>

                <Link
                  href={`/owner/bookings?property=${property.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173C37] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#23584E]"
                >
                  <CalendarDays className="h-3.5 w-3.5 text-[#63E6BE]" />
                  Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A9390]">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-[#173C37]">
        {value}
      </p>
    </div>
  );
};

