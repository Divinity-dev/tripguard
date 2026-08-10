"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock3,
  DollarSign,
  Plus,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const properties = [
  {
    name: "The Meridian House",
    location: "Victoria Island, Lagos",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=85",
    status: "Active",
    bookings: 12,
    rating: "4.9",
  },
  {
    name: "Palm Court Residence",
    location: "Lekki Phase 1, Lagos",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=500&q=85",
    status: "Active",
    bookings: 9,
    rating: "4.8",
  },
  {
    name: "Cedar View Suites",
    location: "Wuse 2, Abuja",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=500&q=85",
    status: "Pending",
    bookings: 0,
    rating: "—",
  },
];

const recentBookings = [
  {
    guest: "Amaka Okafor",
    property: "The Meridian House",
    dates: "Aug 14 – Aug 17",
    guests: "2 guests",
    amount: "₦555,000",
    status: "Confirmed",
    initials: "AO",
  },
  {
    guest: "Daniel Williams",
    property: "Palm Court Residence",
    dates: "Aug 18 – Aug 20",
    guests: "2 guests",
    amount: "₦190,000",
    status: "Confirmed",
    initials: "DW",
  },
  {
    guest: "Sarah Adeyemi",
    property: "The Meridian House",
    dates: "Aug 22 – Aug 25",
    guests: "1 guest",
    amount: "₦555,000",
    status: "Pending",
    initials: "SA",
  },
];

const stats = [
  {
    title: "Properties",
    value: "3",
    description: "2 active listings",
    icon: Building2,
  },
  {
    title: "Bookings",
    value: "28",
    description: "8 this month",
    icon: CalendarDays,
  },
  {
    title: "Guests",
    value: "46",
    description: "Across your properties",
    icon: Users,
  },
  {
    title: "Earnings",
    value: "₦2.4M",
    description: "+18.4% this month",
    icon: DollarSign,
  },
];

