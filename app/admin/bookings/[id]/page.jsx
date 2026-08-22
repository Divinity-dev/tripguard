"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Ban,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  FileText,
  Globe,
  Heart,
  Home,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  ShieldCheck,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import API from "@/axios/index";

const statusStyles = {
  confirmed: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  "checked-in": "bg-blue-50 text-blue-600",
  "checked-out": "bg-violet-50 text-violet-600",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-50 text-red-600",
};

const statusLabels = {
  confirmed: "Confirmed",
  pending: "Pending",
  "checked-in": "Checked In",
  "checked-out": "Checked Out",
  completed: "Completed",
  cancelled: "Cancelled",
};

const BookingDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showActions, setShowActions] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * We already have the admin getAllBookings endpoint.
         * Fetch the bookings and find the booking matching the
         * booking reference in the URL.
         */
        const response = await API.get("/admin/bookings");

        const bookingsData =
          response.data?.bookings ||
          response.data?.data ||
          response.data ||
          [];

        const foundBooking = bookingsData.find(
          (item) =>
            item.bookingReference === params.id ||
            item.id === params.id ||
            item._id === params.id
        );

        if (!foundBooking) {
          setError("Booking not found.");
          return;
        }

        setBooking(foundBooking);
      } catch (err) {
        console.error("Failed to fetch booking:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load booking details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchBooking();
    }
  }, [params?.id]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) {
      return "₦0";
    }

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatus = () => {
    return String(booking?.bookingStatus || "pending").toLowerCase();
  };

  const handleCancelBooking = async () => {
    try {
      setActionLoading(true);

      await API.patch(
        `/admin/bookings/${booking._id}/status`,
        {
          status: "cancelled",
        }
      );

      setBooking((current) => ({
        ...current,
        bookingStatus: "cancelled",
      }));

      setShowCancelModal(false);
      setShowActions(false);
    } catch (err) {
      console.error("Failed to cancel booking:", err);

      alert(
        err.response?.data?.message ||
          "Failed to cancel booking."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="lg:ml-72">
          <AdminNavbar />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#63E6BE]" />

                  <p className="mt-4 text-sm text-gray-500">
                    Loading booking details...
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="lg:ml-72">
          <AdminNavbar />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                <ArrowLeft size={17} />
                Back to bookings
              </button>

              <div className="mt-8 rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <XCircle size={24} />
                </div>

                <h2 className="mt-4 text-lg font-bold text-gray-900">
                  Unable to load booking
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {error || "Booking not found."}
                </p>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="mt-5 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Back to bookings
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const status = getStatus();

  const guest = booking.guest || booking.user || {};
  const accommodation =
    booking.accommodation || booking.property || {};

  const safetyContact = booking.safetyContact || {};

  const accommodationLocation =
    accommodation.location || {};

  const payment = booking.payment || {};

  const bookingReference =
    booking.bookingReference || booking.id;

  const accommodationAmount =
    booking.accommodationAmount ?? 0;

  const serviceFee = booking.serviceFee ?? 0;

  const protectionFee =
    booking.protectionFee ??
    booking.safetyProtectionFee ??
    0;

  const totalAmount =
    booking.totalAmount ??
    payment.amount ??
    0;

  const paymentStatus =
    booking.paymentStatus || payment.status || "pending";

  const paymentReference =
    booking.paymentReference ||
    payment.reference ||
    "—";

  const paymentMethod =
    booking.paymentMethod ||
    payment.method ||
    "Paystack";

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="lg:ml-72">
        <AdminNavbar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">

            {/* Back */}
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              <ArrowLeft size={17} />
              Back to bookings
            </button>

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Booking {bookingReference}
                  </h1>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[status] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {status === "cancelled" ? (
                      <XCircle size={13} />
                    ) : status === "pending" ? (
                      <Clock3 size={13} />
                    ) : (
                      <CheckCircle2 size={13} />
                    )}

                    {statusLabels[status] || status}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Created on{" "}
                  {formatDateTime(booking.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <FileText size={16} />
                  Download Receipt
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowActions((current) => !current)
                    }
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:bg-gray-50"
                    aria-label="Booking actions"
                  >
                    <MoreHorizontal size={19} />
                  </button>

                  {showActions && (
                    <div className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
                      {status !== "cancelled" &&
                        status !== "completed" && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowActions(false);
                              setShowCancelModal(true);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            <Ban size={16} />
                            Cancel booking
                          </button>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking overview */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <SummaryCard
                icon={CalendarCheck}
                label="Check-in"
                value={formatDate(booking.checkInDate)}
                iconClass="bg-blue-50 text-blue-600"
              />

              <SummaryCard
                icon={CalendarCheck}
                label="Check-out"
                value={formatDate(booking.checkOutDate)}
                iconClass="bg-violet-50 text-violet-600"
              />

              <SummaryCard
                icon={Clock3}
                label="Duration"
                value={`${booking.totalNights || 0} nights`}
                iconClass="bg-amber-50 text-amber-600"
              />

              <SummaryCard
                icon={CreditCard}
                label="Total paid"
                value={formatCurrency(totalAmount)}
                iconClass="bg-emerald-50 text-emerald-600"
              />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

              {/* Main column */}
              <div className="space-y-6 lg:col-span-2">

                {/* Accommodation */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Accommodation
                    </h2>

                    {accommodation._id && (
                      <Link
                        href={`/admin/accommodations/${accommodation._id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#159669] hover:underline"
                      >
                        View property
                        <ArrowUpRight size={14} />
                      </Link>
                    )}
                  </div>

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                    <img
                      src={
                        accommodation.images?.[0] ||
                        accommodation.image ||
                        "/placeholder-property.jpg"
                      }
                      alt={
                        accommodation.name ||
                        "Accommodation"
                      }
                      className="h-36 w-full rounded-xl object-cover sm:h-28 sm:w-40"
                    />

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {accommodation.name ||
                            "Unknown accommodation"}
                        </h3>

                        {accommodation.type && (
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                            {accommodation.type}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <span>
                          {accommodationLocation.address ||
                            accommodation.address ||
                            "Address unavailable"}
                          {accommodationLocation.city &&
                            `, ${accommodationLocation.city}`}
                          {accommodationLocation.state &&
                            `, ${accommodationLocation.state}`}
                        </span>
                      </div>

                      {accommodation.propertyWebsite && (
                        <a
                          href={
                            accommodation.propertyWebsite
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#159669] hover:underline"
                        >
                          <Globe size={14} />
                          Visit website
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </section>

                {/* Guest */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Guest Information
                    </h2>

                    {guest.isVerified && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <BadgeCheck size={15} />
                        Verified guest
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#63E6BE]/15 text-[#159669]">
                      <UserRound size={24} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {guest.name ||
                          `${guest.firstName || ""} ${
                            guest.lastName || ""
                          }`.trim() ||
                          "Guest"}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        Guest
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">
                    <ContactItem
                      icon={Mail}
                      value={
                        guest.email || "No email available"
                      }
                    />

                    <ContactItem
                      icon={Phone}
                      value={
                        guest.phone || "No phone available"
                      }
                    />
                  </div>
                </section>

                {/* Stay details */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Stay Details
                  </h2>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <DetailBox
                      icon={CalendarCheck}
                      label="Check-in"
                      value={formatDate(
                        booking.checkInDate
                      )}
                    />

                    <DetailBox
                      icon={CalendarCheck}
                      label="Check-out"
                      value={formatDate(
                        booking.checkOutDate
                      )}
                    />

                    <DetailBox
                      icon={BedDouble}
                      label="Room type"
                      value={
                        booking.roomType ||
                        booking.room ||
                        "Standard accommodation"
                      }
                    />

                    <DetailBox
                      icon={Users}
                      label="Guests"
                      value={`${booking.guests || 0} guests`}
                    />
                  </div>
                </section>

                {/* Safety */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#63E6BE]/15 text-[#159669]">
                          <ShieldCheck size={18} />
                        </div>

                        <h2 className="text-lg font-semibold text-gray-900">
                          TripGuard Safety Contact
                        </h2>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        This person receives safety notifications
                        about the guest&apos;s stay.
                      </p>
                    </div>

                    <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 sm:block">
                      Protected
                    </span>
                  </div>

                  {safetyContact.email ||
                  safetyContact.phone ||
                  safetyContact.name ? (
                    <>
                      <div className="mt-5 rounded-xl bg-gray-50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
                            <Heart size={18} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {safetyContact.name ||
                                "Safety contact"}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              {safetyContact.relationship ||
                                "Safety contact"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-200 pt-4 sm:grid-cols-2">
                          <ContactItem
                            icon={Mail}
                            value={
                              safetyContact.email ||
                              "No email available"
                            }
                          />

                          <ContactItem
                            icon={Phone}
                            value={
                              safetyContact.phone ||
                              "No phone available"
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-5 space-y-2">
                        <SafetyNotification
                          title="Booking confirmation"
                          status="Sent"
                          date={formatDateTime(
                            booking.createdAt
                          )}
                        />

                        <SafetyNotification
                          title="Check-in notification"
                          status={
                            booking.safetyNotifications
                              ?.checkInSent
                              ? "Sent"
                              : "Scheduled"
                          }
                          date={formatDate(
                            booking.checkInDate
                          )}
                        />

                        <SafetyNotification
                          title="Check-out notification"
                          status={
                            booking.safetyNotifications
                              ?.checkOutSent
                              ? "Sent"
                              : "Scheduled"
                          }
                          date={formatDate(
                            booking.checkOutDate
                          )}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="mt-5 rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
                      No safety contact was provided for this
                      booking.
                    </div>
                  )}
                </section>

                {/* Payment */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Payment Details
                    </h2>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-600"
                          : paymentStatus === "failed"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {paymentStatus === "paid" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Clock3 size={14} />
                      )}

                      {paymentStatus}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <PriceRow
                      label="Accommodation fee"
                      value={formatCurrency(
                        accommodationAmount
                      )}
                    />

                    <PriceRow
                      label="Service fee"
                      value={formatCurrency(serviceFee)}
                    />

                    {protectionFee > 0 && (
                      <PriceRow
                        label="Safety protection"
                        value={formatCurrency(
                          protectionFee
                        )}
                      />
                    )}

                    <div className="border-t border-gray-100 pt-4">
                      <PriceRow
                        label="Total paid"
                        value={formatCurrency(totalAmount)}
                        strong
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-400">
                        Payment reference
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-gray-800">
                        {paymentReference}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Payment method
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {paymentMethod}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-400">
                        Paid on
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {formatDateTime(
                          booking.paidAt ||
                            payment.paidAt ||
                            booking.updatedAt
                        )}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="space-y-6">

                {/* Timeline */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h2 className="font-semibold text-gray-900">
                    Booking Timeline
                  </h2>

                  <div className="mt-6">
                    <TimelineItem
                      title="Booking created"
                      description="The booking was created."
                      date={formatDate(
                        booking.createdAt
                      )}
                      completed
                    />

                    <TimelineItem
                      title="Payment"
                      description={
                        paymentStatus === "paid"
                          ? "Payment was successfully completed."
                          : `Payment status: ${paymentStatus}.`
                      }
                      date={formatDateTime(
                        booking.paidAt ||
                          payment.paidAt ||
                          booking.createdAt
                      )}
                      completed={
                        paymentStatus === "paid"
                      }
                    />

                    <TimelineItem
                      title="Check-in"
                      description={
                        status === "checked-in" ||
                        status === "checked-out" ||
                        status === "completed"
                          ? "Guest checked in successfully."
                          : "Guest is scheduled to check in."
                      }
                      date={formatDate(
                        booking.checkInDate
                      )}
                      completed={
                        status === "checked-in" ||
                        status === "checked-out" ||
                        status === "completed"
                      }
                    />

                    <TimelineItem
                      title="Check-out"
                      description={
                        status === "checked-out" ||
                        status === "completed"
                          ? "Guest checked out successfully."
                          : "Guest is scheduled to check out."
                      }
                      date={formatDate(
                        booking.checkOutDate
                      )}
                      completed={
                        status === "checked-out" ||
                        status === "completed"
                      }
                      last
                    />
                  </div>
                </section>

                {/* Quick info */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h2 className="font-semibold text-gray-900">
                    Booking Information
                  </h2>

                  <div className="mt-5 space-y-4">
                    <InfoRow
                      icon={FileText}
                      label="Booking ID"
                      value={bookingReference}
                    />

                    <InfoRow
                      icon={Home}
                      label="Property"
                      value={
                        accommodation.name ||
                        "Unknown"
                      }
                    />

                    <InfoRow
                      icon={Users}
                      label="Guests"
                      value={String(
                        booking.guests || 0
                      )}
                    />

                    <InfoRow
                      icon={Clock3}
                      label="Duration"
                      value={`${booking.totalNights || 0} nights`}
                    />

                    <InfoRow
                      icon={CreditCard}
                      label="Payment"
                      value={paymentStatus}
                    />
                  </div>
                </section>

                {/* Property link */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                    <Home size={20} />
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    Need more property details?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    View the complete accommodation profile,
                    owner information, verification documents,
                    amenities and property history.
                  </p>

                  {accommodation._id && (
                    <Link
                      href={`/admin/accommodations/${accommodation._id}`}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      View Accommodation
                      <ArrowUpRight size={15} />
                    </Link>
                  )}
                </section>
              </div>
            </div>

            {/* Admin actions */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Administrative Actions
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage this booking from the administrator
                    dashboard.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {status !== "cancelled" &&
                    status !== "completed" && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowCancelModal(true)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <XCircle size={17} />
                        Cancel Booking
                      </button>
                    )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Ban size={22} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Cancel this booking?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              This action will cancel booking{" "}
              <span className="font-semibold text-gray-700">
                {bookingReference}
              </span>
              . The guest and accommodation owner may need
              to be notified about the cancellation.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  setShowCancelModal(false)
                }
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleCancelBooking}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading
                  ? "Cancelling..."
                  : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ----------------------------- Components ----------------------------- */

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={19} />
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold leading-5 text-gray-900">
        {value}
      </p>
    </div>
  );
};

const ContactItem = ({
  icon: Icon,
  value,
}) => {
  return (
    <div className="flex items-center gap-2.5 text-sm text-gray-600">
      <Icon
        size={16}
        className="shrink-0 text-gray-400"
      />

      <span className="truncate">
        {value}
      </span>
    </div>
  );
};

const DetailBox = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Icon size={15} />
        {label}
      </div>

      <p className="mt-2 text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
};

const PriceRow = ({
  label,
  value,
  strong = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={`text-sm ${
          strong
            ? "font-semibold text-gray-900"
            : "text-gray-500"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-sm ${
          strong
            ? "text-lg font-bold text-gray-900"
            : "font-medium text-gray-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <Icon
          size={16}
          className="shrink-0 text-gray-400"
        />

        <span className="text-sm text-gray-500">
          {label}
        </span>
      </div>

      <span className="max-w-[55%] truncate text-right text-sm font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
};

const SafetyNotification = ({
  title,
  status,
  date,
}) => {
  const sent = status === "Sent";

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {sent ? (
          <CheckCircle2
            size={17}
            className="text-emerald-500"
          />
        ) : (
          <Clock3
            size={17}
            className="text-amber-500"
          />
        )}

        <div>
          <p className="text-sm font-medium text-gray-800">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-gray-400">
            {date}
          </p>
        </div>
      </div>

      <span
        className={`text-xs font-semibold ${
          sent
            ? "text-emerald-600"
            : "text-amber-600"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

const TimelineItem = ({
  title,
  description,
  date,
  completed,
  last = false,
}) => {
  return (
    <div
      className={`relative flex gap-3 ${
        last ? "" : "pb-7"
      }`}
    >
      {!last && (
        <div className="absolute left-[9px] top-5 h-full w-px bg-gray-200" />
      )}

      <div
        className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          completed
            ? "bg-[#63E6BE] text-gray-900"
            : "border-2 border-gray-200 bg-white text-gray-300"
        }`}
      >
        {completed && <CheckCircle2 size={12} />}
      </div>

      <div className="-mt-0.5 min-w-0">
        <p className="text-sm font-semibold text-gray-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-400">
          {description}
        </p>

        <p className="mt-1 text-[11px] font-medium text-gray-500">
          {date}
        </p>
      </div>
    </div>
  );
};

export default BookingDetailsPage;