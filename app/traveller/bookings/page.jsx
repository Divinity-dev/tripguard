"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  Plane,
  LogIn,
  LogOut,
  ArrowRight,
  CreditCard,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TravellerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * --------------------------------------------------
   * FETCH BOOKINGS
   * --------------------------------------------------
   */

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured"
        );
      }

      const response = await fetch(
        `${apiUrl}/bookings/my-bookings`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log(
        "Traveller bookings response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to retrieve bookings"
        );
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error(
        "Fetch traveller bookings error:",
        error
      );

      setError(
        error.message ||
          "Unable to retrieve bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /*
   * --------------------------------------------------
   * NIGERIA DATE HELPER
   * --------------------------------------------------
   */

  const getNigeriaDateKey = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  const today = getNigeriaDateKey(new Date());

  /*
   * --------------------------------------------------
   * BOOKING GROUPS
   * --------------------------------------------------
   */

  const upcomingBookings = bookings.filter(
    (booking) =>
      ![
        "cancelled",
        "completed",
        "checked-out",
        "checked-in",
      ].includes(booking.bookingStatus) &&
      booking.checkOutDate &&
      getNigeriaDateKey(
        booking.checkOutDate
      ) >= today
  );

  const activeBookings = bookings.filter(
    (booking) =>
      booking.bookingStatus ===
      "checked-in"
  );

  const completedBookings = bookings.filter(
    (booking) =>
      booking.bookingStatus ===
        "completed" ||
      booking.bookingStatus ===
        "checked-out"
  );

  /*
   * --------------------------------------------------
   * SORT UPCOMING BOOKINGS
   * --------------------------------------------------
   *
   * All upcoming bookings are displayed.
   * The earliest check-in appears first.
   */

  const sortedUpcomingBookings =
    [...upcomingBookings].sort(
      (a, b) =>
        new Date(a.checkInDate) -
        new Date(b.checkInDate)
    );

  /*
   * --------------------------------------------------
   * SORT ACTIVE BOOKINGS
   * --------------------------------------------------
   */

  const sortedActiveBookings =
    [...activeBookings].sort(
      (a, b) =>
        new Date(a.checkOutDate) -
        new Date(b.checkOutDate)
    );

  /*
   * --------------------------------------------------
   * COUNTS
   * --------------------------------------------------
   */

  const upcomingCount =
    upcomingBookings.length;

  const activeCount =
    activeBookings.length;

  const completedCount =
    completedBookings.length;

  /*
   * --------------------------------------------------
   * LOADING STATE
   * --------------------------------------------------
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-[#16a765]">
              Traveller Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              My Bookings
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              View and manage all your TripGuard
              stays.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#16a765]/10">
              <CalendarDays
                size={22}
                className="text-[#16a765]"
              />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Loading your bookings...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * --------------------------------------------------
   * ERROR STATE
   * --------------------------------------------------
   */

  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-[#16a765]">
              Traveller Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              My Bookings
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              View and manage all your TripGuard
              stays.
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
              onClick={fetchBookings}
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium text-[#16a765]">
              Traveller Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              My Bookings
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              View and manage all your TripGuard
              stays.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<Clock3 size={20} />}
            title="Upcoming"
            value={upcomingCount}
            description="Your upcoming trips"
          />

          <SummaryCard
            icon={<Plane size={20} />}
            title="Active"
            value={activeCount}
            description="Currently staying"
          />

          <SummaryCard
            icon={<CheckCircle2 size={20} />}
            title="Completed"
            value={completedCount}
            description="Past trips"
          />
        </section>

        {/* ==========================================
            UPCOMING TRIPS
            ========================================== */}

        <section className="mt-10">
          <SectionHeading
            title="Upcoming Trips"
            description="All your upcoming TripGuard-protected stays."
          />

          {sortedUpcomingBookings.length === 0 ? (
            <EmptyState
              title="No upcoming trips"
              description="You don't have any upcoming bookings at the moment."
              buttonText="Find a stay"
              href="/accommodations"
            />
          ) : (
            <div className="mt-5 space-y-6">
              {sortedUpcomingBookings.map(
                (booking) => (
                  <UpcomingBookingCard
                    key={booking._id}
                    booking={booking}
                    onRefresh={fetchBookings}
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* ==========================================
            ACTIVE STAYS
            ========================================== */}

        <section className="mt-10">
          <SectionHeading
            title="Active Stay"
            description="Your current TripGuard-protected accommodation."
          />

          {sortedActiveBookings.length === 0 ? (
            <EmptyState
              title="No active stay"
              description="You are not currently checked into an accommodation."
            />
          ) : (
            <div className="mt-5 space-y-6">
              {sortedActiveBookings.map(
                (booking) => (
                  <ActiveBookingCard
                    key={booking._id}
                    booking={booking}
                    onRefresh={fetchBookings}
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* ==========================================
            COMPLETED TRIPS
            ========================================== */}

        <section className="mt-10">
          <SectionHeading
            title="Completed Trips"
            description="Your previous TripGuard stays."
          />

          {completedBookings.length === 0 ? (
            <EmptyState
              title="No completed trips"
              description="Your completed stays will appear here."
            />
          ) : (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {completedBookings.map(
                (booking) => (
                  <CompletedBookingCard
                    key={booking._id}
                    booking={booking}
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/*
 * ==================================================
 * UPCOMING BOOKING CARD
 * ==================================================
 */

function UpcomingBookingCard({
  booking,
  onRefresh,
}) {
  const [cancelling, setCancelling] =
    useState(false);

  const accommodation =
    booking.accommodation;

  const image =
    accommodation?.images?.[0] ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";

  const name =
    accommodation?.name ||
    "Accommodation";

  const location =
    accommodation?.location
      ? [
          accommodation.location.address,
          accommodation.location.city,
          accommodation.location.state,
        ]
          .filter(Boolean)
          .join(", ")
      : "Location unavailable";

  const rating =
    accommodation?.rating ||
    accommodation?.averageRating ||
    "—";

  /*
   * --------------------------------------------------
   * PENDING PAYMENT
   * --------------------------------------------------
   */

  const isPendingPayment =
    booking.bookingStatus ===
      "pending" &&
    booking.paymentStatus ===
      "pending";

  /*
   * --------------------------------------------------
   * CANCEL BOOKING
   * --------------------------------------------------
   */

  const handleCancelBooking =
    async () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this booking?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setCancelling(true);

        const apiUrl =
          process.env
            .NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured"
          );
        }

        const response =
          await fetch(
            `${apiUrl}/bookings/${booking._id}/cancel`,
            {
              method: "PUT",
              credentials: "include",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                reason:
                  "Cancelled by traveller",
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to cancel booking."
          );
        }

        await onRefresh();
      } catch (error) {
        console.error(
          "Cancel booking error:",
          error
        );

        alert(
          error.message ||
            "Unable to cancel booking."
        );
      } finally {
        setCancelling(false);
      }
    };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* Image */}
        <div className="relative h-56 lg:h-full lg:min-h-[280px]">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />

          <BookingStatusBadge
            status={
              booking.bookingStatus
            }
            paymentStatus={
              booking.paymentStatus
            }
          />
        </div>

        {/* Details */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-bold">
                {name}
              </h3>

              <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#16a765]"
                />

                <span>
                  {location}
                </span>
              </div>
            </div>

            {rating !== "—" && (
              <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700">
                <Star
                  size={15}
                  fill="currentColor"
                />

                {rating}
              </div>
            )}
          </div>

          {/* Trip details */}
          <div className="my-5 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-3">
            <BookingDetail
              icon={
                <CalendarDays size={17} />
              }
              label="Check-in"
              value={formatDate(
                booking.checkInDate
              )}
            />

            <BookingDetail
              icon={
                <CalendarDays size={17} />
              }
              label="Check-out"
              value={formatDate(
                booking.checkOutDate
              )}
            />

            <BookingDetail
              icon={<Plane size={17} />}
              label="Guests"
              value={`${booking.guests || 1} ${
                booking.guests === 1
                  ? "guest"
                  : "guests"
              }`}
            />
          </div>

          {/* Pending Payment Notice */}
          {isPendingPayment ? (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex gap-3">
                <Clock3
                  size={20}
                  className="mt-0.5 shrink-0 text-yellow-600"
                />

                <div>
                  <p className="text-sm font-semibold text-yellow-800">
                    Payment Pending
                  </p>

                  <p className="mt-1 text-xs leading-5 text-yellow-700">
                    Your booking has been
                    created, but payment has
                    not been completed yet.
                    Complete your payment to
                    confirm your stay.
                  </p>

                  <p className="mt-2 text-xs font-medium text-yellow-700">
                    Unpaid bookings are
                    automatically cancelled
                    after 24 hours.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Protection */
            <div className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                <ShieldCheck
                  size={20}
                />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  TripGuard Protection
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Check in on your arrival
                  date and provide a trusted
                  contact's email to activate
                  protection.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/traveller/bookings/${booking._id}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              View Booking
              <ArrowRight size={16} />
            </Link>

            {isPendingPayment ? (
              <>
                <Link
                  href={`/payment?bookingId=${booking._id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16a765] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
                >
                  <CreditCard
                    size={17}
                  />

                  Continue Payment
                </Link>

                <button
                  type="button"
                  onClick={
                    handleCancelBooking
                  }
                  disabled={cancelling}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelling ? (
                    <>
                      <Clock3
                        size={17}
                        className="animate-spin"
                      />

                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle
                        size={17}
                      />

                      Cancel Booking
                    </>
                  )}
                </button>
              </>
            ) : (
              booking.bookingStatus ===
                "confirmed" && (
                <Link
                  href={`/traveller/bookings/${booking._id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16a765] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
                >
                  <LogIn size={17} />
                  Check In
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * ==================================================
 * ACTIVE BOOKING CARD
 * ==================================================
 */

function ActiveBookingCard({
  booking,
  onRefresh,
}) {
  const accommodation =
    booking.accommodation;

  const image =
    accommodation?.images?.[0] ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";

  const name =
    accommodation?.name ||
    "Accommodation";

  const location =
    accommodation?.location
      ? [
          accommodation.location.address,
          accommodation.location.city,
          accommodation.location.state,
        ]
          .filter(Boolean)
          .join(", ")
      : "Location unavailable";

  const rating =
    accommodation?.rating ||
    accommodation?.averageRating ||
    "—";

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-[#16a765]/20 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[240px_1fr]">
        {/* Image */}
        <div className="relative h-52 lg:h-full lg:min-h-[240px]">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />

          <div className="absolute left-4 top-4 rounded-full bg-[#16a765] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
            Currently Staying
          </div>
        </div>

        {/* Details */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-bold">
                {name}
              </h3>

              <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#16a765]"
                />

                <span>
                  {location}
                </span>
              </div>
            </div>

            {rating !== "—" && (
              <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700">
                <Star
                  size={15}
                  fill="currentColor"
                />

                {rating}
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-3">
            <BookingDetail
              icon={
                <CalendarDays size={17} />
              }
              label="Check-in"
              value={formatDate(
                booking.checkInDate
              )}
            />

            <BookingDetail
              icon={
                <CalendarDays size={17} />
              }
              label="Check-out"
              value={formatDate(
                booking.checkOutDate
              )}
            />

            <BookingDetail
              icon={<Plane size={17} />}
              label="Guests"
              value={`${booking.guests || 1} ${
                booking.guests === 1
                  ? "guest"
                  : "guests"
              }`}
            />
          </div>

          {/* Protection */}
          <div className="mt-5 flex gap-3 rounded-xl border border-[#16a765]/20 bg-[#16a765]/5 p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-[#16a765]"
            />

            <div>
              <p className="text-sm font-semibold">
                TripGuard Protection Active
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Your safety contact has been
                notified about your stay.
                Checking out will trigger your
                safety notification.
              </p>

              {booking.safetyContact
                ?.email && (
                <p className="mt-1 text-xs font-medium text-[#16a765]">
                  {
                    booking.safetyContact
                      .email
                  }
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/traveller/bookings/${booking._id}`}
              className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              View Booking
            </Link>

            <button
              type="button"
              onClick={() =>
                handleCheckOut(
                  booking._id,
                  onRefresh
                )
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <LogOut size={17} />
              Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * ==================================================
 * COMPLETED BOOKING CARD
 * ==================================================
 */

function CompletedBookingCard({
  booking,
}) {
  const accommodation =
    booking.accommodation;

  const image =
    accommodation?.images?.[0] ||
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80";

  const name =
    accommodation?.name ||
    "Accommodation";

  const location =
    accommodation?.location
      ? [
          accommodation.location.address,
          accommodation.location.city,
          accommodation.location.state,
        ]
          .filter(Boolean)
          .join(", ")
      : "Location unavailable";

  const rating =
    accommodation?.rating ||
    accommodation?.averageRating ||
    "—";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />

        <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">
          <CheckCircle2
            size={14}
            className="text-[#16a765]"
          />

          Completed
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold">
              {name}
            </h3>

            <div className="mt-1 flex items-start gap-2 text-xs text-gray-500">
              <MapPin
                size={14}
                className="mt-0.5 shrink-0 text-[#16a765]"
              />

              <span>
                {location}
              </span>
            </div>
          </div>

          {rating !== "—" && (
            <div className="flex items-center gap-1 text-sm font-semibold text-yellow-700">
              <Star
                size={14}
                fill="currentColor"
              />

              {rating}
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
          <BookingDetail
            icon={
              <CalendarDays size={15} />
            }
            label="Check-in"
            value={formatDate(
              booking.checkInDate
            )}
          />

          <BookingDetail
            icon={
              <CalendarDays size={15} />
            }
            label="Check-out"
            value={formatDate(
              booking.checkOutDate
            )}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">
              Booking amount
            </p>

            <p className="mt-1 text-sm font-bold">
              {formatAmount(
                booking.totalAmount
              )}
            </p>
          </div>

          <Link
            href={`/traveller/bookings/${booking._id}`}
            className="flex items-center gap-1 text-sm font-semibold text-[#16a765]"
          >
            View details
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/*
 * ==================================================
 * STATUS BADGE
 * ==================================================
 */

function BookingStatusBadge({
  status,
  paymentStatus,
}) {
  const isPendingPayment =
    status === "pending" &&
    paymentStatus === "pending";

  const statusText = {
    confirmed: "Confirmed",
    pending: "Pending",
    "checked-in": "Checked In",
    "checked-out": "Checked Out",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold capitalize text-[#16a765] shadow-sm">
      {isPendingPayment
        ? "Payment Pending"
        : statusText[status] ||
          status ||
          "Booking"}
    </div>
  );
}

/*
 * ==================================================
 * EMPTY STATE
 * ==================================================
 */

function EmptyState({
  title,
  description,
  buttonText,
  href,
}) {
  return (
    <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <CalendarDays
          size={22}
          className="text-gray-500"
        />
      </div>

      <h3 className="mt-4 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>

      {buttonText && href && (
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
        >
          {buttonText}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

/*
 * ==================================================
 * CHECK-OUT
 * ==================================================
 */

async function handleCheckOut(
  bookingId,
  onRefresh
) {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error(
        "NEXT_PUBLIC_API_URL is not configured"
      );
    }

    const response = await fetch(
      `${apiUrl}/bookings/${bookingId}/check-out`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to complete check-out"
      );
    }

    await onRefresh();
  } catch (error) {
    console.error(
      "Check-out error:",
      error
    );

    alert(
      error.message ||
        "Unable to complete check-out"
    );
  }
}

/*
 * ==================================================
 * FORMAT DATE
 * ==================================================
 */

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

/*
 * ==================================================
 * FORMAT AMOUNT
 * ==================================================
 */

function formatAmount(amount) {
  if (
    amount === undefined ||
    amount === null
  ) {
    return "—";
  }

  return `₦${Number(amount).toLocaleString(
    "en-NG"
  )}`;
}

/*
 * ==================================================
 * SUMMARY CARD
 * ==================================================
 */

function SummaryCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
          {icon}
        </div>

        <span className="text-2xl font-bold">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

/*
 * ==================================================
 * SECTION HEADING
 * ==================================================
 */

function SectionHeading({
  title,
  description,
}) {
  return (
    <div>
      <h2 className="text-xl font-bold">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

/*
 * ==================================================
 * BOOKING DETAIL
 * ==================================================
 */

function BookingDetail({
  icon,
  label,
  value,
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {icon}
        {label}
      </div>

      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