export default function OwnerPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F2] text-[#172322]">
      {/* PAGE HEADER */}
      <section className="border-b border-[#E4E3DC] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
                Owner dashboard
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-[#75817D]">
                Here's what's happening with your properties.
              </p>
            </div>

            <Link
              href="/owner/properties/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#23584E]"
            >
              <Plus className="h-4 w-4" />
              Add property
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* STAT CARDS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-[22px] border border-[#E3E3DC] bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#75817D]">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#173C37]">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E1F5ED]">
                    <Icon className="h-5 w-5 text-[#277765]" />
                  </div>
                </div>

                <p className="mt-4 text-xs text-[#7A8581]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* OVERVIEW GRID */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* MY PROPERTIES */}
            <div className="rounded-[26px] border border-[#E3E3DC] bg-white">
              <div className="flex items-center justify-between border-b border-[#ECEBE5] px-6 py-5">
                <div>
                  <h2 className="text-xl font-semibold">
                    My properties
                  </h2>

                  <p className="mt-1 text-sm text-[#7A8581]">
                    Manage your accommodation listings.
                  </p>
                </div>

                <Link
                  href="/owner/properties"
                  className="hidden items-center gap-1 text-sm font-semibold text-[#397A69] transition hover:text-[#173C37] sm:flex"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="divide-y divide-[#ECEBE5]">
                {properties.map((property) => (
                  <div
                    key={property.name}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#E8ECE9]">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold">
                            {property.name}
                          </h3>

                          {property.status === "Active" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#E1F5ED] px-2.5 py-1 text-[10px] font-bold text-[#277765]">
                              <CircleCheck className="h-3 w-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4D6] px-2.5 py-1 text-[10px] font-bold text-[#967126]">
                              <Clock3 className="h-3 w-3" />
                              Pending
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-[#7A8581]">
                          {property.location}
                        </p>

                        <div className="mt-2 flex items-center gap-4 text-xs text-[#7A8581]">
                          <span>
                            {property.bookings} bookings
                          </span>

                          {property.rating !== "—" && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]" />
                              {property.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/owner/properties"
                      className="flex items-center justify-center gap-1 rounded-xl border border-[#DCE2DF] px-4 py-2.5 text-xs font-semibold text-[#173C37] transition hover:border-[#173C37] hover:bg-[#F7F8F4]"
                    >
                      Manage
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#ECEBE5] p-4 sm:hidden">
                <Link
                  href="/owner/properties"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#DCE2DF] py-3 text-sm font-semibold text-[#173C37]"
                >
                  View all properties
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* RECENT BOOKINGS */}
            <div className="rounded-[26px] border border-[#E3E3DC] bg-white">
              <div className="flex items-center justify-between border-b border-[#ECEBE5] px-6 py-5">
                <div>
                  <h2 className="text-xl font-semibold">
                    Recent bookings
                  </h2>

                  <p className="mt-1 text-sm text-[#7A8581]">
                    Your latest reservations.
                  </p>
                </div>

                <Link
                  href="/owner/bookings"
                  className="hidden items-center gap-1 text-sm font-semibold text-[#397A69] transition hover:text-[#173C37] sm:flex"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="divide-y divide-[#ECEBE5]">
                {recentBookings.map((booking) => (
                  <div
                    key={`${booking.guest}-${booking.property}`}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#173C37] text-xs font-bold text-[#63E6BE]">
                        {booking.initials}
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {booking.guest}
                        </p>

                        <p className="mt-1 text-xs text-[#7A8581]">
                          {booking.property}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:flex sm:items-center">
                      <div>
                        <p className="text-[#9AA29F]">
                          Stay
                        </p>

                        <p className="mt-1 font-medium text-[#596661]">
                          {booking.dates}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#9AA29F]">
                          Amount
                        </p>

                        <p className="mt-1 font-semibold text-[#173C37]">
                          {booking.amount}
                        </p>
                      </div>

                      <span
                        className={`col-span-2 inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold sm:col-span-1 ${
                          booking.status === "Confirmed"
                            ? "bg-[#E1F5ED] text-[#277765]"
                            : "bg-[#FFF4D6] text-[#967126]"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-8">
            {/* PERFORMANCE */}
            <div className="rounded-[26px] bg-[#173C37] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#63E6BE]">
                    Performance
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    This month
                  </h2>
                </div>

                <TrendingUp className="h-5 w-5 text-[#63E6BE]" />
              </div>

              <div className="mt-7">
                <p className="text-3xl font-bold">
                  ₦2.4M
                </p>

                <p className="mt-1 text-sm text-white/55">
                  Total earnings
                </p>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-[#63E6BE]" />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-white/55">
                  Compared to last month
                </span>

                <span className="font-semibold text-[#63E6BE]">
                  +18.4%
                </span>
              </div>

              <Link
                href="/owner/bookings"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                View earnings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* SUBSCRIPTION */}
            <div className="rounded-[26px] border border-[#DCE6E2] bg-[#F0F7F4] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
                Your plan
              </p>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#173C37]">
                    Free plan
                  </h2>

                  <p className="mt-1 text-xs text-[#75817D]">
                    Perfect for getting started
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#277765]">
                  ACTIVE
                </span>
              </div>

              <div className="mt-5 border-t border-[#D9E5E0] pt-5">
                <div className="flex items-center gap-2 text-sm text-[#596661]">
                  <CircleCheck className="h-4 w-4 text-[#397A69]" />
                  List your properties
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-[#596661]">
                  <CircleCheck className="h-4 w-4 text-[#397A69]" />
                  Receive bookings
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-[#596661]">
                  <CircleCheck className="h-4 w-4 text-[#397A69]" />
                  Manage your listings
                </div>
              </div>

              <Link
                href="/owner/subscription"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#397A69] bg-white py-3 text-sm font-semibold text-[#277765] transition hover:bg-[#173C37] hover:text-white"
              >
                Manage subscription
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* QUICK ACTIONS */}
            <div className="rounded-[26px] border border-[#E3E3DC] bg-white p-6">
              <h2 className="text-lg font-semibold">
                Quick actions
              </h2>

              <div className="mt-4 space-y-2">
                <Link
                  href="/owner/properties/new"
                  className="flex items-center justify-between rounded-xl bg-[#F4F6F2] px-4 py-3.5 text-sm font-medium text-[#173C37] transition hover:bg-[#E8EEE9]"
                >
                  <span className="flex items-center gap-3">
                    <Plus className="h-4 w-4 text-[#397A69]" />
                    Add a property
                  </span>

                  <ChevronRight className="h-4 w-4 text-[#8A9390]" />
                </Link>

                <Link
                  href="/owner/bookings"
                  className="flex items-center justify-between rounded-xl bg-[#F4F6F2] px-4 py-3.5 text-sm font-medium text-[#173C37] transition hover:bg-[#E8EEE9]"
                >
                  <span className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-[#397A69]" />
                    View bookings
                  </span>

                  <ChevronRight className="h-4 w-4 text-[#8A9390]" />
                </Link>

                <Link
                  href="/owner/reviews"
                  className="flex items-center justify-between rounded-xl bg-[#F4F6F2] px-4 py-3.5 text-sm font-medium text-[#173C37] transition hover:bg-[#E8EEE9]"
                >
                  <span className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-[#397A69]" />
                    View reviews
                  </span>

                  <ChevronRight className="h-4 w-4 text-[#8A9390]" />
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}