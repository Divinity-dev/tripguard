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
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TravellerDashboard() {
  const [bookingStatus, setBookingStatus] = useState("confirmed");

  const booking = {
    id: "TG-2026-00124",
    property: "The Meridian House",
    location: "Victoria Island, Lagos",
    checkIn: "Aug 15, 2026",
    checkOut: "Aug 18, 2026",
    guests: 2,
    amount: "₦185,000",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
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
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#16a765]">
                Traveller Dashboard
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, Divine 👋
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Manage your trips, bookings and TripGuard protection.
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
                href="/dashboard/traveller/profile"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16a765] font-semibold text-white"
              >
                D
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<CalendarDays size={20} />}
            title="Total Trips"
            value="12"
            description="All your trips"
          />

          <StatCard
            icon={<Clock3 size={20} />}
            title="Upcoming"
            value="1"
            description="Trip coming up"
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            title="Completed"
            value="10"
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
                <h2 className="text-xl font-bold">Upcoming Trip</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your next TripGuard-protected stay.
                </p>
              </div>

              <Link
                href="/dashboard/traveller/bookings"
                className="hidden items-center gap-1 text-sm font-semibold text-[#16a765] sm:flex"
              >
                All bookings
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Property Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={booking.image}
                  alt={booking.property}
                  className="h-full w-full object-cover"
                />

                <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#16a765] shadow-sm">
                  {bookingStatus === "confirmed" && "Confirmed"}
                  {bookingStatus === "checked-in" && "Checked In"}
                  {bookingStatus === "completed" && "Completed"}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* Property Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {booking.property}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} className="text-[#16a765]" />
                      {booking.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700">
                    <Star size={15} fill="currentColor" />
                    4.8
                  </div>
                </div>

                {/* Trip Details */}
                <div className="my-5 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-3">
                  <TripDetail
                    icon={<CalendarDays size={17} />}
                    label="Check-in"
                    value={booking.checkIn}
                  />

                  <TripDetail
                    icon={<CalendarDays size={17} />}
                    label="Check-out"
                    value={booking.checkOut}
                  />

                  <TripDetail
                    icon={<Plane size={17} />}
                    label="Guests"
                    value={`${booking.guests} guests`}
                  />
                </div>

                {/* Protection */}
                <div className="flex gap-3 rounded-xl border border-[#16a765]/20 bg-[#16a765]/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16a765]/10 text-[#16a765]">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      TripGuard Protection Active
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your safety contact will receive an update when you
                      check out.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/dashboard/traveller/bookings/${booking.id}`}
                    className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    View Booking
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
                Your loved one will receive your trip details and checkout
                notification, helping them know you're safe.
              </p>

              <div className="mt-5 rounded-xl bg-white/5 p-4">
                <p className="text-xs text-gray-400">
                  Safety contact
                </p>

                <p className="mt-1 text-sm font-semibold">
                  Sarah Johnson
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  sarah@example.com
                </p>
              </div>

              <Link
                href="/dashboard/traveller/profile"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#63E6BE]"
              >
                Manage protection
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Recent Activity</h3>

                <Link
                  href="/dashboard/traveller/bookings"
                  className="text-xs font-semibold text-[#16a765]"
                >
                  View all
                </Link>
              </div>

              <div className="mt-5 space-y-5">
                <ActivityItem
                  icon={<CheckCircle2 size={17} />}
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
          <h2 className="text-xl font-bold">Quick Access</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickLink
              href="/traveller/bookings"
              icon={<CalendarDays size={20} />}
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
              icon={<ShieldCheck size={20} />}
              title="Profile & Safety"
              description="Manage your account"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ icon, title, value, description }) {
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

function TripDetail({ icon, label, value }) {
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

function ActivityItem({ icon, title, description, time }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16a765]/10 text-[#16a765]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>

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

function QuickLink({ href, icon, title, description }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#16a765]/30 hover:shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition group-hover:bg-[#16a765]/10 group-hover:text-[#16a765]">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold">{title}</h3>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </Link>
  );
}

