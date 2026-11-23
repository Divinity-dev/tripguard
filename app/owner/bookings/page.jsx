"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Search,
  Users,
  XCircle,
} from "lucide-react";

const bookings = [
  {
    id: "TG-1028",
    guest: "Amaka Okafor",
    initials: "AO",
    property: "The Meridian House",
    location: "Victoria Island, Lagos",
    checkIn: "Aug 14, 2026",
    checkOut: "Aug 17, 2026",
    guests: 2,
    nights: 3,
    amount: "₦555,000",
    status: "Confirmed",
    bookedOn: "Aug 8, 2026",
    nextOfKin: "family@example.com",
  },
  {
    id: "TG-1027",
    guest: "Daniel Williams",
    initials: "DW",
    property: "Palm Court Residence",
    location: "Lekki Phase 1, Lagos",
    checkIn: "Aug 18, 2026",
    checkOut: "Aug 20, 2026",
    guests: 2,
    nights: 2,
    amount: "₦190,000",
    status: "Confirmed",
    bookedOn: "Aug 7, 2026",
    nextOfKin: "daniel.family@example.com",
  },
  {
    id: "TG-1026",
    guest: "Sarah Adeyemi",
    initials: "SA",
    property: "The Meridian House",
    location: "Victoria Island, Lagos",
    checkIn: "Aug 22, 2026",
    checkOut: "Aug 25, 2026",
    guests: 1,
    nights: 3,
    amount: "₦555,000",
    status: "Pending",
    bookedOn: "Aug 7, 2026",
    nextOfKin: "sarah.contact@example.com",
  },
  {
    id: "TG-1025",
    guest: "Chinedu Okoro",
    initials: "CO",
    property: "Palm Court Residence",
    location: "Lekki Phase 1, Lagos",
    checkIn: "Aug 26, 2026",
    checkOut: "Aug 29, 2026",
    guests: 2,
    nights: 3,
    amount: "₦285,000",
    status: "Confirmed",
    bookedOn: "Aug 6, 2026",
    nextOfKin: "chinedu.contact@example.com",
  },
  {
    id: "TG-1024",
    guest: "Fatima Bello",
    initials: "FB",
    property: "Cedar View Suites",
    location: "Wuse 2, Abuja",
    checkIn: "Sep 2, 2026",
    checkOut: "Sep 5, 2026",
    guests: 2,
    nights: 3,
    amount: "₦360,000",
    status: "Pending",
    bookedOn: "Aug 5, 2026",
    nextOfKin: "fatima.contact@example.com",
  },
  {
    id: "TG-1023",
    guest: "David James",
    initials: "DJ",
    property: "Cedar View Suites",
    location: "Wuse 2, Abuja",
    checkIn: "Jul 29, 2026",
    checkOut: "Aug 1, 2026",
    guests: 1,
    nights: 3,
    amount: "₦360,000",
    status: "Completed",
    bookedOn: "Jul 20, 2026",
    nextOfKin: "david.contact@example.com",
  },
  {
    id: "TG-1022",
    guest: "Grace Nwosu",
    initials: "GN",
    property: "The Meridian House",
    location: "Victoria Island, Lagos",
    checkIn: "Jul 25, 2026",
    checkOut: "Jul 27, 2026",
    guests: 2,
    nights: 2,
    amount: "₦370,000",
    status: "Completed",
    bookedOn: "Jul 18, 2026",
    nextOfKin: "grace.contact@example.com",
  },
  {
    id: "TG-1021",
    guest: "Ibrahim Musa",
    initials: "IM",
    property: "Palm Court Residence",
    location: "Lekki Phase 1, Lagos",
    checkIn: "Jul 20, 2026",
    checkOut: "Jul 22, 2026",
    guests: 2,
    nights: 2,
    amount: "₦190,000",
    status: "Cancelled",
    bookedOn: "Jul 12, 2026",
    nextOfKin: "ibrahim.contact@example.com",
  },
];

const statCards = [
  {
    label: "Total bookings",
    value: "28",
    description: "All reservations",
    icon: CalendarDays,
  },
  {
    label: "Upcoming",
    value: "8",
    description: "Future stays",
    icon: Clock3,
  },
  {
    label: "Completed",
    value: "17",
    description: "Successful stays",
    icon: CheckCircle2,
  },
  {
    label: "Guests",
    value: "46",
    description: "Total guests",
    icon: Users,
  },
];

const filters = [
  "All bookings",
  "Upcoming",
  "Pending",
  "Completed",
  "Cancelled",
];

