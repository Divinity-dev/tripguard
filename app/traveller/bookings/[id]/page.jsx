"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  LogIn,
  Phone,
Mail,
  LogOut,
  MapPin,
  MessageCircle,
  Plane,
  ShieldCheck,
  Star,
  Users,
  Loader2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const BookingDetailsPage = () => {
  const params = useParams();

  const bookingId = params?.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [showSafetyModal, setShowSafetyModal] =
    useState(false);

    const [showContactModal, setShowContactModal] =
  useState(false);

  const [safetyEmail, setSafetyEmail] =
    useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL;

  /*
   * ==================================================
   * FETCH BOOKING
   * ==================================================
   */

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError("");

      if (!apiUrl) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured"
        );
      }

      if (!bookingId) {
        throw new Error(
          "Booking ID is missing"
        );
      }

      const response = await fetch(
        `${apiUrl}/bookings/${bookingId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log(
        "Booking details response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to retrieve booking"
        );
      }

      setBooking(data.booking);
    } catch (error) {
      console.error(
        "Fetch booking error:",
        error
      );

      setError(
        error.message ||
          "Unable to retrieve booking"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  /*
   * ==================================================
   * CHECK IN
   * ==================================================
   */

  const handleCheckIn = async () => {
    if (!safetyEmail.trim()) {
      setActionError(
        "Please provide your trusted contact's email address."
      );
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");
      setActionMessage("");

      const response = await fetch(
        `${apiUrl}/bookings/${bookingId}/check-in`,
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

      const data = await response.json();

      console.log(
        "Check-in response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to check in"
        );
      }

      setBooking(data.booking);

      setActionMessage(
        data.message ||
          "Check-in successful."
      );

      setShowSafetyModal(false);
      setSafetyEmail("");
    } catch (error) {
      console.error(
        "Check-in error:",
        error
      );

      setActionError(
        error.message ||
          "Unable to complete check-in"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * ==================================================
   * CHECK OUT
   * ==================================================
   */

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setActionError("");
      setActionMessage("");

      const response = await fetch(
        `${apiUrl}/bookings/${bookingId}/check-out`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log(
        "Check-out response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to check out"
        );
      }

      setBooking(data.booking);

      setActionMessage(
        data.message ||
          "Check-out successful."
      );
    } catch (error) {
      console.error(
        "Check-out error:",
        error
      );

      setActionError(
        error.message ||
          "Unable to complete check-out"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this booking?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setActionLoading(true);
    setActionError("");
    setActionMessage("");

    const response = await fetch(
      `${apiUrl}/bookings/${bookingId}/cancel`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: "Cancelled by traveller",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to cancel booking."
      );
    }

    setBooking(data.booking);

    setActionMessage(
      data.message ||
        "Booking cancelled successfully."
    );
  } catch (error) {
    console.error(
      "Cancel booking error:",
      error
    );

    setActionError(
      error.message ||
        "Unable to cancel booking."
    );
  } finally {
    setActionLoading(false);
  }
};

  const handleViewReceipt = () => {
  const receiptWindow = window.open(
    "",
    "_blank",
    "width=800,height=900"
  );

  if (!receiptWindow) {
    setActionError(
      "Unable to open receipt. Please allow pop-ups for this site."
    );
    return;
  }

  receiptWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>TripGuard Receipt - ${
          booking.bookingReference || booking._id
        }</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 40px;
            font-family: Arial, sans-serif;
            color: #111827;
            background: #ffffff;
          }

          .receipt {
            max-width: 700px;
            margin: 0 auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #16a765;
            padding-bottom: 20px;
          }

          .brand {
            color: #16a765;
            font-size: 28px;
            font-weight: bold;
          }

          .title {
            font-size: 22px;
            font-weight: bold;
            margin-top: 30px;
          }

          .reference {
            color: #6b7280;
            font-size: 13px;
            margin-top: 5px;
          }

          .section {
            margin-top: 30px;
          }

          .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 12px;
            color: #374151;
          }

          .info {
            background: #f9fafb;
            border-radius: 10px;
            padding: 16px;
          }

          .row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding: 9px 0;
            font-size: 14px;
          }

          .label {
            color: #6b7280;
          }

          .value {
            font-weight: 600;
            text-align: right;
          }

          .total {
            border-top: 1px solid #d1d5db;
            margin-top: 10px;
            padding-top: 15px;
            font-size: 18px;
            font-weight: bold;
          }

          .paid {
            display: inline-block;
            margin-top: 20px;
            padding: 8px 14px;
            border-radius: 20px;
            background: #ecfdf5;
            color: #047857;
            font-size: 13px;
            font-weight: bold;
          }

          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
            text-align: center;
          }

          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt">

          <div class="header">
            <div>
              <div class="brand">TripGuard</div>
              <div style="margin-top: 5px; color: #6b7280;">
                Accommodation Booking Receipt
              </div>
            </div>

            <div style="text-align: right;">
              <div style="font-size: 13px; color: #6b7280;">
                Booking Reference
              </div>

              <div style="font-weight: bold; margin-top: 5px;">
                ${
                  booking.bookingReference ||
                  booking._id
                }
              </div>
            </div>
          </div>

          <div class="title">
            ${propertyName}
          </div>

          <div class="reference">
            ${locationText || "Location unavailable"}
          </div>

          <div class="section">
            <div class="section-title">
              STAY DETAILS
            </div>

            <div class="info">
              <div class="row">
                <span class="label">Check-in</span>
                <span class="value">${checkInDate}</span>
              </div>

              <div class="row">
                <span class="label">Check-out</span>
                <span class="value">${checkOutDate}</span>
              </div>

              <div class="row">
                <span class="label">Guests</span>
                <span class="value">${guests}</span>
              </div>

              <div class="row">
                <span class="label">Nights</span>
                <span class="value">${totalNights}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              PAYMENT
            </div>

            <div class="info">
              <div class="row">
                <span class="label">Accommodation</span>
                <span class="value">
                  ${formatCurrency(roomAmount)}
                </span>
              </div>

              <div class="row">
                <span class="label">TripGuard service fee</span>
                <span class="value">
                  ${formatCurrency(serviceFee)}
                </span>
              </div>

              <div class="row total">
                <span>Total</span>
                <span>
                  ${formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <div class="paid">
              Payment Status: ${formatStatus(
                paymentStatus
              )}
            </div>
          </div>

          <div class="footer">
            Thank you for booking with TripGuard.<br />
            Keep this receipt for your records.
          </div>

        </div>

        <script>
          window.onload = function () {
            window.print();
          };
        </script>
      </body>
    </html>
  `);

  receiptWindow.document.close();
};

  /*
   * ==================================================
   * LOADING
   * ==================================================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f8]">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={32}
              className="animate-spin text-[#16a765]"
            />

            <p className="text-sm text-gray-500">
              Loading booking...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ==================================================
   * ERROR
   * ==================================================
   */

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-[#f7f9f8]">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
          <div className="w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <XCircle size={28} />
            </div>

            <h1 className="mt-5 text-xl font-bold">
              Unable to load booking
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error ||
                "The booking could not be found."}
            </p>

            <Link
              href="/traveller/bookings"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
            >
              <ArrowLeft size={17} />
              Back to bookings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const accommodation =
    booking.accommodation;

    const propertyOwner =
  accommodation?.owner;

