"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Heart,
  LogIn,
  LogOut,
  MapPin,
  MessageCircle,
  Plane,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const BookingDetailsPage = () => {
  const [bookingStatus, setBookingStatus] = useState("confirmed");

  const booking = {
    id: "TG-2026-00124",
    property: "The Meridian House",
    location: "Victoria Island, Lagos",
    address: "12 Ahmadu Bello Way, Victoria Island, Lagos",
    checkIn: "Aug 15, 2026",
    checkOut: "Aug 18, 2026",
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 PM",
    guests: 2,
    nights: 3,
    room: "Deluxe King Room",
    amount: "₦185,000",
    roomAmount: "₦165,000",
    serviceFee: "₦12,000",
    protectionFee: "₦8,000",
    rating: "4.8",
    safetyContact: "Sarah Johnson",
    safetyEmail: "sarah@example.com",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=90",
  };

  const handleCheckIn = () => {
    setBookingStatus("checked-in");
  };

  const handleCheckOut = () => {
    setBookingStatus("completed");
  };

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
                {booking.property}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} className="text-[#16a765]" />
                {booking.location}
              </div>
            </div>

            <StatusBadge status={bookingStatus} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Property Image */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="relative h-64 sm:h-80">
                <img
                  src={booking.image}
                  alt={booking.property}
                  className="h-full w-full object-cover"
                />

                <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-semibold text-yellow-700 shadow-sm">
                  <Star size={15} fill="currentColor" />
                  {booking.rating}
                </div>
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
                    Everything you need for your stay.
                  </p>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765] sm:flex">
                  <CalendarDays size={20} />
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InfoItem
                  icon={<CalendarDays size={18} />}
                  label="Check-in"
                  value={booking.checkIn}
                  secondary={booking.checkInTime}
                />

                <InfoItem
                  icon={<CalendarDays size={18} />}
                  label="Check-out"
                  value={booking.checkOut}
                  secondary={booking.checkOutTime}
                />

                <InfoItem
                  icon={<Users size={18} />}
                  label="Guests"
                  value={`${booking.guests} guests`}
                  secondary={`${booking.nights} nights`}
                />

                <InfoItem
                  icon={<Plane size={18} />}
                  label="Room"
                  value={booking.room}
                  secondary="Deluxe accommodation"
                />
              </div>
            </div>

            {/* Property Information */}
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
                    {booking.address}
                  </p>

                  <button
                    type="button"
                    className="mt-3 text-sm font-semibold text-[#16a765] hover:underline"
                  >
                    View on map
                  </button>
                </div>
              </div>
            </div>

            {/* Booking Actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold">
                Manage Booking
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  href="#"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <MessageCircle size={17} />
                  Contact Property
                </Link>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <Heart size={17} />
                  Save Property
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Check-in / Check-out Card */}
            <div className="rounded-2xl bg-gray-900 p-6 text-white shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16a765]">
                <ShieldCheck size={22} />
              </div>

              <h2 className="mt-5 text-lg font-bold">
                TripGuard Protection
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Check in when you arrive and check out when you leave.
                Your safety contact will be updated when your trip ends.
              </p>

              <div className="mt-5 rounded-xl bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Current status
                  </span>

                  <StatusBadge status={bookingStatus} dark />
                </div>
              </div>

              <div className="mt-4">
                {bookingStatus === "confirmed" && (
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16a765] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
                  >
                    <LogIn size={17} />
                    Check In
                  </button>
                )}

                {bookingStatus === "checked-in" && (
                  <button
                    type="button"
                    onClick={handleCheckOut}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                  >
                    <LogOut size={17} />
                    Check Out
                  </button>
                )}

                {bookingStatus === "completed" && (
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16a765]/10 px-4 py-3 text-sm font-semibold text-[#63E6BE]">
                    <CheckCircle2 size={17} />
                    Trip Completed
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

              <div className="mt-5 rounded-xl bg-white p-4">
                <p className="text-sm font-semibold">
                  {booking.safetyContact}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {booking.safetyEmail}
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                Your safety contact will receive your trip information
                and a notification when you check out.
              </p>

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
                  <h2 className="font-bold">Payment Summary</h2>

                  <p className="text-xs text-gray-500">
                    Booking #{booking.id}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <PriceRow
                  label="Room"
                  value={booking.roomAmount}
                />

                <PriceRow
                  label="Service fee"
                  value={booking.serviceFee}
                />

                <PriceRow
                  label="TripGuard protection"
                  value={booking.protectionFee}
                />

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      Total paid
                    </span>

                    <span className="text-lg font-bold">
                      {booking.amount}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <FileText size={17} />
                View Receipt
              </button>
            </div>

            {/* Booking Reference */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <Clock3 size={17} className="text-[#16a765]" />

                <div>
                  <p className="text-xs text-gray-500">
                    Booking reference
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {booking.id}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status, dark = false }) {
  const statusConfig = {
    confirmed: {
      label: "Confirmed",
      icon: <Clock3 size={14} />,
    },
    "checked-in": {
      label: "Checked In",
      icon: <CheckCircle2 size={14} />,
    },
    completed: {
      label: "Completed",
      icon: <CheckCircle2 size={14} />,
    },
  };

  const current = statusConfig[status];

  if (!current) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        dark
          ? "bg-white/10 text-white"
          : status === "completed"
          ? "bg-[#16a765]/10 text-[#16a765]"
          : status === "checked-in"
          ? "bg-blue-50 text-blue-700"
          : "bg-yellow-50 text-yellow-700"
      }`}
    >
      {current.icon}
      {current.label}
    </div>
  );
}

function InfoItem({ icon, label, value, secondary }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-500">{label}</p>

        <p className="mt-1 text-sm font-semibold">
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

function PriceRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>

      <span className="font-medium">{value}</span>
    </div>
  );
}
export default BookingDetailsPage;