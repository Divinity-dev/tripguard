"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
CalendarCheck,
CheckCircle2,
Clock3,
Search,
SlidersHorizontal,
XCircle,
Download,
ChevronLeft,
ChevronRight,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";
import BookingTable from "@/component/admin/BookingTable";

const bookings = [
{
id: "TG-10284",
guest: "Daniel Okafor",
email: "[daniel@example.com](mailto:daniel@example.com)",
accommodation: "The Meridian House",
location: "Lekki, Lagos",
checkIn: "Aug 14, 2026",
checkOut: "Aug 18, 2026",
amount: "₦185,000",
status: "Confirmed",
createdAt: "Aug 10, 2026",
},
{
id: "TG-10283",
guest: "Amaka Eze",
email: "[amaka@example.com](mailto:amaka@example.com)",
accommodation: "Palm Court Residence",
location: "Victoria Island, Lagos",
checkIn: "Aug 15, 2026",
checkOut: "Aug 20, 2026",
amount: "₦240,000",
status: "Pending",
createdAt: "Aug 10, 2026",
},
{
id: "TG-10282",
guest: "Michael Adeyemi",
email: "[michael@example.com](mailto:michael@example.com)",
accommodation: "Cedar View Suites",
location: "Ikeja, Lagos",
checkIn: "Aug 12, 2026",
checkOut: "Aug 15, 2026",
amount: "₦150,000",
status: "Checked In",
createdAt: "Aug 9, 2026",
},
{
id: "TG-10281",
guest: "Sarah Williams",
email: "[sarah@example.com](mailto:sarah@example.com)",
accommodation: "The Meridian House",
location: "Lekki, Lagos",
checkIn: "Aug 8, 2026",
checkOut: "Aug 11, 2026",
amount: "₦95,000",
status: "Cancelled",
createdAt: "Aug 7, 2026",
},
{
id: "TG-10280",
guest: "Chinedu Okoro",
email: "[chinedu@example.com](mailto:chinedu@example.com)",
accommodation: "Palm Court Residence",
location: "Victoria Island, Lagos",
checkIn: "Aug 5, 2026",
checkOut: "Aug 9, 2026",
amount: "₦210,000",
status: "Completed",
createdAt: "Aug 3, 2026",
},
{
id: "TG-10279",
guest: "Fatima Ibrahim",
email: "[fatima@example.com](mailto:fatima@example.com)",
accommodation: "Cedar View Suites",
location: "Ikeja, Lagos",
checkIn: "Aug 4, 2026",
checkOut: "Aug 7, 2026",
amount: "₦135,000",
status: "Completed",
createdAt: "Aug 1, 2026",
},
{
id: "TG-10278",
guest: "David Johnson",
email: "[david@example.com](mailto:david@example.com)",
accommodation: "The Meridian House",
location: "Lekki, Lagos",
checkIn: "Jul 29, 2026",
checkOut: "Aug 2, 2026",
amount: "₦220,000",
status: "Completed",
createdAt: "Jul 27, 2026",
},
{
id: "TG-10277",
guest: "Blessing Adeola",
email: "[blessing@example.com](mailto:blessing@example.com)",
accommodation: "Palm Court Residence",
location: "Victoria Island, Lagos",
checkIn: "Jul 27, 2026",
checkOut: "Jul 30, 2026",
amount: "₦165,000",
status: "Cancelled",
createdAt: "Jul 25, 2026",
},
{
id: "TG-10276",
guest: "Emmanuel Nwosu",
email: "[emmanuel@example.com](mailto:emmanuel@example.com)",
accommodation: "Cedar View Suites",
location: "Ikeja, Lagos",
checkIn: "Jul 25, 2026",
checkOut: "Jul 29, 2026",
amount: "₦180,000",
status: "Completed",
createdAt: "Jul 23, 2026",
},
{
id: "TG-10275",
guest: "Grace Peter",
email: "[grace@example.com](mailto:grace@example.com)",
accommodation: "The Meridian House",
location: "Lekki, Lagos",
checkIn: "Jul 22, 2026",
checkOut: "Jul 25, 2026",
amount: "₦120,000",
status: "Completed",
createdAt: "Jul 20, 2026",
},
{
id: "TG-10274",
guest: "Samuel Ajayi",
email: "[samuel@example.com](mailto:samuel@example.com)",
accommodation: "Palm Court Residence",
location: "Victoria Island, Lagos",
checkIn: "Jul 20, 2026",
checkOut: "Jul 24, 2026",
amount: "₦200,000",
status: "Completed",
createdAt: "Jul 18, 2026",
},
{
id: "TG-10273",
guest: "Esther Okafor",
email: "[esther@example.com](mailto:esther@example.com)",
accommodation: "Cedar View Suites",
location: "Ikeja, Lagos",
checkIn: "Jul 18, 2026",
checkOut: "Jul 21, 2026",
amount: "₦140,000",
status: "Confirmed",
createdAt: "Jul 16, 2026",
},
];

const ITEMS_PER_PAGE = 8;

