"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  MessageSquare,
  Star,
  TrendingUp,
  User,
  CalendarDays,
  MapPin,
  House,
} from "lucide-react";

import API from "@/axios/index";

const OwnerReviewsPage = () => {
  const [selectedProperty, setSelectedProperty] =
    useState("all");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ownerReviews"],
    queryFn: async () => {
      const response = await API.get("/reviews/owner");

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const stats = data?.stats || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
    totalProperties: 0,
  };

  const properties = data?.properties || [];
  const reviews = data?.reviews || [];

  const filteredReviews = useMemo(() => {
    if (selectedProperty === "all") {
      return reviews;
    }

    return reviews.filter((review) => {
      const accommodation =
        review?.accommodation;

      const accommodationId =
        typeof accommodation === "object"
          ? accommodation?._id
          : accommodation;

      return accommodationId === selectedProperty;
    });
  }, [reviews, selectedProperty]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateRange = (booking) => {
    if (!booking) return null;

    const checkIn = booking.checkInDate
      ? formatDate(booking.checkInDate)
      : null;

    const checkOut = booking.checkOutDate
      ? formatDate(booking.checkOutDate)
      : null;

    if (!checkIn && !checkOut) {
      return null;
    }

    return `${checkIn || "—"} – ${
      checkOut || "—"
    }`;
  };

  const getInitials = (user) => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";

    const initials =
      `${firstName.charAt(0)}${lastName.charAt(
        0
      )}`.trim();

    return initials.toUpperCase() || "G";
  };

  const getUserName = (user) => {
    if (!user) {
      return "Guest";
    }

    return (
      `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim() || "Guest"
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-[#F3C95D] text-[#F3C95D]"
                : "text-[#D7DAD7]"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F7F6F0]">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-5">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DDE8E3] border-t-[#397A69]" />

            <p className="mt-5 text-sm font-medium text-[#75817D]">
              Loading reviews...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#F7F6F0]">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-5">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E1F5ED]">
              <MessageSquare className="h-8 w-8 text-[#397A69]" />
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-[#172322]">
              Unable to load reviews
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#75817D]">
              {error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while retrieving your reviews."}
            </p>

            <Link
              href="/owner"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#173C37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#23584E]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#172322]">
      {/* HEADER */}

      <section className="border-b border-[#E4E3DC] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <Link
            href="/owner"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#397A69] transition hover:text-[#173C37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="mt-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E1F5ED]">
                  <MessageSquare className="h-6 w-6 text-[#277765]" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
                    Guest feedback
                  </p>

                  <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Reviews
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#75817D]">
                See what your guests are saying about
                their stays and monitor the reputation of
                your properties.
              </p>
            </div>

            <Link
              href="/owner/accommodations"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8DAD4] bg-white px-5 py-3 text-sm font-semibold text-[#173C37] transition hover:bg-[#F1F5F2]"
            >
              <Building2 className="h-4 w-4" />
              My properties
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* STAT CARDS */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* TOTAL REVIEWS */}

          <div className="rounded-[24px] border border-[#E1E0D9] bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#75817D]">
                  Total reviews
                </p>

                <p className="mt-3 text-3xl font-bold text-[#173C37]">
                  {stats.totalReviews}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E1F5ED]">
                <MessageSquare className="h-5 w-5 text-[#277765]" />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#8A9390]">
              Reviews from guests across all your
              properties
            </p>
          </div>

          {/* AVERAGE */}

          <div className="rounded-[24px] border border-[#E1E0D9] bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#75817D]">
                  Average rating
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <p className="text-3xl font-bold text-[#173C37]">
                    {stats.averageRating > 0
                      ? stats.averageRating.toFixed(1)
                      : "—"}
                  </p>

                  <Star className="h-6 w-6 fill-[#F3C95D] text-[#F3C95D]" />
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF5D8]">
                <TrendingUp className="h-5 w-5 text-[#B18A20]" />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#8A9390]">
              Based on all guest ratings
            </p>
          </div>

          {/* PROPERTIES */}

          <div className="rounded-[24px] border border-[#E1E0D9] bg-white p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#75817D]">
                  Properties reviewed
                </p>

                <p className="mt-3 text-3xl font-bold text-[#173C37]">
                  {stats.totalProperties}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E1F5ED]">
                <Building2 className="h-5 w-5 text-[#277765]" />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#8A9390]">
              Properties currently associated with your
              account
            </p>
          </div>
        </section>

        {/* RATING OVERVIEW */}

        <section className="mt-6 rounded-[28px] border border-[#E1E0D9] bg-white p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* SCORE */}

            <div className="flex flex-col justify-center border-b border-[#ECEBE5] pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
              <p className="text-sm font-medium text-[#75817D]">
                Overall guest rating
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-5xl font-bold tracking-tight text-[#173C37]">
                  {stats.averageRating > 0
                    ? stats.averageRating.toFixed(1)
                    : "—"}
                </span>

                <div>
                  {renderStars(
                    Math.round(
                      stats.averageRating || 0
                    )
                  )}

                  <p className="mt-2 text-xs text-[#8A9390]">
                    {stats.totalReviews}{" "}
                    {stats.totalReviews === 1
                      ? "review"
                      : "reviews"}
                  </p>
                </div>
              </div>
            </div>

            {/* DISTRIBUTION */}

            <div>
              <h2 className="text-lg font-semibold">
                Rating breakdown
              </h2>

              <div className="mt-6 space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count =
                    stats.ratingDistribution?.[
                      rating
                    ] || 0;

                  const percentage =
                    stats.totalReviews > 0
                      ? (count /
                          stats.totalReviews) *
                        100
                      : 0;

                  return (
                    <div
                      key={rating}
                      className="flex items-center gap-3"
                    >
                      <div className="flex w-8 shrink-0 items-center gap-1">
                        <span className="text-sm font-medium">
                          {rating}
                        </span>

                        <Star className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]" />
                      </div>

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#ECEEEA]">
                        <div
                          className="h-full rounded-full bg-[#397A69] transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <span className="w-8 text-right text-xs font-medium text-[#75817D]">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FILTER */}

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold">
                Guest reviews
              </h2>

              <p className="mt-1 text-sm text-[#75817D]">
                {filteredReviews.length}{" "}
                {filteredReviews.length === 1
                  ? "review"
                  : "reviews"}{" "}
                displayed
              </p>
            </div>

            {properties.length > 0 && (
              <div className="relative">
                <select
                  value={selectedProperty}
                  onChange={(event) =>
                    setSelectedProperty(
                      event.target.value
                    )
                  }
                  className="appearance-none rounded-xl border border-[#D8DAD4] bg-white py-3 pl-4 pr-11 text-sm font-semibold text-[#173C37] outline-none transition focus:border-[#397A69]"
                >
                  <option value="all">
                    All properties
                  </option>

                  {properties.map((property) => (
                    <option
                      key={property._id}
                      value={property._id}
                    >
                      {property.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75817D]" />
              </div>
            )}
          </div>
        </section>

        {/* REVIEWS */}

        <section className="mt-6">
          {filteredReviews.length > 0 ? (
            <div className="space-y-5">
              {filteredReviews.map((review) => {
                const guest = review.user;
                const accommodation =
                  review.accommodation;
                const booking = review.booking;

                const guestName =
                  getUserName(guest);

                const initials =
                  getInitials(guest);

                const bookingDates =
                  formatDateRange(booking);

                return (
                  <article
                    key={review._id}
                    className="rounded-[28px] border border-[#E1E0D9] bg-white p-6 sm:p-7"
                  >
                    {/* REVIEW HEADER */}

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-4">
                        {/* PROFILE IMAGE */}

                        {guest?.profileImage ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                            <Image
                              src={
                                guest.profileImage
                              }
                              alt={guestName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#173C37] text-sm font-bold text-[#63E6BE]">
                            {initials}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-[#173C37]">
                            {guestName}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#8A9390]">
                            <span>
                              Guest review
                            </span>

                            <span>•</span>

                            <span>
                              {formatDate(
                                review.createdAt
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        {renderStars(
                          review.rating
                        )}

                        <span className="text-xs font-semibold text-[#397A69]">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* PROPERTY */}

                    {accommodation && (
                      <div className="mt-6 rounded-2xl bg-[#F5F8F6] p-4">
                        <div className="flex items-center gap-4">
                          {accommodation?.images?.[0] ? (
                            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
                              <Image
                                src={
                                  accommodation
                                    .images[0]
                                }
                                alt={
                                  accommodation.name
                                }
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-[#E1E8E4]">
                              <House className="h-6 w-6 text-[#397A69]" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#397A69]">
                              Property
                            </p>

                            <p className="mt-1 truncate font-semibold text-[#173C37]">
                              {accommodation.name}
                            </p>

                            {accommodation
                              ?.location && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-[#75817D]">
                                <MapPin className="h-3 w-3" />

                                {[
                                  accommodation
                                    .location
                                    ?.city,
                                  accommodation
                                    .location
                                    ?.state,
                                ]
                                  .filter(Boolean)
                                  .join(
                                    ", "
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* COMMENT */}

                    <div className="mt-6">
                      <p className="text-[15px] leading-8 text-[#596661]">
                        “{review.comment}”
                      </p>
                    </div>

                    {/* BOOKING */}

                    {bookingDates && (
                      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#ECEBE5] pt-5 text-xs text-[#75817D]">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-[#397A69]" />

                          <span>
                            Stay:{" "}
                            <strong className="font-semibold text-[#596661]">
                              {bookingDates}
                            </strong>
                          </span>
                        </div>

                        {booking?.bookingReference && (
                          <div className="flex items-center gap-2">
                            <span>
                              Booking:
                            </span>

                            <strong className="font-semibold text-[#596661]">
                              {
                                booking.bookingReference
                              }
                            </strong>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[28px] border border-[#E1E0D9] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E1F5ED]">
                <MessageSquare className="h-8 w-8 text-[#397A69]" />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                No reviews yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#75817D]">
                Once guests complete their stays
                and leave reviews, their feedback
                will appear here.
              </p>

              {selectedProperty !== "all" && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedProperty("all")
                  }
                  className="mt-6 text-sm font-semibold text-[#397A69] hover:text-[#173C37]"
                >
                  View reviews from all properties
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default OwnerReviewsPage;