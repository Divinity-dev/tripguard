"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Search,
  SlidersHorizontal,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";
import BookingTable from "@/component/admin/BookingTable";
import API from "@/axios/index";

const ITEMS_PER_PAGE = 8;

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

const formatStatus = (status) => {
  const statusMap = {
    pending: "Pending",
    confirmed: "Confirmed",
    "checked-in": "Checked In",
    "checked-out": "Checked Out",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return statusMap[status] || status || "Unknown";
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/*
 * --------------------------------------------------
 * PAGE
 * --------------------------------------------------
 */

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [dateRange, setDateRange] = useState("All time");
  const [currentPage, setCurrentPage] = useState(1);

  /*
   * --------------------------------------------------
   * FETCH BOOKINGS
   * --------------------------------------------------
   */

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/admin/bookings");

        if (response.data.success) {
          setBookings(response.data.bookings || []);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Fetch bookings error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to retrieve bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  /*
   * --------------------------------------------------
   * FILTER BOOKINGS
   * --------------------------------------------------
   */

  const filteredBookings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const now = new Date();

    return bookings.filter((booking) => {
      /*
       * Guest
       */

      const guestName = booking.guest
        ? `${booking.guest.firstName || ""} ${
            booking.guest.lastName || ""
          }`.trim()
        : "Unknown guest";

      const guestEmail =
        booking.guest?.email || "";

      /*
       * Accommodation
       */

      const accommodationName =
        booking.accommodation?.name ||
        "Unknown accommodation";

      /*
       * Location
       */

      const location = [
        booking.accommodation?.location?.city,
        booking.accommodation?.location?.state,
      ]
        .filter(Boolean)
        .join(", ");

      /*
       * Booking ID
       */

      const bookingId =
        booking.bookingReference ||
        booking._id ||
        "";

      /*
       * Search
       */

      const matchesSearch =
        !normalizedSearch ||
        bookingId
          .toLowerCase()
          .includes(normalizedSearch) ||
        guestName
          .toLowerCase()
          .includes(normalizedSearch) ||
        guestEmail
          .toLowerCase()
          .includes(normalizedSearch) ||
        accommodationName
          .toLowerCase()
          .includes(normalizedSearch) ||
        location
          .toLowerCase()
          .includes(normalizedSearch);

      /*
       * Status
       */

      const matchesStatus =
        status === "All" ||
        formatStatus(booking.bookingStatus) ===
          status;

      /*
       * Date range
       */

      let matchesDateRange = true;

      if (dateRange !== "All time") {
        const createdAt = new Date(
          booking.createdAt
        );

        if (!Number.isNaN(createdAt.getTime())) {
          if (dateRange === "Today") {
            matchesDateRange =
              createdAt.toDateString() ===
              now.toDateString();
          }

          if (dateRange === "This week") {
            const startOfWeek = new Date(now);

            const day = startOfWeek.getDay();

            const difference =
              day === 0 ? 6 : day - 1;

            startOfWeek.setDate(
              startOfWeek.getDate() - difference
            );

            startOfWeek.setHours(0, 0, 0, 0);

            matchesDateRange =
              createdAt >= startOfWeek;
          }

          if (dateRange === "This month") {
            matchesDateRange =
              createdAt.getMonth() ===
                now.getMonth() &&
              createdAt.getFullYear() ===
                now.getFullYear();
          }

          if (dateRange === "Last month") {
            const lastMonth = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              1
            );

            const startOfThisMonth = new Date(
              now.getFullYear(),
              now.getMonth(),
              1
            );

            matchesDateRange =
              createdAt >= lastMonth &&
              createdAt < startOfThisMonth;
          }
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDateRange
      );
    });
  }, [
    bookings,
    search,
    status,
    dateRange,
  ]);

  /*
   * --------------------------------------------------
   * SUMMARY CARDS
   * --------------------------------------------------
   */

  const summaryCards = useMemo(() => {
    return [
      {
        title: "Total Bookings",
        value: bookings.length,
        description: "All-time bookings",
        icon: CalendarCheck,
        iconClass:
          "bg-blue-50 text-blue-600",
      },
      {
        title: "Confirmed",
        value: bookings.filter(
          (booking) =>
            booking.bookingStatus ===
            "confirmed"
        ).length,
        description: "Active reservations",
        icon: CheckCircle2,
        iconClass:
          "bg-emerald-50 text-emerald-600",
      },
      {
        title: "Pending",
        value: bookings.filter(
          (booking) =>
            booking.bookingStatus ===
            "pending"
        ).length,
        description: "Awaiting confirmation",
        icon: Clock3,
        iconClass:
          "bg-amber-50 text-amber-600",
      },
      {
        title: "Cancelled",
        value: bookings.filter(
          (booking) =>
            booking.bookingStatus ===
            "cancelled"
        ).length,
        description: "Cancelled bookings",
        icon: XCircle,
        iconClass:
          "bg-red-50 text-red-600",
      },
    ];
  }, [bookings]);

  /*
   * --------------------------------------------------
   * PAGINATION
   * --------------------------------------------------
   */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredBookings.length /
        ITEMS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  /*
   * --------------------------------------------------
   * FORMAT BOOKINGS FOR TABLE
   * --------------------------------------------------
   */

  const paginatedBookings = useMemo(() => {
    const start =
      (safeCurrentPage - 1) *
      ITEMS_PER_PAGE;

    const end =
      safeCurrentPage * ITEMS_PER_PAGE;

    return filteredBookings
      .slice(start, end)
      .map((booking) => {
        const guestName = booking.guest
          ? `${booking.guest.firstName || ""} ${
              booking.guest.lastName || ""
            }`.trim()
          : "Unknown guest";

        const location = [
          booking.accommodation?.location
            ?.city,
          booking.accommodation?.location
            ?.state,
        ]
          .filter(Boolean)
          .join(", ");

        return {
          id:
            booking.bookingReference ||
            booking._id,

          guest:
            guestName || "Unknown guest",

          email:
            booking.guest?.email || "—",

          accommodation:
            booking.accommodation?.name ||
            "Unknown accommodation",

          location: location || "—",

          checkIn: formatDate(
            booking.checkInDate
          ),

          checkOut: formatDate(
            booking.checkOutDate
          ),

          amount: formatCurrency(
            booking.totalAmount
          ),

          status: formatStatus(
            booking.bookingStatus
          ),

          createdAt: formatDate(
            booking.createdAt
          ),

          /*
           * Keep original booking available
           * if BookingTable needs it later.
           */

          originalBooking: booking,
        };
      });
  }, [
    filteredBookings,
    safeCurrentPage,
  ]);

  /*
   * --------------------------------------------------
   * SEARCH
   * --------------------------------------------------
   */

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  /*
   * --------------------------------------------------
   * STATUS
   * --------------------------------------------------
   */

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setCurrentPage(1);
  };

  /*
   * --------------------------------------------------
   * DATE RANGE
   * --------------------------------------------------
   */

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
    setCurrentPage(1);
  };

  /*
   * --------------------------------------------------
   * VIEW BOOKING
   * --------------------------------------------------
   */

  const handleViewBooking = (booking) => {
    window.location.href = `/admin/bookings/${booking.id}`;
  };

  /*
   * --------------------------------------------------
   * BOOKING ACTIONS
   * --------------------------------------------------
   */

  const handleBookingActions = (booking) => {
    window.location.href = `/admin/bookings/${booking.id}`;
  };

  /*
   * --------------------------------------------------
   * EXPORT
   * --------------------------------------------------
   */

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

    const rows = filteredBookings.map(
      (booking) => {
        const guestName = booking.guest
          ? `${booking.guest.firstName || ""} ${
              booking.guest.lastName || ""
            }`.trim()
          : "Unknown guest";

        const location = [
          booking.accommodation
            ?.location?.city,
          booking.accommodation
            ?.location?.state,
        ]
          .filter(Boolean)
          .join(", ");

        return [
          booking.bookingReference ||
            booking._id,

          guestName || "Unknown guest",

          booking.guest?.email || "—",

          booking.accommodation?.name ||
            "Unknown accommodation",

          location || "—",

          formatDate(
            booking.checkInDate
          ),

          formatDate(
            booking.checkOutDate
          ),

          formatCurrency(
            booking.totalAmount
          ),

          formatStatus(
            booking.bookingStatus
          ),

          formatDate(
            booking.createdAt
          ),
        ];
      }
    );

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "tripguard-bookings.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /*
   * --------------------------------------------------
   * RESET FILTERS
   * --------------------------------------------------
   */

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setDateRange("All time");
    setCurrentPage(1);
  };

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

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
                    onChange={
                      handleSearchChange
                    }
                    placeholder="Search booking ID, guest, accommodation..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#63E6BE] focus:bg-white focus:ring-2 focus:ring-[#63E6BE]/10"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">

                  {/* Status */}

                  <div className="relative">
                    <SlidersHorizontal
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <select
                      value={status}
                      onChange={
                        handleStatusChange
                      }
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-600 outline-none focus:border-[#63E6BE] sm:w-44"
                    >
                      <option value="All">
                        All statuses
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Checked In">
                        Checked In
                      </option>

                      <option value="Checked Out">
                        Checked Out
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>

                  {/* Date */}

                  <select
                    value={dateRange}
                    onChange={
                      handleDateRangeChange
                    }
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#63E6BE] sm:w-40"
                  >
                    <option>
                      All time
                    </option>

                    <option>
                      Today
                    </option>

                    <option>
                      This week
                    </option>

                    <option>
                      This month
                    </option>

                    <option>
                      Last month
                    </option>
                  </select>
                </div>
              </div>

              {(search ||
                status !== "All" ||
                dateRange !==
                  "All time") && (
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">

                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {
                        filteredBookings.length
                      }
                    </span>{" "}
                    matching bookings
                  </p>

                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="text-xs font-semibold text-[#159669] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Table */}

            {loading ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                <p className="text-sm text-gray-500">
                  Loading bookings...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            ) : paginatedBookings.length ===
              0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-700">
                  No bookings found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Try adjusting your search
                  or filters.
                </p>
              </div>
            ) : (
              <BookingTable
                bookings={
                  paginatedBookings
                }
                onView={
                  handleViewBooking
                }
                onStatusChange={
                  handleBookingActions
                }
              />
            )}

            {/* Pagination */}

            {!loading &&
              !error &&
              filteredBookings.length >
                0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {(safeCurrentPage -
                        1) *
                        ITEMS_PER_PAGE +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-700">
                      {Math.min(
                        safeCurrentPage *
                          ITEMS_PER_PAGE,
                        filteredBookings.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">
                      {
                        filteredBookings.length
                      }
                    </span>{" "}
                    bookings
                  </p>

                  <div className="flex items-center gap-1">

                    {/* Previous */}

                    <button
                      type="button"
                      disabled={
                        safeCurrentPage ===
                        1
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1
                            )
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <ChevronLeft
                        size={17}
                      />
                    </button>

                    {/* Page numbers */}

                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map((page) => (
                      <button
                        type="button"
                        key={page}
                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }
                        className={`hidden h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold sm:flex ${
                          page ===
                          safeCurrentPage
                            ? "bg-[#63E6BE] text-gray-900"
                            : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Mobile page indicator */}

                    <span className="flex h-9 items-center px-2 text-xs text-gray-400 sm:hidden">
                      Page{" "}
                      {
                        safeCurrentPage
                      }{" "}
                      of{" "}
                      {totalPages}
                    </span>

                    {/* Next */}

                    <button
                      type="button"
                      disabled={
                        safeCurrentPage ===
                        totalPages
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.min(
                              totalPages,
                              page + 1
                            )
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <ChevronRight
                        size={17}
                      />
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