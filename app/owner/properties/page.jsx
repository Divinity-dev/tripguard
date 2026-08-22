"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Edit3,
  Eye,
  MapPin,
  MoreHorizontal,
  Plus,
  Star,
  Users,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const OwnerPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwnerProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/owner/dashboard`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Unable to load your properties."
          );
        }

        setProperties(data.properties || []);

        setStats({
          totalProperties: data.stats?.totalProperties || 0,
          totalBookings: data.stats?.totalBookings || 0,
        });
      } catch (err) {
        console.error("Failed to fetch owner properties:", err);

        setError(
          err.message ||
            "Unable to load your properties. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerProperties();
  }, []);

  const activeListings = properties.filter(
    (property) =>
      property.status === "approved" && property.isAvailable === true
  ).length;

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
            value={loading ? "—" : stats.totalProperties}
            description="Properties listed"
          />

          <SummaryCard
            label="Active listings"
            value={loading ? "—" : activeListings}
            description="Currently visible"
          />

          <SummaryCard
            label="Total bookings"
            value={loading ? "—" : stats.totalBookings}
            description="Across all properties"
          />
        </section>

        {/* ERROR */}
        {error && (
          <section className="mt-8 rounded-[22px] border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Try again
            </button>
          </section>
        )}

        {/* PROPERTY LIST */}
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Your listings
              </h2>

              <p className="mt-1 text-sm text-[#7A8581]">
                {loading
                  ? "Loading properties..."
                  : `${properties.length} ${
                      properties.length === 1
                        ? "property"
                        : "properties"
                    }`}
              </p>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="space-y-5">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-[26px] border border-[#E3E3DC] bg-white"
                >
                  <div className="grid lg:grid-cols-[300px_1fr]">
                    <div className="h-[230px] animate-pulse bg-[#E9E9E2] lg:h-full lg:min-h-[300px]" />

                    <div className="space-y-5 p-5 sm:p-7">
                      <div className="space-y-3">
                        <div className="h-5 w-28 animate-pulse rounded bg-[#E9E9E2]" />

                        <div className="h-7 w-56 animate-pulse rounded bg-[#E9E9E2]" />

                        <div className="h-4 w-44 animate-pulse rounded bg-[#E9E9E2]" />
                      </div>

                      <div className="h-12 w-full animate-pulse rounded bg-[#E9E9E2]" />

                      <div className="grid grid-cols-2 gap-4 border-y border-[#ECEBE5] py-5 sm:grid-cols-4">
                        {[1, 2, 3, 4].map((stat) => (
                          <div
                            key={stat}
                            className="h-10 animate-pulse rounded bg-[#E9E9E2]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROPERTIES */}
          {!loading && properties.length > 0 && (
            <div className="space-y-5">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                />
              ))}
            </div>
          )}
        </section>

        {/* EMPTY STATE */}
        {!loading && properties.length === 0 && !error && (
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

/* -------------------------------------------------------------------------- */
/* SUMMARY CARD                                                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* PROPERTY CARD                                                              */
/* -------------------------------------------------------------------------- */

const PropertyCard = ({ property }) => {
  const propertyId = property._id;

  const location = [
    property.location?.city,
    property.location?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const isActive =
    property.status === "approved" && property.isAvailable === true;

  return (
    <article className="overflow-hidden rounded-[26px] border border-[#E3E3DC] bg-white">
      <div className="grid lg:grid-cols-[300px_1fr]">
        {/* IMAGE */}
        <div className="relative h-[230px] lg:h-full lg:min-h-[300px]">
          <Image
            src={
              property.images?.[0] ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=90"
            }
            alt={property.name}
            fill
            className="object-cover"
          />

          <div className="absolute left-4 top-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold shadow-sm ${
                isActive
                  ? "text-[#277765]"
                  : "text-[#8A5A18]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive
                    ? "bg-[#397A69]"
                    : "bg-[#C58A32]"
                }`}
              />

              {property.status === "approved"
                ? property.isAvailable
                  ? "Active"
                  : "Unavailable"
                : property.status.charAt(0).toUpperCase() +
                  property.status.slice(1)}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5">
            {/* TOP */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-[#E1F5ED] px-3 py-1 text-[10px] font-bold capitalize text-[#277765]">
                  {property.type}
                </span>

                <h2 className="mt-3 text-xl font-semibold tracking-tight">
                  {property.name}
                </h2>

                <div className="mt-2 flex items-center gap-1.5 text-sm text-[#75817D]">
                  <MapPin className="h-4 w-4 text-[#397A69]" />
                  {location || "Location unavailable"}
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
                    ₦{property.pricePerNight.toLocaleString("en-NG")}
                    <span className="ml-1 text-[10px] font-normal text-[#8A9390]">
                      / night
                    </span>
                  </>
                }
              />

              <InfoItem
                label="Rating"
                value={
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]" />
                    {property.averageRating > 0
                      ? property.averageRating.toFixed(1)
                      : "—"}
                  </span>
                }
              />

              <InfoItem
                label="Reviews"
                value={property.totalReviews}
              />

              <InfoItem
                label="Bookings"
                value={property.bookingCount || 0}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-[#8A9390]">
                <Users className="h-4 w-4" />
                Up to {property.maxGuests} guests
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/accommodations/${property.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE2DF] px-4 py-2.5 text-xs font-semibold text-[#173C37] transition hover:border-[#173C37] hover:bg-[#F7F8F4]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Link>

                <Link
                   href={`/owner/properties/new?id=${propertyId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE2DF] px-4 py-2.5 text-xs font-semibold text-[#173C37] transition hover:border-[#173C37] hover:bg-[#F7F8F4]"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </Link>

                <Link
                  href={`/owner/bookings?property=${propertyId}`}
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

/* -------------------------------------------------------------------------- */
/* INFO ITEM                                                                  */
/* -------------------------------------------------------------------------- */

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