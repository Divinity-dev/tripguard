"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import API from "@/axios/index";
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
  MessageCircle,
} from "lucide-react";

const AccommodationDetailPage = ({ slug }) => {
  const queryClient = useQueryClient();

  const [activeImage, setActiveImage] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
const [reviewComment, setReviewComment] = useState("");
const [reviewError, setReviewError] = useState("");
const [reviewSuccess, setReviewSuccess] = useState("");
const [hoveredRating, setHoveredRating] = useState(0);

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
  data: savedData,
  isLoading: savedLoading,
} = useQuery({
  queryKey: ["savedAccommodations"],
  queryFn: async () => {
    try {
      const response = await API.get("/saved");

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          savedAccommodations: [],
        };
      }

      throw error;
    }
  },
  retry: false,
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

  const {
  data: accommodation,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["accommodation", slug],
  queryFn: fetchAccommodation,
  enabled: !!slug,
});

const {
  data: reviewsData,
  isLoading: reviewsLoading,
} = useQuery({
  queryKey: ["accommodationReviews", accommodation?._id],
  queryFn: async () => {
    const response = await API.get(
      `/reviews/accommodation/${accommodation._id}`
    );

    return response.data;
  },
  enabled: !!accommodation?._id,
});

const isSaved =
  savedData?.savedAccommodations?.some((savedItem) => {
    const savedAccommodation =
      savedItem?.accommodation;

    const savedAccommodationId =
      typeof savedAccommodation === "object"
        ? savedAccommodation?._id
        : savedAccommodation;

    return (
      savedAccommodationId === accommodation?._id
    );
  }) || false;

  const saveMutation = useMutation({
  mutationFn: async () => {
    const response = await API.post(
      `/saved/${accommodation._id}`
    );

    return response.data;
  },

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["savedAccommodations"],
    });
  },
});

const removeMutation = useMutation({
  mutationFn: async () => {
    const response = await API.delete(
      `/saved/${accommodation._id}`
    );

    return response.data;
  },

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["savedAccommodations"],
    });
  },
});

