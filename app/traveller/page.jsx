"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  Heart,
  Bell,
  ArrowRight,
  Plane,
  LogIn,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProtectedRoute from "../../component/ProtectedRoute";

export default function TravellerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCheckInModal, setShowCheckInModal] =
    useState(false);

  const [safetyEmail, setSafetyEmail] = useState("");
  const [checkInLoading, setCheckInLoading] =
    useState(false);
  const [checkInError, setCheckInError] =
    useState("");

  const [checkOutLoading, setCheckOutLoading] =
    useState(false);
  const [checkOutError, setCheckOutError] =
    useState("");

    const { user } = useSelector(
  (state) => state.auth
);

  /*
   * --------------------------------------------------
   * FETCH BOOKINGS
   * --------------------------------------------------
   */

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

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
        "My bookings response:",
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
   *
   * This makes the frontend date comparison use
   * Africa/Lagos rather than the browser's timezone.
   */

  const getNigeriaDateKey = (date) => {
    return new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Africa/Lagos",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(new Date(date));
  };

  const today = getNigeriaDateKey(
    new Date()
  );

  /*
   * --------------------------------------------------
   * UPCOMING BOOKINGS
   * --------------------------------------------------
   */

  const upcomingBookings =
    bookings.filter(
      (booking) =>
        ![
          "cancelled",
          "completed",
          "checked-out",
        ].includes(
          booking.bookingStatus
        ) &&
        getNigeriaDateKey(
          booking.checkOutDate
        ) >= today
    );

  const upcomingBooking =
    [...upcomingBookings].sort(
      (a, b) =>
        new Date(a.checkInDate) -
        new Date(b.checkInDate)
    )[0];

  const totalTrips = bookings.length;

  const upcomingTrips =
    upcomingBookings.length;

  const completedTrips =
    bookings.filter(
      (booking) =>
        booking.bookingStatus ===
          "completed" ||
        booking.bookingStatus ===
          "checked-out"
    ).length;

  /*
   * --------------------------------------------------
   * CHECK-IN AVAILABILITY
   * --------------------------------------------------
   */

  const canCheckIn =
    upcomingBooking &&
    upcomingBooking.bookingStatus ===
      "confirmed" &&
    getNigeriaDateKey(
      upcomingBooking.checkInDate
    ) === today;

  /*
   * --------------------------------------------------
   * CHECK-OUT AVAILABILITY
   * --------------------------------------------------
   */

  const canCheckOut =
    upcomingBooking &&
    upcomingBooking.bookingStatus ===
      "checked-in" &&
    getNigeriaDateKey(
      upcomingBooking.checkOutDate
    ) === today;

  /*
   * --------------------------------------------------
   * CHECK-IN
   * --------------------------------------------------
   */

  const handleCheckIn = async () => {
    try {
      setCheckInLoading(true);
      setCheckInError("");

      if (!safetyEmail.trim()) {
        setCheckInError(
          "Please enter the email address of your relative or trusted contact."
        );

        return;
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured"
        );
      }

      const response = await fetch(
        `${apiUrl}/bookings/${upcomingBooking._id}/check-in`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            safetyEmail:
              safetyEmail.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to complete check-in"
        );
      }

      /*
       * Update the booking in local state
       * immediately so the dashboard changes
       * without requiring a page reload.
       */

      setBookings((currentBookings) =>
        currentBookings.map(
          (booking) =>
            booking._id ===
            upcomingBooking._id
              ? data.booking
              : booking
        )
      );

      setSafetyEmail("");
      setShowCheckInModal(false);
    } catch (error) {
      console.error(
        "Check-in error:",
        error
      );

      setCheckInError(
        error.message ||
          "Unable to complete check-in"
      );
    } finally {
      setCheckInLoading(false);
    }
  };

  /*
   * --------------------------------------------------
   * CHECK-OUT
   * --------------------------------------------------
   */

  const handleCheckOut = async () => {
    try {
      setCheckOutLoading(true);
      setCheckOutError("");

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured"
        );
      }

      const response = await fetch(
        `${apiUrl}/bookings/${upcomingBooking._id}/check-out`,
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

      /*
       * Update local booking state.
       */

      setBookings((currentBookings) =>
        currentBookings.map(
          (booking) =>
            booking._id ===
            upcomingBooking._id
              ? data.booking
              : booking
        )
      );
    } catch (error) {
      console.error(
        "Check-out error:",
        error
      );

      setCheckOutError(
        error.message ||
          "Unable to complete check-out"
      );
    } finally {
      setCheckOutLoading(false);
    }
  };

  /*
   * --------------------------------------------------
   * PROTECTION STATE
   * --------------------------------------------------
   */

  const isCheckedIn =
    upcomingBooking?.bookingStatus ===
    "checked-in";

  const isCheckedOut =
    upcomingBooking?.bookingStatus ===
    "checked-out";

  const safetyContact =
    upcomingBooking?.safetyContact;

  return (
    <ProtectedRoute allowedRole="user">
      <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
        {/* Header */}
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-[#16a765]">
                  Traveller Dashboard
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome back, {user?.firstName || "Traveller"} 👋
                </h1>

                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                  Manage your trips, bookings and
                  TripGuard protection.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
                  aria-label="Notifications"
                >
                  <Bell size={19} />

                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#16a765]" />
                </button>

                <Link
  href="/traveller/profile"
  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16a765] font-semibold text-white"
>
  {user?.firstName?.charAt(0)?.toUpperCase() || "T"}
</Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Statistics */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={
                <CalendarDays size={20} />
              }
              title="Total Trips"
              value={totalTrips}
              description="All your trips"
            />

            <StatCard
              icon={<Clock3 size={20} />}
              title="Upcoming"
              value={upcomingTrips}
              description="Trip coming up"
            />

            <StatCard
              icon={
                <CheckCircle2 size={20} />
              }
              title="Completed"
              value={completedTrips}
              description="Trips completed"
            />

            <StatCard
              icon={<Heart size={20} />}
              title="Saved"
              value="6"
              description="Saved stays"
            />
          </section>

          {/* Main Content */}
          <section className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            {/* Upcoming Trip */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Upcoming Trip
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your next TripGuard-protected
                    stay.
                  </p>
                </div>

                <Link
                  href="/traveller/bookings"
                  className="hidden items-center gap-1 text-sm font-semibold text-[#16a765] sm:flex"
                >
                  All bookings
                  <ArrowRight size={16} />
                </Link>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm text-gray-500">
                    Loading your upcoming trip...
                  </p>
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                  <p className="text-sm font-medium text-red-600">
                    {error}
                  </p>
                </div>
              ) : !upcomingBooking ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <CalendarDays
                      size={22}
                      className="text-gray-500"
                    />
                  </div>

                  <h3 className="mt-4 text-lg font-bold">
                    No upcoming trips
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    You don't have any upcoming
                    bookings at the moment.
                  </p>

                  <Link
                    href="/accommodations"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
                  >
                    Find a stay
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  {/* Property Image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={
                        upcomingBooking
                          .accommodation
                          ?.images?.[0] ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={
                        upcomingBooking
                          .accommodation
                          ?.name ||
                        "Accommodation"
                      }
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold capitalize text-[#16a765] shadow-sm">
                      {upcomingBooking.bookingStatus}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    {/* Property Header */}
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-bold">
                          {upcomingBooking
                            .accommodation
                            ?.name ||
                            "Accommodation"}
                        </h3>

                        <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                          <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-[#16a765]"
                          />

                          <span>
                            {upcomingBooking
                              .accommodation
                              ?.location
                              ? [
                                  upcomingBooking
                                    .accommodation
                                    .location
                                    .address,
                                  upcomingBooking
                                    .accommodation
                                    .location
                                    .city,
                                  upcomingBooking
                                    .accommodation
                                    .location
                                    .state,
                                ]
                                  .filter(Boolean)
                                  .join(", ")
                              : "Location unavailable"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700">
                        <Star
                          size={15}
                          fill="currentColor"
                        />
                        4.8
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="my-5 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-3">
                      <TripDetail
                        icon={
                          <CalendarDays
                            size={17}
                          />
                        }
                        label="Check-in"
                        value={new Date(
                          upcomingBooking.checkInDate
                        ).toLocaleDateString(
                          "en-NG",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      />

                      <TripDetail
                        icon={
                          <CalendarDays
                            size={17}
                          />
                        }
                        label="Check-out"
                        value={new Date(
                          upcomingBooking.checkOutDate
                        ).toLocaleDateString(
                          "en-NG",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      />

                      <TripDetail
                        icon={
                          <Plane size={17} />
                        }
                        label="Guests"
                        value={`${upcomingBooking.guests} ${
                          upcomingBooking.guests ===
                          1
                            ? "guest"
                            : "guests"
                        }`}
                      />
                    </div>

                    {/* Protection */}
                    {isCheckedIn ? (
                      <div className="flex gap-3 rounded-xl border border-[#16a765]/20 bg-[#16a765]/5 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16a765]/10 text-[#16a765]">
                          <ShieldCheck
                            size={20}
                          />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            TripGuard Protection
                            Active
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            Your safety contact has
                            been notified that you
                            checked in.
                          </p>

                          {safetyContact?.email && (
                            <p className="mt-1 text-xs font-medium text-[#16a765]">
                              {safetyContact.email}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                          <ShieldCheck
                            size={20}
                          />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            TripGuard Protection
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            Check in on your arrival
                            date and provide a
                            trusted contact's email
                            to activate protection.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Error messages */}
                    {checkOutError && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                        <p className="text-xs font-medium text-red-600">
                          {checkOutError}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/traveller/bookings/${upcomingBooking._id}`}
                        className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        View Booking
                      </Link>

                      {canCheckIn && (
                        <button
                          type="button"
                          onClick={() => {
                            setCheckInError("");
                            setSafetyEmail(
                              safetyContact?.email ||
                                ""
                            );
                            setShowCheckInModal(
                              true
                            );
                          }}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16a765] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
                        >
                          <LogIn size={17} />
                          Check in
                        </button>
                      )}

                      {canCheckOut && (
                        <button
                          type="button"
                          onClick={
                            handleCheckOut
                          }
                          disabled={
                            checkOutLoading
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <LogOut size={17} />

                          {checkOutLoading
                            ? "Checking out..."
                            : "Check out"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Protection Card */}
              <div className="rounded-2xl bg-gray-900 p-6 text-white">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16a765]">
                  <ShieldCheck size={22} />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Your TripGuard Protection
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  When you check in, your chosen
                  safety contact receives your
                  accommodation details. When you
                  check out, they receive another
                  notification confirming that you
                  have left.
                </p>

                {isCheckedIn &&
                safetyContact?.email ? (
                  <div className="mt-5 rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-gray-400">
                      Safety contact
                    </p>

                    {safetyContact?.name && (
                      <p className="mt-1 text-sm font-semibold">
                        {safetyContact.name}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-gray-400">
                      {safetyContact.email}
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl bg-white/5 p-4">
                    <p className="text-sm font-semibold">
                      Protection not activated
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      Check in on your accommodation
                      check-in date to activate
                      TripGuard Protection.
                    </p>
                  </div>
                )}

                <Link
                  href="/traveller/profile"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#63E6BE]"
                >
                  Manage protection
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">
                    Recent Activity
                  </h3>

                  <Link
                    href="/traveller/bookings"
                    className="text-xs font-semibold text-[#16a765]"
                  >
                    View all
                  </Link>
                </div>

                <div className="mt-5 space-y-5">
                  <ActivityItem
                    icon={
                      <CheckCircle2
                        size={17}
                      />
                    }
                    title="Booking confirmed"
                    description="The Meridian House"
                    time="2 days ago"
                  />

                  <ActivityItem
                    icon={<Star size={17} />}
                    title="Review submitted"
                    description="Palm Court Residence"
                    time="1 week ago"
                  />

                  <ActivityItem
                    icon={<Heart size={17} />}
                    title="Accommodation saved"
                    description="Cedar View Suites"
                    time="2 weeks ago"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Quick Access */}
          <section className="mt-8">
            <h2 className="text-xl font-bold">
              Quick Access
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickLink
                href="/traveller/bookings"
                icon={
                  <CalendarDays size={20} />
                }
                title="My Bookings"
                description="View all your bookings"
              />

              <QuickLink
                href="/traveller/saved"
                icon={<Heart size={20} />}
                title="Saved Stays"
                description="Your favourite places"
              />

              <QuickLink
                href="/traveller/notifications"
                icon={<Bell size={20} />}
                title="Notifications"
                description="Stay updated"
              />

              <QuickLink
                href="/traveller/profile"
                icon={
                  <ShieldCheck size={20} />
                }
                title="Profile & Safety"
                description="Manage your account"
              />
            </div>
          </section>
        </div>

        {/* ==========================================
            CHECK-IN MODAL
            ========================================== */}

        {showCheckInModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
                    <ShieldCheck size={23} />
                  </div>

                  <h2 className="mt-4 text-xl font-bold">
                    Activate TripGuard Protection
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Enter the email address of a
                    relative or trusted person. We'll
                    notify them that you've checked
                    into your accommodation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!checkInLoading) {
                      setShowCheckInModal(
                        false
                      );
                      setCheckInError("");
                    }
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Accommodation */}
              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Checking in to
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {
                    upcomingBooking
                      ?.accommodation?.name
                  }
                </p>
              </div>

              {/* Email */}
              <div className="mt-5">
                <label
                  htmlFor="safetyEmail"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Relative or trusted contact's
                  email
                </label>

                <input
                  id="safetyEmail"
                  type="email"
                  value={safetyEmail}
                  onChange={(event) => {
                    setSafetyEmail(
                      event.target.value
                    );
                    setCheckInError("");
                  }}
                  placeholder="relative@example.com"
                  disabled={checkInLoading}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#16a765] focus:ring-2 focus:ring-[#16a765]/10 disabled:bg-gray-100"
                />
              </div>

              {/* Error */}
              {checkInError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-medium leading-5 text-red-600">
                    {checkInError}
                  </p>
                </div>
              )}

              {/* Explanation */}
              <div className="mt-5 rounded-xl border border-[#16a765]/20 bg-[#16a765]/5 p-4">
                <p className="text-xs leading-5 text-gray-600">
                  <strong className="text-gray-900">
                    How it works:
                  </strong>{" "}
                  Your contact will receive the name
                  and location of your accommodation
                  and a notification that you have
                  checked in. When you check out,
                  they'll receive another notification
                  confirming that you've left.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    if (!checkInLoading) {
                      setShowCheckInModal(
                        false
                      );
                      setCheckInError("");
                    }
                  }}
                  disabled={checkInLoading}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={checkInLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16a765] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogIn size={17} />

                  {checkInLoading
                    ? "Confirming..."
                    : "Confirm Check-in"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}

function StatCard({
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

function TripDetail({
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

function ActivityItem({
  icon,
  title,
  description,
  time,
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16a765]/10 text-[#16a765]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-gray-500">
          {description}
        </p>

        <p className="mt-1 text-[11px] text-gray-400">
          {time}
        </p>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#16a765]/30 hover:shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition group-hover:bg-[#16a765]/10 group-hover:text-[#16a765]">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold">
        {title}
      </h3>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </Link>
  );
}