"use client";

import {
  ArrowRight,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SafeStaysPage = () => {
  const [savedStays, setSavedStays] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [removingId, setRemovingId] = useState(null);

  /*
   * ==================================================
   * FETCH SAVED STAYS
   * ==================================================
   */

  const fetchSavedStays = async () => {
    try {
      setLoading(true);
      setError("");

      if (!API_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured"
        );
      }

      const response = await fetch(
        `${API_URL}/saved`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log(
        "Saved accommodations response:",
        data
      );

     if (!response.ok) {
  throw new Error(
    data.message ||
      "Unable to retrieve your saved stays."
  );
}

      setSavedStays(
        data.savedAccommodations || []
      );
    } catch (error) {
      console.error(
        "Fetch saved stays error:",
        error
      );

      setError(
        error.message ||
          "Unable to retrieve your saved stays."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedStays();
  }, []);

  /*
   * ==================================================
   * REMOVE SAVED STAY
   * ==================================================
   */

  const removeStay = async (accommodationId) => {
    try {
      setRemovingId(accommodationId);

      if (!API_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured"
        );
      }

      const response = await fetch(
        `${API_URL}/saved/${accommodationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

     if (!response.ok) {
  throw new Error(
    data.message ||
      "Unable to remove saved stay."
  );
}

      /*
       * Remove it immediately from the UI.
       */

      setSavedStays((current) =>
        current.filter(
          (saved) =>
            getAccommodationId(saved) !==
            accommodationId
        )
      );
    } catch (error) {
      console.error(
        "Remove saved stay error:",
        error
      );

      alert(
        error.message ||
          "Unable to remove saved stay."
      );
    } finally {
      setRemovingId(null);
    }
  };

  /*
   * ==================================================
   * SEARCH
   * ==================================================
   */

  const filteredStays = savedStays.filter(
    (saved) => {
      const stay = saved.accommodation;

      if (!stay) {
        return false;
      }

      const searchTerm =
        search.toLowerCase().trim();

      if (!searchTerm) {
        return true;
      }

      const name =
        stay.name?.toLowerCase() || "";

      const location = [
        stay.location?.address,
        stay.location?.city,
        stay.location?.state,
      ]
        .filter(Boolean)
        .join(", ")
        .toLowerCase();

      return (
        name.includes(searchTerm) ||
        location.includes(searchTerm)
      );
    }
  );

  /*
   * ==================================================
   * LOADING STATE
   * ==================================================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
                <Heart
                  size={22}
                  fill="currentColor"
                />
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
              Your saved accommodations. Keep your
              favourite stays close so you can book
              them whenever you're ready.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#16a765]/10">
              <Loader2
                size={22}
                className="animate-spin text-[#16a765]"
              />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Loading your saved stays...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ==================================================
   * ERROR STATE
   * ==================================================
   */

  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-[#16a765]">
              Traveller Dashboard
            </p>

            <h1 className="mt-0.5 text-2xl font-bold tracking-tight sm:text-3xl">
              Safe Stays
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Your saved accommodations.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchSavedStays}
              className="mt-5 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
      {/* Header */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
                  <Heart
                    size={22}
                    fill="currentColor"
                  />
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
                Your saved accommodations. Keep your
                favourite stays close so you can book
                them whenever you're ready.
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
              {savedStays.length === 1
                ? "stay"
                : "stays"}{" "}
              saved
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
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
              Protected accommodations allow you to
              add a safety contact and keep your loved
              ones informed about your trip.
            </p>
          </div>
        </section>

        {/* Saved Stays */}

        {filteredStays.length > 0 ? (
          <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStays.map((saved) => {
  const accommodation = saved.accommodation;

  const accommodationId =
    getAccommodationId(saved);

  return (
    <StayCard
      key={saved._id || accommodationId}
      stay={accommodation}
      removing={
        removingId === accommodationId
      }
      onRemove={removeStay}
    />
  );
})}
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
                  Discover accommodations and protect
                  your trips with TripGuard.
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
};

/*
 * ==================================================
 * GET ACCOMMODATION ID
 * ==================================================
 */

function getAccommodationId(saved) {
  return (
    saved?.accommodation?._id ||
    saved?.accommodation?.id ||
    saved?.accommodation
  );
}

/*
 * ==================================================
 * STAY CARD
 * ==================================================
 */

function StayCard({
  stay,
  onRemove,
  removing,
}) {
  
  const image =
    stay?.images?.[0] ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";

  const name =
    stay?.name ||
    "Accommodation";

  const location = [
    stay?.location?.address,
    stay?.location?.city,
    stay?.location?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const displayLocation =
    location || "Location unavailable";

  const rating =
    stay?.rating ??
    stay?.averageRating ??
    null;

  const reviews =
    stay?.reviews ??
    stay?.reviewCount ??
    stay?.totalReviews ??
    0;

  const price =
    stay?.price ??
    stay?.pricePerNight ??
    stay?.nightlyPrice ??
    0;

  const protection =
    stay?.protection ??
    stay?.tripGuardProtection ??
    true;

  const accommodationId =
  stay?._id || stay?.id;

const slug = stay?.slug;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Image */}

      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          {protection && (
            <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#16a765] shadow-sm">
              <ShieldCheck size={14} />
              Protected
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              onRemove(accommodationId)
            }
            disabled={removing}
            aria-label={`Remove ${name} from saved stays`}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {removing ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Heart
                size={18}
                fill="currentColor"
              />
            )}
          </button>
        </div>
      </div>

      {/* Content */}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold">
              {name}
            </h3>

            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin
                size={15}
                className="shrink-0 text-[#16a765]"
              />

              <span className="truncate">
                {displayLocation}
              </span>
            </div>
          </div>

          {rating !== null && (
            <div className="flex shrink-0 items-center gap-1 rounded-lg bg-yellow-50 px-2.5 py-1.5 text-xs font-bold text-yellow-700">
              <Star
                size={13}
                fill="currentColor"
              />

              {rating}
            </div>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-400">
          {reviews}{" "}
          {reviews === 1 ? "review" : "reviews"}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <span className="text-lg font-bold">
              {formatPrice(price)}
            </span>

            <span className="ml-1 text-xs text-gray-400">
              per night
            </span>
          </div>

          <Link
            href={`/accommodations/${slug }`}
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

/*
 * ==================================================
 * EMPTY STATE
 * ==================================================
 */

function EmptyState({
  hasSearch,
  onClear,
}) {
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

/*
 * ==================================================
 * FORMAT PRICE
 * ==================================================
 */

function formatPrice(price) {
  if (
    price === undefined ||
    price === null ||
    price === ""
  ) {
    return "—";
  }

  return `₦${Number(price).toLocaleString(
    "en-NG"
  )}`;
}

export default SafeStaysPage;