const summaryCards = [
{
title: "Total Bookings",
value: "1,284",
description: "All-time bookings",
icon: CalendarCheck,
iconClass: "bg-blue-50 text-blue-600",
},
{
title: "Confirmed",
value: "836",
description: "Active reservations",
icon: CheckCircle2,
iconClass: "bg-emerald-50 text-emerald-600",
},
{
title: "Pending",
value: "18",
description: "Awaiting confirmation",
icon: Clock3,
iconClass: "bg-amber-50 text-amber-600",
},
{
title: "Cancelled",
value: "74",
description: "Cancelled bookings",
icon: XCircle,
iconClass: "bg-red-50 text-red-600",
},
];

const BookingsPage = () => {
const [search, setSearch] = useState("");
const [status, setStatus] = useState("All");
const [dateRange, setDateRange] = useState("All time");
const [currentPage, setCurrentPage] = useState(1);

const filteredBookings = useMemo(() => {
const normalizedSearch = search.trim().toLowerCase();

return bookings.filter((booking) => {
  const matchesSearch =
    !normalizedSearch ||
    booking.id.toLowerCase().includes(normalizedSearch) ||
    booking.guest.toLowerCase().includes(normalizedSearch) ||
    booking.email.toLowerCase().includes(normalizedSearch) ||
    booking.accommodation.toLowerCase().includes(normalizedSearch) ||
    booking.location.toLowerCase().includes(normalizedSearch);

  const matchesStatus =
    status === "All" || booking.status === status;

  return matchesSearch && matchesStatus;
});


}, [search, status]);

const totalPages = Math.max(
1,
Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
);

const safeCurrentPage = Math.min(currentPage, totalPages);

const paginatedBookings = filteredBookings.slice(
(safeCurrentPage - 1) * ITEMS_PER_PAGE,
safeCurrentPage * ITEMS_PER_PAGE
);

const handleSearchChange = (event) => {
setSearch(event.target.value);
setCurrentPage(1);
};

const handleStatusChange = (event) => {
setStatus(event.target.value);
setCurrentPage(1);
};

const handleDateRangeChange = (event) => {
setDateRange(event.target.value);
setCurrentPage(1);
};

const handleViewBooking = (booking) => {
window.location.href = `/admin/bookings/${booking.id}`;
};

const handleBookingActions = (booking) => {
window.location.href = `/admin/bookings/${booking.id}`;
};

const handleExport = () => {
const headers = [
"Booking ID",
"Guest",
"Email",
"Accommodation",
"Location",
"Check In",
"Check Out",
"Amount",
"Status",
"Created At",
];

const rows = filteredBookings.map((booking) => [
  booking.id,
  booking.guest,
  booking.email,
  booking.accommodation,
  booking.location,
  booking.checkIn,
  booking.checkOut,
  booking.amount,
  booking.status,
  booking.createdAt,
]);

const csv = [headers, ...rows]
  .map((row) =>
    row
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  )
  .join("\n");

const blob = new Blob([csv], {
  type: "text/csv;charset=utf-8;",
});

const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = "tripguard-bookings.csv";
link.click();

URL.revokeObjectURL(url);

};

return ( <div className="min-h-screen bg-gray-50"> <AdminSidebar />


  <div className="lg:ml-72">
    <AdminNavbar />

    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <AdminPageHeader
          title="Bookings"
          description="Manage and monitor all TripGuard accommodation bookings."
          showExport
          onExport={handleExport}
        />

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs text-gray-500">
                      {card.title}
                    </p>

                    <p className="mt-0.5 text-xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search booking ID, guest, accommodation..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#63E6BE] focus:bg-white focus:ring-2 focus:ring-[#63E6BE]/10"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <SlidersHorizontal
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-600 outline-none focus:border-[#63E6BE] sm:w-44"
                >
                  <option value="All">All statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked In">
                    Checked In
                  </option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <select
                value={dateRange}
                onChange={handleDateRangeChange}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#63E6BE] sm:w-40"
              >
                <option>All time</option>
                <option>Today</option>
                <option>This week</option>
                <option>This month</option>
                <option>Last month</option>
              </select>
            </div>
          </div>

          {(search || status !== "All" || dateRange !== "All time") && (
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredBookings.length}
                </span>{" "}
                matching bookings
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("All");
                  setDateRange("All time");
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold text-[#159669] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <BookingTable
          bookings={paginatedBookings}
          onView={handleViewBooking}
          onStatusChange={handleBookingActions}
        />

        {/* Pagination */}
        {filteredBookings.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-700">
                {Math.min(
                  safeCurrentPage * ITEMS_PER_PAGE,
                  filteredBookings.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {filteredBookings.length}
              </span>{" "}
              bookings
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={17} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`hidden h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold sm:flex ${
                    page === safeCurrentPage
                      ? "bg-[#63E6BE] text-gray-900"
                      : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <span className="flex h-9 items-center px-2 text-xs text-gray-400 sm:hidden">
                Page {safeCurrentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  </div>
</div>


);
};

export default BookingsPage;
