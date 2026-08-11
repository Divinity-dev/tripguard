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
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TravellerBookingsPage() {
  const [bookingStatus, setBookingStatus] = useState("confirmed");

  const bookings = {
    upcoming: {
      id: "TG-2026-00124",
      property: "The Meridian House",
      location: "Victoria Island, Lagos",
      checkIn: "Aug 15, 2026",
      checkOut: "Aug 18, 2026",
      guests: 2,
      amount: "₦185,000",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    },

    active: {
      id: "TG-2026-00098",
      property: "Palm Court Residence",
      location: "Lekki Phase 1, Lagos",
      checkIn: "Aug 10, 2026",
      checkOut: "Aug 13, 2026",
      guests: 1,
      amount: "₦120,000",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    },

    completed: [
      {
        id: "TG-2026-00076",
        property: "Cedar View Suites",
        location: "Ikeja, Lagos",
        checkIn: "Jul 20, 2026",
        checkOut: "Jul 23, 2026",
        guests: 2,
        amount: "₦145,000",
        rating: "4.9",
        image:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "TG-2026-00051",
        property: "The Garden Residence",
        location: "Yaba, Lagos",
        checkIn: "Jun 12, 2026",
        checkOut: "Jun 15, 2026",
        guests: 1,
        amount: "₦95,000",
        rating: "4.6",
        image:
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      },
    ],
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium text-[#16a765]">
              Traveller Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              My Bookings
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              View and manage all your TripGuard stays.
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
            value="1"
            description="Your next trip"
          />

          <SummaryCard
            icon={<Plane size={20} />}
            title="Active"
            value="1"
            description="Currently staying"
          />

          <SummaryCard
            icon={<CheckCircle2 size={20} />}
            title="Completed"
            value="10"
            description="Past trips"
          />
        </section>

        {/* Upcoming */}
        <section className="mt-10">
          <SectionHeading
            title="Upcoming Trip"
            description="Your next TripGuard-protected stay."
          />

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[280px_1fr]">
              {/* Image */}
              <div className="relative h-56 lg:h-full lg:min-h-[280px]">
                <img
                  src={bookings.upcoming.image}
                  alt={bookings.upcoming.property}
                  className="h-full w-full object-cover"
                />

                <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#16a765] shadow-sm">
                  {bookingStatus === "confirmed" && "Confirmed"}
                  {bookingStatus === "checked-in" && "Checked In"}
                  {bookingStatus === "completed" && "Completed"}
                </div>
              </div>

              {/* Details */}
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {bookings.upcoming.property}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin
                        size={16}
                        className="text-[#16a765]"
                      />
                      {bookings.upcoming.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700">
                    <Star size={15} fill="currentColor" />
                    {bookings.upcoming.rating}
                  </div>
                </div>

                <div className="my-5 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-3">
                  <BookingDetail
                    icon={<CalendarDays size={17} />}
                    label="Check-in"
                    value={bookings.upcoming.checkIn}
                  />

                  <BookingDetail
                    icon={<CalendarDays size={17} />}
                    label="Check-out"
                    value={bookings.upcoming.checkOut}
                  />

                  <BookingDetail
                    icon={<Plane size={17} />}
                    label="Guests"
                    value={`${bookings.upcoming.guests} guests`}
                  />
                </div>

                {/* Protection */}
                <div className="flex gap-3 rounded-xl border border-[#16a765]/20 bg-[#16a765]/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16a765]/10 text-[#16a765]">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      TripGuard Protection Active
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your safety contact will be notified when you
                      check out.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/dashboard/traveller/bookings/${bookings.upcoming.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    View Booking
                    <ArrowRight size={16} />
                  </Link>

                  {bookingStatus === "confirmed" && (
                    <button
                      type="button"
                      onClick={handleCheckIn}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16a765] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
                    >
                      <LogIn size={17} />
                      Check In
                    </button>
                  )}

                  {bookingStatus === "checked-in" && (
                    <button
                      type="button"
                      onClick={handleCheckOut}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      <LogOut size={17} />
                      Check Out
                    </button>
                  )}

                  {bookingStatus === "completed" && (
                    <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16a765]/10 px-4 py-3 text-sm font-semibold text-[#16a765]">
                      <CheckCircle2 size={17} />
                      Trip Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Booking */}
        <section className="mt-10">
          <SectionHeading
            title="Active Stay"
            description="Your current TripGuard-protected accommodation."
          />

          <div className="mt-5 overflow-hidden rounded-2xl border border-[#16a765]/20 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[240px_1fr]">
              <div className="relative h-52 lg:h-full lg:min-h-[240px]">
                <img
                  src={bookings.active.image}
                  alt={bookings.active.property}
                  className="h-full w-full object-cover"
                />

                <div className="absolute left-4 top-4 rounded-full bg-[#16a765] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                  Currently Staying
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {bookings.active.property}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin
                        size={16}
                        className="text-[#16a765]"
                      />
                      {bookings.active.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700">
                    <Star size={15} fill="currentColor" />
                    {bookings.active.rating}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <BookingDetail
                    icon={<CalendarDays size={17} />}
                    label="Check-in"
                    value={bookings.active.checkIn}
                  />

                  <BookingDetail
                    icon={<CalendarDays size={17} />}
                    label="Check-out"
                    value={bookings.active.checkOut}
                  />

                  <BookingDetail
                    icon={<Plane size={17} />}
                    label="Guests"
                    value={`${bookings.active.guests} guest`}
                  />
                </div>

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
                      Your safety contact knows about this trip.
                      Checking out will trigger your safety notification.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/dashboard/traveller/bookings/${bookings.active.id}`}
                    className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    View Booking
                  </Link>

                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    <LogOut size={17} />
                    Check Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Completed */}
        <section className="mt-10">
          <SectionHeading
            title="Completed Trips"
            description="Your previous TripGuard stays."
          />

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {bookings.completed.map((booking) => (
              <div
                key={booking.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="relative h-48">
                  <img
                    src={booking.image}
                    alt={booking.property}
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

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold">
                        {booking.property}
                      </h3>

                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <MapPin
                          size={14}
                          className="text-[#16a765]"
                        />
                        {booking.location}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm font-semibold text-yellow-700">
                      <Star size={14} fill="currentColor" />
                      {booking.rating}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                    <BookingDetail
                      icon={<CalendarDays size={15} />}
                      label="Check-in"
                      value={booking.checkIn}
                    />

                    <BookingDetail
                      icon={<CalendarDays size={15} />}
                      label="Check-out"
                      value={booking.checkOut}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">
                        Booking amount
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {booking.amount}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/traveller/bookings/${booking.id}`}
                      className="flex items-center gap-1 text-sm font-semibold text-[#16a765]"
                    >
                      View details
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ icon, title, value, description }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
          {icon}
        </div>

        <span className="text-2xl font-bold">{value}</span>
      </div>

      <p className="mt-4 text-sm font-semibold">{title}</p>

      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}

function SectionHeading({ title, description }) {
  return (
    <div>
      <h2 className="text-xl font-bold">{title}</h2>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

function BookingDetail({ icon, label, value }) {
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