const reviewMutation = useMutation({
  mutationFn: async () => {
    const response = await API.post("/reviews", {
      accommodation: accommodation._id,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    return response.data;
  },

  onSuccess: () => {
    setReviewSuccess("Your review has been submitted successfully.");
    setReviewError("");
    setReviewRating(0);
    setReviewComment("");

    queryClient.invalidateQueries({
      queryKey: ["accommodationReviews", accommodation._id],
    });

    queryClient.invalidateQueries({
      queryKey: ["accommodation", slug],
    });
  },

  onError: (error) => {
    setReviewSuccess("");

    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 403) {
      setReviewError(
        "You can only review this accommodation after completing a stay."
      );
      return;
    }

    if (status === 409) {
      setReviewError(
        "You have already reviewed this accommodation."
      );
      return;
    }

    setReviewError(
      message || "Unable to submit your review. Please try again."
    );
  },
});

const handleReviewSubmit = (event) => {
  event.preventDefault();

  setReviewError("");
  setReviewSuccess("");

  if (!reviewRating) {
    setReviewError("Please select a rating.");
    return;
  }

  if (!reviewComment.trim()) {
    setReviewError("Please write a comment.");
    return;
  }

  if (reviewComment.trim().length < 5) {
    setReviewError(
      "Your review should contain at least 5 characters."
    );
    return;
  }

  reviewMutation.mutate();
};

const toggleSaved = async () => {
  if (!accommodation?._id) {
    return;
  }

  try {
    setSaving(true);

    if (isSaved) {
      await removeMutation.mutateAsync();
    } else {
      await saveMutation.mutateAsync();
    }
  } finally {
    setSaving(false);
  }
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

  const reviewsList = Array.isArray(reviewsData?.reviews)
  ? reviewsData.reviews
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
  reviewsData?.averageRating ??
  accommodation.averageRating ??
  accommodation.rating ??
  0;

const reviewCount =
  reviewsData?.count ??
  accommodation.totalReviews ??
  accommodation.reviewCount ??
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
  onClick={toggleSaved}
  disabled={saving}
  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#173C37] bg-white shadow-md transition hover:bg-[#E1F5ED] disabled:cursor-not-allowed disabled:opacity-60"
  aria-label={isSaved ? "Remove from saved" : "Save accommodation"}
  title={isSaved ? "Remove from saved" : "Save accommodation"}
>
  <Heart
    className={`h-6 w-6 ${
      isSaved
        ? "fill-[#397A69] text-[#397A69]"
        : "text-[#173C37]"
    }`}
  />
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
            {/* REVIEWS */}
<section className="border-b border-[#E1E0D9] py-10">

  {/* HEADER */}
  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

    <div>

      <div className="flex items-center gap-2">

        <Star className="h-5 w-5 fill-[#F3C95D] text-[#F3C95D]" />

        <span className="text-xl font-bold">
          {rating > 0 ? Number(rating).toFixed(1) : "New"}
        </span>

        <span className="text-sm text-[#7A8581]">
          · {reviewCount}{" "}
          {reviewCount === 1 ? "review" : "reviews"}
        </span>

      </div>

      <h2 className="mt-3 text-2xl font-semibold">
        What guests are saying
      </h2>

    </div>

    {reviewCount > 0 && (
      <div className="flex items-center gap-2 rounded-xl bg-[#E1F5ED] px-4 py-3">

        <ShieldCheck className="h-4 w-4 text-[#277765]" />

        <span className="text-xs font-semibold text-[#277765]">
          Verified guest reviews
        </span>

      </div>
    )}

  </div>

  {/* RATING SUMMARY */}
  {reviewCount > 0 && reviewsList.length > 0 && (

    <div className="mt-8 rounded-[24px] border border-[#E5E4DD] bg-white p-6">

      <div className="grid gap-8 sm:grid-cols-[150px_1fr]">

        {/* OVERALL */}
        <div className="flex flex-col items-center justify-center border-b border-[#ECEBE5] pb-6 sm:border-b-0 sm:border-r sm:pb-0">

          <p className="text-5xl font-bold text-[#173C37]">
            {Number(rating).toFixed(1)}
          </p>

          <div className="mt-3 flex gap-1">

            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(rating)
                    ? "fill-[#F3C95D] text-[#F3C95D]"
                    : "text-[#D9DDD9]"
                }`}
              />
            ))}

          </div>

          <p className="mt-2 text-xs text-[#7A8581]">
            Based on {reviewCount}{" "}
            {reviewCount === 1 ? "review" : "reviews"}
          </p>

        </div>

        {/* BREAKDOWN */}
        <div className="space-y-3">

          {[5, 4, 3, 2, 1].map((star) => {

            const count = reviewsList.filter(
              (review) => Number(review.rating) === star
            ).length;

            const percentage =
              reviewCount > 0
                ? (count / reviewCount) * 100
                : 0;

            return (
              <div
                key={star}
                className="flex items-center gap-3"
              >

                <div className="flex w-10 items-center gap-1">

                  <span className="text-xs font-semibold text-[#596661]">
                    {star}
                  </span>

                  <Star className="h-3 w-3 fill-[#F3C95D] text-[#F3C95D]" />

                </div>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E8EBE8]">

                  <div
                    className="h-full rounded-full bg-[#397A69] transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

                <span className="w-8 text-right text-xs text-[#7A8581]">
                  {count}
                </span>

              </div>
            );
          })}

        </div>

      </div>

    </div>

  )}

  {/* REVIEW FORM */}
  <div className="mt-8 rounded-[24px] border border-[#DDE8E3] bg-[#F0F7F4] p-6 sm:p-7">

    <div className="flex gap-4">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#173C37]">
        <MessageCircle className="h-5 w-5 text-[#63E6BE]" />
      </div>

      <div>

        <h3 className="text-lg font-semibold text-[#173C37]">
          Share your experience
        </h3>

        <p className="mt-1 text-sm text-[#6E7B76]">
          Stayed here? Tell other travellers what you thought.
        </p>

      </div>

    </div>

    <form
      onSubmit={handleReviewSubmit}
      className="mt-6"
    >

      {/* RATING */}
      <div>

        <label className="text-sm font-semibold text-[#173C37]">
          Your rating
        </label>

        <div className="mt-3 flex items-center gap-2">

          {[1, 2, 3, 4, 5].map((star) => {

            const active =
              star <= (hoveredRating || reviewRating);

            return (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="rounded-lg p-1 transition hover:bg-white"
                aria-label={`Rate ${star} out of 5`}
              >

                <Star
                  className={`h-7 w-7 transition ${
                    active
                      ? "fill-[#F3C95D] text-[#F3C95D]"
                      : "text-[#B9C2BE]"
                  }`}
                />

              </button>
            );
          })}

          {reviewRating > 0 && (
            <span className="ml-2 text-sm font-semibold text-[#397A69]">
              {reviewRating}/5
            </span>
          )}

        </div>

      </div>

      {/* COMMENT */}
      <div className="mt-6">

        <label
          htmlFor="review-comment"
          className="text-sm font-semibold text-[#173C37]"
        >
          Your review
        </label>

        <textarea
          id="review-comment"
          value={reviewComment}
          onChange={(event) => {
            setReviewComment(event.target.value);
            setReviewError("");
            setReviewSuccess("");
          }}
          maxLength={1000}
          rows={5}
          placeholder="Tell us about your stay..."
          className="mt-3 w-full resize-none rounded-2xl border border-[#D8E0DC] bg-white px-4 py-3 text-sm text-[#172322] outline-none transition placeholder:text-[#9AA39F] focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
        />

        <div className="mt-2 flex justify-end">

          <span className="text-xs text-[#8A9390]">
            {reviewComment.length}/1000
          </span>

        </div>

      </div>

      {/* ERROR */}
      {reviewError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {reviewError}
        </div>
      )}

      {/* SUCCESS */}
      {reviewSuccess && (
        <div className="mt-4 rounded-xl border border-[#BFE6D5] bg-[#E8F8F1] px-4 py-3 text-sm font-medium text-[#277765]">
          {reviewSuccess}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={reviewMutation.isPending}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#173C37] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#23584E] disabled:cursor-not-allowed disabled:opacity-60"
      >

        {reviewMutation.isPending ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Submitting...
          </>
        ) : (
          <>
            <Star className="h-4 w-4 text-[#63E6BE]" />
            Submit review
          </>
        )}

      </button>

      <p className="mt-3 text-xs leading-5 text-[#7A8581]">
        Only guests who have completed a stay can submit a review.
      </p>

    </form>

  </div>

  {/* REVIEWS LIST */}
  <div className="mt-8">

    {reviewsLoading ? (

      <div className="flex items-center justify-center py-12">

        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DDE8E3] border-t-[#397A69]" />

      </div>

    ) : reviewsList.length > 0 ? (

      <div className="space-y-5">

        {reviewsList.map((review) => {

          const firstName =
            review.user?.firstName || "";

          const lastName =
            review.user?.lastName || "";

          const fullName =
            `${firstName} ${lastName}`.trim() ||
            "TripGuard guest";

          const initials =
            `${firstName?.[0] || ""}${lastName?.[0] || ""}`
              .toUpperCase() || "G";

          const reviewDate = review.createdAt
            ? new Date(review.createdAt).toLocaleDateString(
                "en-NG",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )
            : "";

          return (
            <article
              key={review._id}
              className="rounded-2xl border border-[#E5E4DD] bg-white p-6"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                  {review.user?.profileImage ? (

                    <div className="relative h-11 w-11 overflow-hidden rounded-full">

                      <Image
                        src={review.user.profileImage}
                        alt={fullName}
                        fill
                        className="object-cover"
                      />

                    </div>

                  ) : (

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173C37] text-sm font-semibold text-[#63E6BE]">
                      {initials}
                    </div>

                  )}

                  <div>

                    <p className="font-semibold text-[#172322]">
                      {fullName}
                    </p>

                    <p className="mt-0.5 text-xs text-[#7A8581]">
                      Verified guest
                    </p>

                  </div>

                </div>

                <span className="text-xs text-[#8A9390]">
                  {reviewDate}
                </span>

              </div>

              {/* STARS */}
              <div className="mt-4 flex gap-1">

                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= Number(review.rating)
                        ? "fill-[#F3C95D] text-[#F3C95D]"
                        : "text-[#D9DDD9]"
                    }`}
                  />
                ))}

              </div>

              {/* COMMENT */}
              <p className="mt-4 text-sm leading-7 text-[#596661]">
                “{review.comment}”
              </p>

            </article>
          );
        })}

      </div>

    ) : (

      <div className="rounded-[24px] border border-dashed border-[#CDD8D3] bg-white p-10 text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E1F5ED]">
          <MessageCircle className="h-6 w-6 text-[#397A69]" />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-[#173C37]">
          No reviews yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A8581]">
          Be the first guest to share your experience after
          completing a stay at this accommodation.
        </p>

      </div>

    )}

  </div>

</section>

            {/* LOCATION */}
<section className="border-b border-[#E1E0D9] py-10">

  <h2 className="text-2xl font-semibold">
    Where you'll be
  </h2>

  <div className="mt-6 overflow-hidden rounded-[24px] border border-[#E2E1DA] bg-white">

    <div className="flex min-h-[280px] items-center justify-center bg-[#E1E8E4] px-6">

      <div className="text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#173C37] text-white shadow-lg">
          <MapPin className="h-6 w-6" />
        </div>

        <p className="mt-4 text-lg font-semibold text-[#173C37]">
          {fullLocationText || "Location unavailable"}
        </p>

        <p className="mt-2 text-sm text-[#75817D]">
          Exact location of this accommodation
        </p>

      </div>

    </div>

    <div className="p-5">

      <p className="text-sm leading-6 text-[#596661]">
        This accommodation is located at{" "}
        <span className="font-semibold text-[#172322]">
          {fullLocationText || "Location unavailable"}
        </span>
        .
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
  accommodation={accommodation}
/>

    </main>
  );
};

export default AccommodationDetailPage;