const ownerName = [
  propertyOwner?.firstName,
  propertyOwner?.lastName,
]
  .filter(Boolean)
  .join(" ");

const ownerPhone =
  propertyOwner?.phone || "";

const ownerEmail =
  propertyOwner?.email || "";

const whatsappNumber =
  ownerPhone.replace(/\D/g, "");

  const whatsappNumberFormatted =
  whatsappNumber.startsWith("0")
    ? `234${whatsappNumber.slice(1)}`
    : whatsappNumber;

  const location =
    accommodation?.location;

  const locationText = [
    location?.address,
    location?.city,
    location?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const image =
    accommodation?.images?.[0] ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=90";

  const propertyName =
    accommodation?.name ||
    "Accommodation";

  const rating =
    accommodation?.rating ||
    accommodation?.averageRating ||
    "N/A";

  const checkInDate =
    formatDate(booking.checkInDate);

  const checkOutDate =
    formatDate(booking.checkOutDate);

  const totalNights =
    booking.totalNights || 0;

  const guests =
    booking.guests || 0;

  const roomAmount =
    booking.accommodationAmount || 0;

  const serviceFee =
    booking.serviceFee || 0;

  const totalAmount =
    booking.totalAmount || 0;

  const bookingStatus =
    booking.bookingStatus;

  const paymentStatus =
    booking.paymentStatus;

  /*
   * Safety contact
   */

  const safetyContact =
    booking.safetyContact;

  /*
   * ==================================================
   * PAGE
   * ==================================================
   */

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/traveller/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#16a765]"
          >
            <ArrowLeft size={17} />
            Back to bookings
          </Link>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#16a765]">
                Booking Details
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {propertyName}
              </h1>

              <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#16a765]"
                />

                <span>
                  {locationText ||
                    "Location unavailable"}
                </span>
              </div>
            </div>

            <StatusBadge
              status={bookingStatus}
            />
          </div>
        </div>
      </section>

      {/* Action message */}
      {(actionError || actionMessage) && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          {actionError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {actionError}
            </div>
          )}

          {actionMessage && (
            <div className="rounded-xl border border-[#16a765]/20 bg-[#16a765]/5 px-4 py-3 text-sm text-[#128c55]">
              {actionMessage}
            </div>
          )}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
          {/* ==================================================
              MAIN COLUMN
          ================================================== */}

          <div className="space-y-6">
            {/* Property Image */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="relative h-64 sm:h-80">
                <img
                  src={image}
                  alt={propertyName}
                  className="h-full w-full object-cover"
                />

                {rating !== "N/A" && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-semibold text-yellow-700 shadow-sm">
                    <Star
                      size={15}
                      fill="currentColor"
                    />

                    {rating}
                  </div>
                )}
              </div>
            </div>

            {/* Stay Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Stay Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Everything you need for your
                    stay.
                  </p>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765] sm:flex">
                  <CalendarDays size={20} />
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InfoItem
                  icon={
                    <CalendarDays size={18} />
                  }
                  label="Check-in"
                  value={checkInDate}
                  secondary={
                    accommodation?.checkInTime ||
                    "Check-in time not specified"
                  }
                />

                <InfoItem
                  icon={
                    <CalendarDays size={18} />
                  }
                  label="Check-out"
                  value={checkOutDate}
                  secondary={
                    accommodation?.checkOutTime ||
                    "Check-out time not specified"
                  }
                />

                <InfoItem
                  icon={<Users size={18} />}
                  label="Guests"
                  value={`${guests} ${
                    guests === 1
                      ? "guest"
                      : "guests"
                  }`}
                  secondary={`${totalNights} ${
                    totalNights === 1
                      ? "night"
                      : "nights"
                  }`}
                />

                <InfoItem
                  icon={<Plane size={18} />}
                  label="Accommodation"
                  value={propertyName}
                  secondary="TripGuard stay"
                />
              </div>
            </div>

            {/* Property Location */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
                  <MapPin size={21} />
                </div>

                <div>
                  <h2 className="font-bold">
                    Property Location
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {locationText ||
                      "Location unavailable"}
                  </p>
                <a
  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    locationText
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-3 inline-flex text-sm font-semibold text-[#16a765] hover:underline"
>
  View on map
</a>
                </div>
              </div>
            </div>

            {/* Booking Actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold">
                Manage Booking
              </h2>

              {bookingStatus === "pending" &&
  paymentStatus === "pending" && (
    <>
      <Link
        href={`/payment?bookingId=${booking._id}`}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#16a765] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
      >
        <CreditCard size={17} />
        Continue Payment
      </Link>

      <button
        type="button"
        onClick={handleCancelBooking}
        disabled={actionLoading}
        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {actionLoading ? (
          <Loader2
            size={17}
            className="animate-spin"
          />
        ) : (
          <XCircle size={17} />
        )}

        Cancel Booking
      </button>
    </>
)}
            </div>
          </div>

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="space-y-6">
            {/* TripGuard Protection */}
            <div className="rounded-2xl bg-gray-900 p-6 text-white shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16a765]">
                <ShieldCheck size={22} />
              </div>

              <h2 className="mt-5 text-lg font-bold">
                TripGuard Protection
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Check in when you arrive and
                check out when you leave. Your
                safety contact will be notified
                about your trip.
              </p>

              <div className="mt-5 rounded-xl bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-400">
                    Current status
                  </span>

                  <StatusBadge
                    status={bookingStatus}
                    dark
                  />
                </div>
              </div>

              <div className="mt-4">
                {/* CONFIRMED */}
                {bookingStatus ===
                  "confirmed" && (
                  <>
                    {paymentStatus !==
                      "paid" && (
                      <div className="rounded-xl bg-yellow-500/10 p-4 text-xs leading-5 text-yellow-200">
                        Your booking must be
                        paid before you can
                        check in.
                      </div>
                    )}

                    {paymentStatus ===
                      "paid" && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowSafetyModal(
                            true
                          )
                        }
                        disabled={
                          actionLoading
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16a765] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading ? (
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <LogIn
                            size={17}
                          />
                        )}

                        Check In
                      </button>
                    )}
                  </>
                )}

                {/* CHECKED IN */}
                {bookingStatus ===
                  "checked-in" && (
                  <button
                    type="button"
                    onClick={
                      handleCheckOut
                    }
                    disabled={
                      actionLoading
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <LogOut
                        size={17}
                      />
                    )}

                    Check Out
                  </button>
                )}

                {/* COMPLETED */}
                {bookingStatus ===
                  "completed" && (
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16a765]/10 px-4 py-3 text-sm font-semibold text-[#63E6BE]">
                    <CheckCircle2
                      size={17}
                    />
                    Trip Completed
                  </div>
                )}

                {/* CHECKED OUT */}
                {bookingStatus ===
                  "checked-out" && (
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16a765]/10 px-4 py-3 text-sm font-semibold text-[#63E6BE]">
                    <CheckCircle2
                      size={17}
                    />
                    Checked Out
                  </div>
                )}

                {/* PENDING */}
                {bookingStatus ===
                  "pending" && (
                  <div className="rounded-xl bg-yellow-500/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-yellow-200">
                      <Clock3 size={17} />
                      Awaiting confirmation
                    </div>

                    <p className="mt-2 text-xs leading-5 text-gray-400">
                      The accommodation owner
                      needs to confirm your
                      booking before you can
                      check in.
                    </p>
                  </div>
                )}

                {/* CANCELLED */}
                {bookingStatus ===
                  "cancelled" && (
                  <div className="rounded-xl bg-red-500/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-red-300">
                      <XCircle size={17} />
                      Booking Cancelled
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Safety Contact */}
            <div className="rounded-2xl border border-[#16a765]/20 bg-[#16a765]/5 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16a765]/10 text-[#16a765]">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Safety Contact
                  </p>

                  <p className="text-xs text-gray-500">
                    TripGuard protection
                  </p>
                </div>
              </div>

              {safetyContact?.email ? (
                <>
                  <div className="mt-5 rounded-xl bg-white p-4">
                    {safetyContact.name && (
                      <p className="text-sm font-semibold">
                        {safetyContact.name}
                      </p>
                    )}

                    <p className="text-sm text-gray-500">
                      {safetyContact.email}
                    </p>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-gray-500">
                    Your safety contact has been
                    registered for this trip.
                  </p>
                </>
              ) : (
                <>
                  <div className="mt-5 rounded-xl bg-white p-4">
                    <p className="text-sm font-semibold">
                      Not activated
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Provide a trusted contact's
                      email when you check in.
                    </p>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-gray-500">
                    Your safety contact will
                    receive a notification when
                    you check in and check out.
                  </p>
                </>
              )}

              <Link
                href="/dashboard/traveller/profile"
                className="mt-4 inline-flex text-sm font-semibold text-[#16a765] hover:underline"
              >
                Manage safety contact
              </Link>
            </div>

            {/* Payment Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <CreditCard size={19} />
                </div>

                <div>
                  <h2 className="font-bold">
                    Payment Summary
                  </h2>

                  <p className="text-xs text-gray-500">
                    {booking.bookingReference ||
                      `Booking #${booking._id}`}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <PriceRow
                  label="Accommodation"
                  value={formatCurrency(
                    roomAmount
                  )}
                />

                <PriceRow
                  label="TripGuard service fee"
                  value={formatCurrency(
                    serviceFee
                  )}
                />

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-lg font-bold">
                      {formatCurrency(
                        totalAmount
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Payment status
                  </span>

                  <span
                    className={`text-xs font-semibold ${
                      paymentStatus ===
                      "paid"
                        ? "text-[#16a765]"
                        : "text-yellow-600"
                    }`}
                  >
                    {formatStatus(
                      paymentStatus
                    )}
                  </span>
                </div>
              </div>

              <button
  type="button"
  onClick={handleViewReceipt}
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
>
  <FileText size={17} />
  View Receipt
</button>
            </div>

            {/* Booking Reference */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <Clock3
                  size={17}
                  className="text-[#16a765]"
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Booking reference
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {booking.bookingReference ||
                      booking._id}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ==================================================
          SAFETY CONTACT MODAL
      ================================================== */}

      {showSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#16a765]/10 text-[#16a765]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Activate TripGuard Protection
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Enter the email address of a
              relative or trusted person. They
              will receive a notification when
              you check in and another when you
              check out.
            </p>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Trusted contact email
              </label>

              <input
                type="email"
                value={safetyEmail}
                onChange={(event) =>
                  setSafetyEmail(
                    event.target.value
                  )
                }
                placeholder="example@email.com"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#16a765] focus:ring-2 focus:ring-[#16a765]/10"
              />
            </div>

            {actionError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {actionError}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setShowSafetyModal(
                    false
                  );
                  setActionError("");
                }}
                disabled={actionLoading}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16a765] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Checking in...
                  </>
                ) : (
                  <>
                    <LogIn size={17} />
                    Confirm Check In
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
    CONTACT PROPERTY MODAL
================================================== */}

{showContactModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    onClick={() => setShowContactModal(false)}
  >
    <div
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#16a765]/10 text-[#16a765]">
            <MessageCircle size={23} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Contact Property
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Contact the accommodation directly about
              your stay.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowContactModal(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <XCircle size={20} />
        </button>
      </div>

      {/* Property contact */}
      <div className="mt-6 space-y-3">
        {ownerName && (
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              Property contact
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {ownerName}
            </p>
          </div>
        )}

        {ownerPhone && (
          <a
            href={`tel:${ownerPhone}`}
            className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <Phone size={18} />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Phone
              </p>

              <p className="text-sm font-semibold text-gray-900">
                {ownerPhone}
              </p>
            </div>
          </a>
        )}

        {ownerEmail && (
          <a
            href={`mailto:${ownerEmail}`}
            className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <Mail size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500">
                Email
              </p>

              <p className="truncate text-sm font-semibold text-gray-900">
                {ownerEmail}
              </p>
            </div>
          </a>
        )}

        {whatsappNumberFormatted && (
          <a
            href={`https://wa.me/${whatsappNumberFormatted}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#16a765] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
        )}

        {!ownerPhone &&
  !ownerEmail &&
  !whatsappNumberFormatted && (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <Phone size={19} />
      </div>

      <p className="mt-3 text-sm font-semibold text-gray-700">
        Contact details unavailable
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        The property owner has not provided
        phone, email, or WhatsApp contact
        information yet.
      </p>
    </div>
  )}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={() => setShowContactModal(false)}
        className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        Close
      </button>
    </div>
  </div>
)}
    </main>
  );
};

/*
 * ==================================================
 * STATUS BADGE
 * ==================================================
 */

function StatusBadge({
  status,
  dark = false,
}) {
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: <Clock3 size={14} />,
    },

    confirmed: {
      label: "Confirmed",
      icon: <Clock3 size={14} />,
    },

    "checked-in": {
      label: "Checked In",
      icon: <CheckCircle2 size={14} />,
    },

    "checked-out": {
      label: "Checked Out",
      icon: <CheckCircle2 size={14} />,
    },

    completed: {
      label: "Completed",
      icon: <CheckCircle2 size={14} />,
    },

    cancelled: {
      label: "Cancelled",
      icon: <XCircle size={14} />,
    },
  };

  const current =
    statusConfig[status];

  if (!current) {
    return null;
  }

  if (dark) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
        {current.icon}
        {current.label}
      </div>
    );
  }

  const className =
    status === "completed" ||
    status === "checked-out" ||
    status === "checked-in"
      ? "bg-[#16a765]/10 text-[#16a765]"
      : status === "cancelled"
      ? "bg-red-50 text-red-700"
      : status === "confirmed"
      ? "bg-blue-50 text-blue-700"
      : "bg-yellow-50 text-yellow-700";

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}
    >
      {current.icon}
      {current.label}
    </div>
  );
}

/*
 * ==================================================
 * INFO ITEM
 * ==================================================
 */

function InfoItem({
  icon,
  label,
  value,
  secondary,
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold">
          {value}
        </p>

        {secondary && (
          <p className="mt-1 text-xs text-gray-400">
            {secondary}
          </p>
        )}
      </div>
    </div>
  );
}

/*
 * ==================================================
 * PRICE ROW
 * ==================================================
 */

function PriceRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium">
        {value}
      </span>
    </div>
  );
}

/*
 * ==================================================
 * FORMAT DATE
 * ==================================================
 */

function formatDate(date) {
  if (!date) {
    return "Date unavailable";
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
 * FORMAT CURRENCY
 * ==================================================
 */

function formatCurrency(amount) {
  if (
    amount === null ||
    amount === undefined
  ) {
    return "₦0";
  }

  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }
  ).format(amount);
}

/*
 * ==================================================
 * FORMAT STATUS
 * ==================================================
 */

function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return status
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default BookingDetailsPage;