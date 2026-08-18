"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BookStayModal from "./BookStayModal";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  House,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
  Sparkles,
  LockKeyhole,
  Phone,
} from "lucide-react";

const AccommodationDetailPage = ({ slug }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api";

  const fetchAccommodation = async () => {
    if (!slug) {
      throw new Error("Accommodation identifier is missing");
    }

    const response = await fetch(
      `${API_URL}/accommodations/${encodeURIComponent(slug)}`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok || !data?.success) {
      throw new Error(
        data?.message || "Unable to retrieve accommodation"
      );
    }

    return data.accommodation;
  };

  const {
    data: accommodation,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["accommodation", slug],
    queryFn: fetchAccommodation,
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });

  const nextImage = () => {
    if (!accommodation?.images?.length) return;

    setActiveImage((current) =>
      current >= accommodation.images.length - 1
        ? 0
        : current + 1
    );
  };

  const previousImage = () => {
    if (!accommodation?.images?.length) return;

    setActiveImage((current) =>
      current <= 0
        ? accommodation.images.length - 1
        : current - 1
    );
  };

  const getAmenityIcon = (title) => {
    const name = title?.toLowerCase() || "";

    if (name.includes("wifi") || name.includes("internet")) {
      return Wifi;
    }

    if (name.includes("parking") || name.includes("car")) {
      return Car;
    }

    if (
      name.includes("restaurant") ||
      name.includes("kitchen") ||
      name.includes("dining") ||
      name.includes("food")
    ) {
      return Utensils;
    }

    if (
      name.includes("fitness") ||
      name.includes("gym")
    ) {
      return Dumbbell;
    }

    if (
      name.includes("pool") ||
      name.includes("swimming")
    ) {
      return Waves;
    }

    return Sparkles;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F7F6F0]">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DDE8E3] border-t-[#397A69]" />

            <p className="mt-5 text-sm font-medium text-[#75817D]">
              Loading accommodation...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !accommodation) {
    return (
      <main className="min-h-screen bg-[#F7F6F0]">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5">
          <div className="text-center">
            <House className="mx-auto h-12 w-12 text-[#397A69]" />

            <h1 className="mt-5 text-3xl font-semibold text-[#172322]">
              Accommodation not found
            </h1>

            <p className="mt-3 text-[#75817D]">
              {error?.message ||
                "Unable to retrieve accommodation"}
            </p>

            <Link
              href="/accommodations"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#173C37] px-5 py-3 text-sm font-semibold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to accommodations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Everything below this point runs only after
   * accommodation has been successfully loaded.
   */

  const images = Array.isArray(accommodation.images)
    ? accommodation.images
    : [];

  const amenities = Array.isArray(accommodation.amenities)
    ? accommodation.amenities
    : [];

  const reviewsList = Array.isArray(accommodation.reviewsList)
    ? accommodation.reviewsList
    : [];

  const rules = Array.isArray(accommodation.rules)
    ? accommodation.rules
    : [];

  const location =
    accommodation.location &&
    typeof accommodation.location === "object"
      ? accommodation.location
      : {};

  const locationText = [
    location.city,
    location.lga,
    location.state,
  ]
    .filter(Boolean)
    .join(", ");

  const fullLocationText = [
    location.address,
    location.city,
    location.lga,
    location.state,
  ]
    .filter(Boolean)
    .join(", ");

  const rating =
    accommodation.averageRating ||
    accommodation.rating ||
    0;

  const reviewCount =
    accommodation.reviewCount ||
    accommodation.reviews ||
    0;

  const price = accommodation.pricePerNight;

  const propertyType =
    accommodation.type || "Accommodation";

  const maxGuests =
    accommodation.maxGuests || 1;

  const bedrooms =
    accommodation.bedrooms || 0;

  const bathrooms =
    accommodation.bathrooms || 0;

  const handleBookSubmit = () => {
    setBookModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#172322]">

      {/* NAV */}
      <div className="border-b border-[#E4E3DC] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          <Link
            href="/accommodations"
            className="flex items-center gap-2 text-sm font-semibold text-[#397A69] transition hover:text-[#173C37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to accommodations
          </Link>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-[#E2E1DA] bg-white px-4 py-2 text-sm font-medium transition hover:bg-[#F7F6F0]"
          >
            <Heart className="h-4 w-4" />
            Save
          </button>

        </div>
      </div>

      {/* GALLERY */}
      <section className="mx-auto max-w-7xl px-5 pt-6 lg:px-8">

        <div className="relative grid h-[420px] gap-2 overflow-hidden rounded-[28px] lg:h-[540px] lg:grid-cols-2">

          {/* MAIN IMAGE */}
          <button
            type="button"
            onClick={() => {
              setActiveImage(0);
              setShowGallery(true);
            }}
            className="relative overflow-hidden lg:rounded-l-[28px]"
          >
            {images[0] ? (
              <Image
                src={images[0]}
                alt={accommodation.name}
                fill
                priority
                className="object-cover transition duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#E1E8E4]">
                <House className="h-12 w-12 text-[#397A69]" />
              </div>
            )}
          </button>

          {/* SMALL IMAGES */}
          <div className="hidden grid-cols-2 gap-2 lg:grid">

            {images.slice(1, 5).map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => {
                  setActiveImage(index + 1);
                  setShowGallery(true);
                }}
                className="relative overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${accommodation.name} ${index + 2}`}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />

                {index === 3 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#173C37]">
                      View all photos
                    </span>
                  </div>
                )}
              </button>
            ))}

          </div>

          {/* MOBILE */}
          <button
            type="button"
            onClick={() => {
              setActiveImage(0);
              setShowGallery(true);
            }}
            className="absolute bottom-4 right-4 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#173C37] shadow-lg lg:hidden"
          >
            View all photos
          </button>

        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* LEFT */}
          <div>

            {/* TITLE */}
            <div className="border-b border-[#E1E0D9] pb-8">

              <div className="flex flex-wrap items-center gap-3">

                <span className="rounded-full bg-[#E1F5ED] px-3 py-1.5 text-xs font-bold text-[#277765]">
                  {propertyType}
                </span>

                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#173C37]">

                  <Star className="h-4 w-4 fill-[#F3C95D] text-[#F3C95D]" />

                  {rating > 0 ? rating.toFixed(1) : "New"}

                </div>

                <span className="text-sm text-[#7A8581]">
                  {reviewCount} reviews
                </span>

              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {accommodation.name}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-sm text-[#75817D]">

                <MapPin className="h-4 w-4 text-[#397A69]" />

                {locationText || "Location unavailable"}

              </div>

            </div>

            {/* QUICK INFO */}
            <div className="grid grid-cols-2 gap-4 border-b border-[#E1E0D9] py-8 sm:grid-cols-4">

              <div>
                <Users className="h-5 w-5 text-[#397A69]" />

                <p className="mt-3 text-sm font-semibold">
                  {maxGuests} guests
                </p>

                <p className="mt-1 text-xs text-[#7A8581]">
                  Capacity
                </p>
              </div>

              <div>
                <House className="h-5 w-5 text-[#397A69]" />

                <p className="mt-3 text-sm font-semibold">
                  {bedrooms} bedrooms
                </p>

                <p className="mt-1 text-xs text-[#7A8581]">
                  Bedrooms
                </p>
              </div>

              <div>
                <div className="flex h-5 items-center text-lg">
                  🛏
                </div>

                <p className="mt-3 text-sm font-semibold">
                  {accommodation.beds || "Available"}
                </p>

                <p className="mt-1 text-xs text-[#7A8581]">
                  Sleeping
                </p>
              </div>

              <div>
                <div className="flex h-5 items-center text-lg">
                  🚿
                </div>

                <p className="mt-3 text-sm font-semibold">
                  {bathrooms} bathrooms
                </p>

                <p className="mt-1 text-xs text-[#7A8581]">
                  Bathrooms
                </p>
              </div>

            </div>

            {/* ABOUT */}
            <section className="border-b border-[#E1E0D9] py-10">

              <h2 className="text-2xl font-semibold">
                About this stay
              </h2>

              <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#596661]">
                {accommodation.description}
              </p>

            </section>

            {/* AMENITIES */}
            <section className="border-b border-[#E1E0D9] py-10">

              <h2 className="text-2xl font-semibold">
                What this place offers
              </h2>

              {amenities.length > 0 ? (
                <div className="mt-7 grid gap-6 sm:grid-cols-2">

                  {amenities.map((amenity, index) => {

                    const title =
                      typeof amenity === "string"
                        ? amenity
                        : amenity?.title ||
                          amenity?.name ||
                          "";

                    const description =
                      typeof amenity === "string"
                        ? ""
                        : amenity?.description || "";

                    const Icon = getAmenityIcon(title);

                    return (
                      <div
                        key={`${title}-${index}`}
                        className="flex gap-4"
                      >

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E1F5ED] text-[#277765]">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>

                          <h3 className="text-sm font-semibold">
                            {title}
                          </h3>

                          {description && (
                            <p className="mt-1 text-sm leading-6 text-[#7A8581]">
                              {description}
                            </p>
                          )}

                        </div>

                      </div>
                    );
                  })}

                </div>
              ) : (
                <p className="mt-6 text-sm text-[#7A8581]">
                  No amenities have been listed for this property.
                </p>
              )}

            </section>

            {/* SAFETY */}
            <section className="border-b border-[#E1E0D9] py-10">

              <div className="rounded-[28px] bg-[#173C37] p-7 text-white sm:p-8">

                <div className="flex flex-col gap-6 sm:flex-row">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#63E6BE]/15">
                    <ShieldCheck className="h-7 w-7 text-[#63E6BE]" />
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63E6BE]">
                      TripGuard protection
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold">
                      Stay comfortable. Stay connected.
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-white/65">
                      When you check in, you can choose someone you trust
                      to receive your stay information. When you check out,
                      they'll know you're safely on your way.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/75">

                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#63E6BE]" />
                        Trusted contact notifications
                      </div>

                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#63E6BE]" />
                        Check-in confirmation
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* REVIEWS */}
            <section className="border-b border-[#E1E0D9] py-10">

              <div className="flex items-center gap-2">

                <Star className="h-5 w-5 fill-[#F3C95D] text-[#F3C95D]" />

                <span className="text-xl font-bold">
                  {rating > 0 ? rating.toFixed(1) : "New"}
                </span>

                <span className="text-sm text-[#7A8581]">
                  · {reviewCount} reviews
                </span>

              </div>

              <h2 className="mt-3 text-2xl font-semibold">
                What guests are saying
              </h2>

              {reviewsList.length > 0 ? (
                <div className="mt-8 space-y-6">

                  {reviewsList.map((review, index) => (
                    <article
                      key={`${review.name || "review"}-${index}`}
                      className="rounded-2xl border border-[#E5E4DD] bg-white p-6"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173C37] text-sm font-semibold text-[#63E6BE]">
                            {review.initials ||
                              review.name
                                ?.split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)}
                          </div>

                          <div>

                            <p className="font-semibold">
                              {review.name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#7A8581]">
                              {review.location || ""}
                            </p>

                          </div>

                        </div>

                        <span className="text-xs text-[#8A9390]">
                          {review.date}
                        </span>

                      </div>

                      <div className="mt-4 flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]"
                          />
                        ))}
                      </div>

                      <p className="mt-4 text-sm leading-7 text-[#596661]">
                        “{review.text}”
                      </p>

                    </article>
                  ))}

                </div>
              ) : (
                <p className="mt-6 text-sm text-[#7A8581]">
                  No reviews yet.
                </p>
              )}

            </section>

            {/* LOCATION */}
            <section className="border-b border-[#E1E0D9] py-10">

              <h2 className="text-2xl font-semibold">
                Where you'll be
              </h2>

              <div className="mt-6 overflow-hidden rounded-[24px] border border-[#E2E1DA] bg-white">

                <div className="flex h-[280px] items-center justify-center bg-[#E1E8E4]">

                  <div className="text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#173C37] text-white shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>

                    <p className="mt-4 font-semibold">
                      {locationText || "Location unavailable"}
                    </p>

                    <p className="mt-1 text-sm text-[#75817D]">
                      Exact address provided after booking
                    </p>

                  </div>

                </div>

                <div className="p-5">

                  <p className="text-sm leading-6 text-[#596661]">
                    Located in{" "}
                    {locationText || "a convenient location"}
                    , with convenient access to restaurants,
                    shops, entertainment and major roads.
                  </p>

                </div>

              </div>

            </section>

            {/* RULES */}
            <section className="py-10">

              <h2 className="text-2xl font-semibold">
                House rules & policies
              </h2>

              {rules.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  {rules.map((rule, index) => (
                    <div
                      key={`${rule}-${index}`}
                      className="flex items-center gap-3 text-sm text-[#596661]"
                    >

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E1F5ED]">
                        <Check className="h-3.5 w-3.5 text-[#277765]" />
                      </div>

                      {rule}

                    </div>
                  ))}

                </div>
              ) : (
                <p className="mt-6 text-sm text-[#7A8581]">
                  No additional house rules have been provided.
                </p>
              )}

            </section>

          </div>

          {/* BOOKING CARD */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">

            <div className="rounded-[28px] border border-[#E1E0D9] bg-white p-6 shadow-xl sm:p-7">

              <div className="flex items-end justify-between">

                <div>

                  <span className="text-2xl font-bold text-[#173C37]">
                    ₦{Number(price || 0).toLocaleString()}
                  </span>

                  <span className="text-sm text-[#7A8581]">
                    {" "}
                    / night
                  </span>

                </div>

                <div className="flex items-center gap-1 text-sm font-semibold">

                  <Star className="h-4 w-4 fill-[#F3C95D] text-[#F3C95D]" />

                  {rating > 0 ? rating.toFixed(1) : "New"}

                </div>

              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-[#DCDDD6]">

                <div className="grid grid-cols-2">

                  <div className="border-r border-[#DCDDD6] p-4">

                    <div className="flex items-center gap-2">

                      <CalendarDays className="h-4 w-4 text-[#397A69]" />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                        Check in
                      </span>

                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      Add date
                    </p>

                  </div>

                  <div className="p-4">

                    <div className="flex items-center gap-2">

                      <CalendarDays className="h-4 w-4 text-[#397A69]" />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                        Check out
                      </span>

                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      Add date
                    </p>

                  </div>

                </div>

                <div className="border-t border-[#DCDDD6] p-4">

                  <div className="flex items-center gap-2">

                    <Users className="h-4 w-4 text-[#397A69]" />

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                      Guests
                    </span>

                  </div>

                  <p className="mt-2 text-sm font-semibold">
                    {maxGuests} guests maximum
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => setBookModalOpen(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-4 font-semibold text-white transition hover:bg-[#23584E]"
              >

                <ShieldCheck className="h-5 w-5 text-[#63E6BE]" />

                Book

              </button>

              <p className="mt-3 text-center text-xs text-[#8A9390]">
                You won't be charged yet
              </p>

              <div className="mt-6 rounded-2xl bg-[#F0F7F4] p-4">

                <div className="flex gap-3">

                  <LockKeyhole className="h-5 w-5 shrink-0 text-[#397A69]" />

                  <div>

                    <p className="text-sm font-semibold text-[#173C37]">
                      Your safety comes first
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#6E7B76]">
                      TripGuard can notify your trusted contact when you
                      check in and check out.
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-6 border-t border-[#ECEBE5] pt-6">

                <p className="text-xs font-bold uppercase tracking-wider text-[#7A8581]">
                  Need help?
                </p>

                <div className="mt-3 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E1F5ED]">
                    <Phone className="h-4 w-4 text-[#277765]" />
                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      TripGuard support
                    </p>

                    <p className="mt-0.5 text-xs text-[#7A8581]">
                      Available to help with your stay
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

      {/* GALLERY MODAL */}
      {showGallery && images.length > 0 && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07110F]/95 p-5">

          <button
            type="button"
            onClick={() => setShowGallery(false)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close gallery"
          >
            ✕
          </button>

          <div className="relative h-[75vh] w-full max-w-6xl">

            <Image
              src={images[activeImage]}
              alt={accommodation.name}
              fill
              className="object-contain"
            />

            {images.length > 1 && (
              <>

                <button
                  type="button"
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#173C37] shadow-xl"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#173C37] shadow-xl"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

              </>
            )}

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
              {activeImage + 1} / {images.length}
            </div>

          </div>

        </div>

      )}

      {/* BOOKING MODAL */}
      <BookStayModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSubmit={handleBookSubmit}
      />

    </main>
  );
};

export default AccommodationDetailPage;