export default function OwnerBookingsPage() {
  const [activeFilter, setActiveFilter] = useState("All bookings");
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All properties");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.guest.toLowerCase().includes(search.toLowerCase()) ||
        booking.property.toLowerCase().includes(search.toLowerCase()) ||
        booking.id.toLowerCase().includes(search.toLowerCase());

      const matchesProperty =
        propertyFilter === "All properties" ||
        booking.property === propertyFilter;

      let matchesStatus = true;

      if (activeFilter === "Upcoming") {
        matchesStatus =
          booking.status === "Confirmed" ||
          booking.status === "Pending";
      } else if (activeFilter === "Pending") {
        matchesStatus = booking.status === "Pending";
      } else if (activeFilter === "Completed") {
        matchesStatus = booking.status === "Completed";
      } else if (activeFilter === "Cancelled") {
        matchesStatus = booking.status === "Cancelled";
      }

      return matchesSearch && matchesProperty && matchesStatus;
    });
  }, [activeFilter, propertyFilter, search]);

  return (
    <main className="min-h-screen bg-[#F7F7F2] text-[#172322]">
      {/* HEADER */}
      <section className="border-b border-[#E4E3DC] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
                Reservations
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Bookings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#75817D]">
                View and manage reservations across all your properties.
              </p>
            </div>

            <Link
              href="/owner/properties"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE2DF] bg-white px-5 py-3 text-sm font-semibold text-[#173C37] transition hover:border-[#173C37] hover:bg-[#F7F8F4]"
            >
              Manage properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* STATS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-[22px] border border-[#E3E3DC] bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#75817D]">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#173C37]">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E1F5ED]">
                    <Icon className="h-5 w-5 text-[#277765]" />
                  </div>
                </div>

                <p className="mt-4 text-xs text-[#8A9390]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* BOOKINGS */}
        <section className="mt-8 overflow-hidden rounded-[26px] border border-[#E3E3DC] bg-white">
          {/* TOP CONTROLS */}
          <div className="border-b border-[#ECEBE5] p-5 sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              {/* FILTER TABS */}
              <div className="flex gap-1 overflow-x-auto rounded-xl bg-[#F3F5F1] p-1">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                      activeFilter === filter
                        ? "bg-white text-[#173C37] shadow-sm"
                        : "text-[#7A8581] hover:text-[#173C37]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* SEARCH + PROPERTY */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9390]" />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search bookings..."
                    className="h-11 w-full rounded-xl border border-[#DCE2DF] bg-white pl-10 pr-4 text-sm text-[#172322] outline-none transition placeholder:text-[#9AA29F] focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10 sm:w-64"
                  />
                </div>

                <div className="relative">
                  <select
                    value={propertyFilter}
                    onChange={(event) =>
                      setPropertyFilter(event.target.value)
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-[#DCE2DF] bg-white px-4 pr-10 text-sm font-medium text-[#596661] outline-none transition focus:border-[#397A69] sm:w-52"
                  >
                    <option>All properties</option>
                    <option>The Meridian House</option>
                    <option>Palm Court Residence</option>
                    <option>Cedar View Suites</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9390]" />
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#ECEBE5] bg-[#FAFAF7] text-left">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#8A9390]">
                    Guest
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#8A9390]">
                    Property
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#8A9390]">
                    Stay
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#8A9390]">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#8A9390]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-[#8A9390]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-[#ECEBE5] last:border-0 transition hover:bg-[#FBFBF8]"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173C37] text-xs font-bold text-[#63E6BE]">
                          {booking.initials}
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            {booking.guest}
                          </p>

                          <p className="mt-0.5 text-[11px] text-[#8A9390]">
                            {booking.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium">
                        {booking.property}
                      </p>

                      <p className="mt-1 text-xs text-[#8A9390]">
                        {booking.location}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium">
                        {booking.checkIn}
                      </p>

                      <p className="mt-1 text-xs text-[#8A9390]">
                        to {booking.checkOut} · {booking.nights} nights
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-[#173C37]">
                        {booking.amount}
                      </p>

                      <p className="mt-1 text-xs text-[#8A9390]">
                        {booking.guests}{" "}
                        {booking.guests === 1 ? "guest" : "guests"}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={booking.status} />
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE2DF] px-3 py-2 text-xs font-semibold text-[#173C37] transition hover:border-[#173C37] hover:bg-[#F7F8F4]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="divide-y divide-[#ECEBE5] lg:hidden">
            {filteredBookings.map((booking) => (
              <article key={booking.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#173C37] text-xs font-bold text-[#63E6BE]">
                      {booking.initials}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {booking.guest}
                      </p>

                      <p className="mt-0.5 text-xs text-[#8A9390]">
                        {booking.id}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-5 rounded-xl bg-[#F8F8F4] p-4">
                  <p className="text-sm font-semibold">
                    {booking.property}
                  </p>

                  <p className="mt-1 text-xs text-[#8A9390]">
                    {booking.location}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA29F]">
                        Check in
                      </p>

                      <p className="mt-1 text-xs font-medium">
                        {booking.checkIn}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA29F]">
                        Check out
                      </p>

                      <p className="mt-1 text-xs font-medium">
                        {booking.checkOut}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA29F]">
                        Guests
                      </p>

                      <p className="mt-1 text-xs font-medium">
                        {booking.guests}{" "}
                        {booking.guests === 1 ? "guest" : "guests"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA29F]">
                        Total
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#173C37]">
                        {booking.amount}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(booking)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCE2DF] py-3 text-xs font-semibold text-[#173C37] transition hover:border-[#173C37] hover:bg-[#F7F8F4]"
                >
                  <Eye className="h-4 w-4" />
                  View booking details
                </button>
              </article>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredBookings.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E1F5ED]">
                <Search className="h-6 w-6 text-[#397A69]" />
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                No bookings found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7A8581]">
                Try changing your search or filters to find the
                booking you're looking for.
              </p>
            </div>
          )}

          {/* FOOTER */}
          {filteredBookings.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-[#ECEBE5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-[#8A9390]">
                Showing{" "}
                <span className="font-semibold text-[#596661]">
                  {filteredBookings.length}
                </span>{" "}
                bookings
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-[#E1E3DF] px-3 py-2 text-xs font-semibold text-[#B0B6B3]"
                >
                  Previous
                </button>

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#173C37] text-xs font-bold text-white">
                  1
                </span>

                <button
                  type="button"
                  className="rounded-lg border border-[#E1E3DF] px-3 py-2 text-xs font-semibold text-[#596661] transition hover:bg-[#F7F8F4]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            onClick={() => setSelectedBooking(null)}
            className="absolute inset-0 bg-[#07110F]/60 backdrop-blur-sm"
            aria-label="Close booking details"
          />

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[#DDE6E3] bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
                  Booking details
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {selectedBooking.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F5F1] text-[#173C37] transition hover:bg-[#173C37] hover:text-white"
                aria-label="Close"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* GUEST */}
            <div className="mt-7 flex items-center gap-4 rounded-2xl bg-[#F5F7F4] p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#173C37] text-sm font-bold text-[#63E6BE]">
                {selectedBooking.initials}
              </div>

              <div>
                <p className="font-semibold">
                  {selectedBooking.guest}
                </p>

                <p className="mt-1 text-xs text-[#7A8581]">
                  {selectedBooking.guests}{" "}
                  {selectedBooking.guests === 1 ? "guest" : "guests"}
                </p>
              </div>

              <div className="ml-auto">
                <StatusBadge status={selectedBooking.status} />
              </div>
            </div>

            {/* PROPERTY */}
            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A9390]">
                Property
              </p>

              <p className="mt-2 text-sm font-semibold">
                {selectedBooking.property}
              </p>

              <p className="mt-1 text-xs text-[#7A8581]">
                {selectedBooking.location}
              </p>
            </div>

            {/* STAY */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E3E5E0] p-4">
                <div className="flex items-center gap-2 text-[#397A69]">
                  <CalendarDays className="h-4 w-4" />

                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Check in
                  </span>
                </div>

                <p className="mt-3 text-sm font-semibold">
                  {selectedBooking.checkIn}
                </p>
              </div>

              <div className="rounded-xl border border-[#E3E5E0] p-4">
                <div className="flex items-center gap-2 text-[#397A69]">
                  <CalendarDays className="h-4 w-4" />

                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Check out
                  </span>
                </div>

                <p className="mt-3 text-sm font-semibold">
                  {selectedBooking.checkOut}
                </p>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="mt-4 rounded-xl bg-[#F0F7F4] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#75817D]">
                  Booking total
                </span>

                <span className="text-lg font-bold text-[#173C37]">
                  {selectedBooking.amount}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-[#8A9390]">
                <span>
                  {selectedBooking.nights} nights
                </span>

                <span>
                  Booked {selectedBooking.bookedOn}
                </span>
              </div>
            </div>

            {/* TRIPGUARD CONTACT */}
            <div className="mt-6 rounded-2xl border border-[#DCE8E3] bg-[#F5FAF7] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#397A69]">
                Trusted contact
              </p>

              <p className="mt-2 text-sm font-semibold">
                {selectedBooking.nextOfKin}
              </p>

              <p className="mt-1 text-xs leading-5 text-[#75817D]">
                This is the trusted contact provided by the guest for
                TripGuard safety notifications.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full rounded-xl bg-[#173C37] py-3.5 text-sm font-semibold text-white transition hover:bg-[#23584E]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Confirmed: "bg-[#E1F5ED] text-[#277765]",
    Pending: "bg-[#FFF4D6] text-[#967126]",
    Completed: "bg-[#E9EEF8] text-[#4A6287]",
    Cancelled: "bg-[#FCE9E8] text-[#A24A45]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
