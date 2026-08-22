"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  MapPin,
  MoreVertical,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserRound,
  XCircle,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ITEMS_PER_PAGE = 6;

const filters = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "protected",
    label: "Protected",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "attention",
    label: "Attention",
  },
  {
    value: "issue",
    label: "Issues",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getRelativeTime = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const now = new Date();
  const difference = now.getTime() - parsedDate.getTime();

  const minutes = Math.floor(
    difference / (1000 * 60)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getNotificationState = (booking) => {
  const safetyNotifications =
    booking?.safetyNotifications || {};

  const checkInSent =
    Boolean(
      safetyNotifications.checkInNotificationSent
    );

  const checkOutSent =
    Boolean(
      safetyNotifications.checkOutNotificationSent
    );

  const checkInDate = booking?.checkInDate
    ? new Date(booking.checkInDate)
    : null;

  const checkOutDate = booking?.checkOutDate
    ? new Date(booking.checkOutDate)
    : null;

  const now = new Date();

  /*
   * If the check-out notification has already
   * been sent, that is the most recent safety event.
   */
  if (checkOutSent) {
    return {
      status: "delivered",
      label: "Check-out notification delivered",
      time:
        safetyNotifications.checkOutNotificationSentAt ||
        booking.updatedAt ||
        booking.createdAt,
    };
  }

  /*
   * If the traveller has checked in and the
   * check-in notification has been sent.
   */
  if (checkInSent) {
    return {
      status: "delivered",
      label: "Check-in notification delivered",
      time:
        safetyNotifications.checkInNotificationSentAt ||
        booking.updatedAt ||
        booking.createdAt,
    };
  }

  /*
   * Upcoming check-in.
   */
  if (
    checkInDate &&
    now < checkInDate
  ) {
    return {
      status: "scheduled",
      label: "Check-in notification scheduled",
      time: booking.createdAt,
    };
  }

  /*
   * Check-in date has arrived but notification
   * has not been recorded as sent.
   */
  if (
    checkInDate &&
    now >= checkInDate &&
    !checkInSent
  ) {
    return {
      status: "pending",
      label: "Awaiting check-in notification",
      time: booking.updatedAt || booking.createdAt,
    };
  }

  return {
    status: "pending",
    label: "Safety notification pending",
    time: booking.updatedAt || booking.createdAt,
  };
};

const getSafetyStatus = (booking) => {
  const safetyContact =
    booking?.safetyContact;

  const hasSafetyContact =
    Boolean(
      safetyContact?.email ||
        safetyContact?.phone
    );

  const safetyNotifications =
    booking?.safetyNotifications || {};

  const checkInSent =
    Boolean(
      safetyNotifications.checkInNotificationSent
    );

  const checkOutSent =
    Boolean(
      safetyNotifications.checkOutNotificationSent
    );

  const bookingStatus =
    booking?.bookingStatus;

  /*
   * A booking without a trusted contact cannot
   * currently be considered protected.
   */
  if (!hasSafetyContact) {
    return "attention";
  }

  /*
   * Completed booking where the check-out
   * notification has been sent.
   */
  if (
    bookingStatus === "completed" &&
    checkOutSent
  ) {
    return "completed";
  }

  /*
   * A failed/missing notification after the
   * relevant stay event requires attention.
   */
  if (
    bookingStatus === "checked-in" &&
    !checkInSent
  ) {
    return "issue";
  }

  if (
    bookingStatus === "checked-out" &&
    !checkOutSent
  ) {
    return "issue";
  }

  /*
   * Currently active protected booking.
   */
  if (
    bookingStatus === "checked-in" &&
    checkInSent
  ) {
    return "active";
  }

  /*
   * Upcoming protected booking.
   */
  if (
    bookingStatus === "confirmed" ||
    bookingStatus === "pending"
  ) {
    return "protected";
  }

  /*
   * Completed booking.
   */
  if (
    bookingStatus === "completed"
  ) {
    return "completed";
  }

  return "attention";
};

const transformBooking = (booking) => {
  const guest = booking?.guest || {};
  const accommodation =
    booking?.accommodation || {};

  const location =
    accommodation?.location || {};

  const safetyContact =
    booking?.safetyContact || {};

  const notification =
    getNotificationState(booking);

  return {
    id:
      booking?.bookingReference ||
      booking?._id,

    bookingId: booking?._id,

    guest:
      `${guest.firstName || ""} ${
        guest.lastName || ""
      }`.trim() || "Unknown guest",

    guestEmail:
      guest.email || "",

    accommodation:
      accommodation.name ||
      "Unknown accommodation",

    location: [
      location.city,
      location.state,
    ]
      .filter(Boolean)
      .join(", ") || "Location unavailable",

    checkIn:
      formatDate(booking?.checkInDate),

    checkOut:
      formatDate(booking?.checkOutDate),

    status:
      getSafetyStatus(booking),

    notificationStatus:
      notification.status,

    lastNotification:
      notification.label,

    lastNotificationTime:
      getRelativeTime(notification.time),

    emergencyContact:
      safetyContact.name ||
      "Not provided",

    emergencyEmail:
      safetyContact.email ||
      "",

    emergencyPhone:
      safetyContact.phone ||
      "",

    bookingStatus:
      booking?.bookingStatus,

    paymentStatus:
      booking?.paymentStatus,

    rawBooking: booking,
  };
};

const SafetyPage = () => {
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] =
    useState("all");
  const [searchTerm, setSearchTerm] =
    useState("");
  const [currentPage, setCurrentPage] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ======================================================
  // FETCH BOOKINGS
  // ======================================================

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/admin/bookings`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to retrieve bookings"
          );
        }

        setBookings(
          Array.isArray(data?.bookings)
            ? data.bookings
            : []
        );
      } catch (err) {
        console.error(
          "Fetch safety bookings error:",
          err
        );

        setError(
          err.message ||
            "Unable to load safety activity"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ======================================================
  // SAFETY RECORDS
  // ======================================================

  const safetyRecords = useMemo(() => {
    return bookings.map(
      transformBooking
    );
  }, [bookings]);

  // ======================================================
  // SAFETY COUNTS
  // ======================================================

  const protectedCount =
    safetyRecords.filter(
      (record) =>
        record.status === "protected" ||
        record.status === "active"
    ).length;

  const attentionCount =
    safetyRecords.filter(
      (record) =>
        record.status === "attention"
    ).length;

  const issueCount =
    safetyRecords.filter(
      (record) =>
        record.status === "issue"
    ).length;

  const deliveredCount =
    safetyRecords.filter(
      (record) =>
        record.notificationStatus ===
        "delivered"
    ).length;

  // ======================================================
  // FILTERING
  // ======================================================

  const filteredRecords = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return safetyRecords.filter(
      (record) => {
        const matchesFilter =
          activeFilter === "all" ||
          record.status ===
            activeFilter;

        const matchesSearch =
          !search ||
          record.id
            ?.toLowerCase()
            .includes(search) ||
          record.guest
            ?.toLowerCase()
            .includes(search) ||
          record.guestEmail
            ?.toLowerCase()
            .includes(search) ||
          record.accommodation
            ?.toLowerCase()
            .includes(search) ||
          record.location
            ?.toLowerCase()
            .includes(search);

        return (
          matchesFilter &&
          matchesSearch
        );
      }
    );
  }, [
    safetyRecords,
    activeFilter,
    searchTerm,
  ]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRecords.length /
        ITEMS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedRecords =
    filteredRecords.slice(
      (safeCurrentPage - 1) *
        ITEMS_PER_PAGE,
      safeCurrentPage *
        ITEMS_PER_PAGE
    );

  // ======================================================
  // HANDLERS
  // ======================================================

  const handleFilterChange = (
    filter
  ) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (
    event
  ) => {
    setSearchTerm(
      event.target.value
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveFilter("all");
    setCurrentPage(1);
  };

  // ======================================================
  // COVERAGE
  // ======================================================

  const protectionCoverage =
    safetyRecords.length > 0
      ? Math.round(
          (protectedCount /
            safetyRecords.length) *
            100
        )
      : 0;

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="lg:ml-72">
        <AdminNavbar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <AdminPageHeader
              title="Safety"
              description="Monitor TripGuard protection, safety notifications, and safety-related activity."
            />

            {/* ==================================================
                SAFETY OVERVIEW
            ================================================== */}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <SafetyStat
                icon={ShieldCheck}
                label="Protected bookings"
                value={protectedCount}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <SafetyStat
                icon={Bell}
                label="Notifications delivered"
                value={deliveredCount}
                iconClass="bg-blue-50 text-blue-600"
              />

              <SafetyStat
                icon={Clock3}
                label="Needs attention"
                value={attentionCount}
                iconClass="bg-amber-50 text-amber-600"
              />

              <SafetyStat
                icon={ShieldAlert}
                label="Safety issues"
                value={issueCount}
                iconClass="bg-red-50 text-red-600"
              />
            </div>

            {/* ==================================================
                SAFETY INFORMATION
            ================================================== */}

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#63E6BE]/10 text-[#159669]">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      TripGuard protection
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Protected bookings can
                      automatically notify the
                      traveller&apos;s trusted
                      contact at check-in and
                      check-out. Monitor delivery
                      status here and identify
                      bookings that require
                      attention.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-900 p-5 text-white shadow-sm">
                <p className="text-xs font-medium text-gray-400">
                  Protection coverage
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {protectionCoverage}%
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#63E6BE] transition-all"
                    style={{
                      width: `${protectionCoverage}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Current bookings covered by
                  TripGuard safety protection.
                </p>
              </div>
            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Unable to load safety
                      activity
                    </p>

                    <p className="mt-1 text-xs text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                FILTERS AND SEARCH
            ================================================== */}

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={
                      handleSearchChange
                    }
                    placeholder="Search booking, guest, accommodation..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#63E6BE] focus:bg-white focus:ring-2 focus:ring-[#63E6BE]/10"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter
                    size={16}
                    className="shrink-0 text-gray-400"
                  />

                  <span className="hidden text-sm font-medium text-gray-500 sm:block">
                    Status
                  </span>

                  <div className="flex max-w-full gap-1.5 overflow-x-auto pb-1">
                    {filters.map(
                      (filter) => {
                        const count =
                          filter.value ===
                          "all"
                            ? safetyRecords.length
                            : safetyRecords.filter(
                                (record) =>
                                  record.status ===
                                  filter.value
                              ).length;

                        return (
                          <button
                            key={
                              filter.value
                            }
                            type="button"
                            onClick={() =>
                              handleFilterChange(
                                filter.value
                              )
                            }
                            className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${
                              activeFilter ===
                              filter.value
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {
                              filter.label
                            }

                            <span
                              className={`ml-1 ${
                                activeFilter ===
                                filter.value
                                  ? "text-gray-300"
                                  : "text-gray-400"
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                SAFETY RECORDS
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:px-6">
                <h2 className="font-semibold text-gray-900">
                  Safety activity
                </h2>

                <p className="text-xs text-gray-400">
                  {loading
                    ? "Loading safety records..."
                    : `${filteredRecords.length} safety records matching your search and filters.`}
                </p>
              </div>

              {loading ? (
                <SafetyLoading />
              ) : paginatedRecords.length >
                0 ? (
                <>
                  {/* Desktop table */}

                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/70">
                          <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Booking / Guest
                          </th>

                          <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Accommodation
                          </th>

                          <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Stay
                          </th>

                          <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Safety status
                          </th>

                          <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Notifications
                          </th>

                          <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {paginatedRecords.map(
                          (record) => (
                            <SafetyRow
                              key={
                                record.bookingId ||
                                record.id
                              }
                              record={
                                record
                              }
                            />
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}

                  <div className="divide-y divide-gray-100 md:hidden">
                    {paginatedRecords.map(
                      (record) => (
                        <SafetyMobileCard
                          key={
                            record.bookingId ||
                            record.id
                          }
                          record={
                            record
                          }
                        />
                      )
                    )}
                  </div>
                </>
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                    <ShieldCheck size={25} />
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    No safety records
                    found
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-gray-500">
                    Try changing your
                    search or selected
                    safety status.
                  </p>

                  {(searchTerm ||
                    activeFilter !==
                      "all") && (
                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="mt-4 text-sm font-semibold text-[#159669] hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}

              {/* Pagination */}

              {!loading &&
                filteredRecords.length >
                  0 && (
                  <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-xs text-gray-400">
                      Showing{" "}
                      <span className="font-semibold text-gray-600">
                        {(safeCurrentPage -
                          1) *
                          ITEMS_PER_PAGE +
                          1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-gray-600">
                        {Math.min(
                          safeCurrentPage *
                            ITEMS_PER_PAGE,
                          filteredRecords.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-600">
                        {
                          filteredRecords.length
                        }
                      </span>
                    </p>

                    <div className="flex items-center gap-1">
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
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Previous page"
                      >
                        <ChevronLeft
                          size={15}
                        />
                      </button>

                      <span className="px-3 text-xs font-medium text-gray-500">
                        Page{" "}
                        {
                          safeCurrentPage
                        }{" "}
                        of{" "}
                        {totalPages}
                      </span>

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
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Next page"
                      >
                        <ChevronRight
                          size={15}
                        />
                      </button>
                    </div>
                  </div>
                )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

// ==========================================================
// DESKTOP ROW
// ==========================================================

const SafetyRow = ({
  record,
}) => {
  return (
    <tr className="transition hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#63E6BE]/10 text-[#159669]">
            <UserRound size={17} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800">
              {record.guest}
            </p>

            <p className="mt-0.5 text-xs text-gray-400">
              {record.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <p className="text-sm font-medium text-gray-700">
          {record.accommodation}
        </p>

        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
          <MapPin size={12} />
          {record.location}
        </div>
      </td>

      <td className="px-6 py-4">
        <p className="text-xs text-gray-500">
          <span className="font-medium text-gray-700">
            {record.checkIn}
          </span>
        </p>

        <p className="mt-1 text-xs text-gray-400">
          to {record.checkOut}
        </p>
      </td>

      <td className="px-6 py-4">
        <SafetyStatus
          status={record.status}
        />
      </td>

      <td className="px-6 py-4">
        <NotificationStatus
          status={
            record.notificationStatus
          }
        />

        <p className="mt-1 max-w-[180px] truncate text-[11px] text-gray-400">
          {record.lastNotification}
        </p>

        {record.lastNotificationTime && (
          <p className="mt-0.5 text-[10px] text-gray-300">
            {record.lastNotificationTime}
          </p>
        )}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/bookings/${record.bookingId}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            title="View booking"
          >
            <Eye size={15} />
          </Link>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            title="More options"
          >
            <MoreVertical
              size={15}
            />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ==========================================================
// MOBILE CARD
// ==========================================================

const SafetyMobileCard = ({
  record,
}) => {
  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#63E6BE]/10 text-[#159669]">
            <UserRound size={17} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">
              {record.guest}
            </p>

            <p className="mt-0.5 text-xs text-gray-400">
              {record.id}
            </p>
          </div>
        </div>

        <SafetyStatus
          status={record.status}
        />
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 p-3">
        <p className="text-sm font-medium text-gray-700">
          {record.accommodation}
        </p>

        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
          <MapPin size={12} />
          {record.location}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Check-in
          </p>

          <p className="mt-1 text-xs font-medium text-gray-700">
            {record.checkIn}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Check-out
          </p>

          <p className="mt-1 text-xs font-medium text-gray-700">
            {record.checkOut}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <NotificationStatus
              status={
                record.notificationStatus
              }
            />

            <p className="mt-1 text-[11px] text-gray-400">
              {record.lastNotification}
            </p>

            {record.lastNotificationTime && (
              <p className="mt-0.5 text-[10px] text-gray-300">
                {record.lastNotificationTime}
              </p>
            )}
          </div>

          <Link
            href={`/admin/bookings/${record.bookingId}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
          >
            <Eye size={13} />
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

// ==========================================================
// SAFETY STATUS
// ==========================================================

const SafetyStatus = ({
  status,
}) => {
  const statusConfig = {
    protected: {
      label: "Protected",
      icon: ShieldCheck,
      className:
        "bg-emerald-50 text-emerald-600",
    },

    active: {
      label: "Active",
      icon: CheckCircle2,
      className:
        "bg-blue-50 text-blue-600",
    },

    attention: {
      label: "Attention",
      icon: AlertCircle,
      className:
        "bg-amber-50 text-amber-600",
    },

    issue: {
      label: "Issue",
      icon: ShieldAlert,
      className:
        "bg-red-50 text-red-600",
    },

    completed: {
      label: "Completed",
      icon: CheckCircle2,
      className:
        "bg-gray-100 text-gray-500",
    },
  };

  const config =
    statusConfig[status] ||
    statusConfig.attention;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.className}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
};

// ==========================================================
// NOTIFICATION STATUS
// ==========================================================

const NotificationStatus = ({
  status,
}) => {
  const statusConfig = {
    delivered: {
      label: "Delivered",
      icon: CheckCircle2,
      className:
        "text-emerald-600",
    },

    scheduled: {
      label: "Scheduled",
      icon: Clock3,
      className: "text-blue-600",
    },

    pending: {
      label: "Pending",
      icon: Clock3,
      className:
        "text-amber-600",
    },

    failed: {
      label: "Failed",
      icon: XCircle,
      className:
        "text-red-600",
    },
  };

  const config =
    statusConfig[status] ||
    statusConfig.pending;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
};

// ==========================================================
// STAT CARD
// ==========================================================

const SafetyStat = ({
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

      <p className="mt-1 text-xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};

// ==========================================================
// LOADING
// ==========================================================

const SafetyLoading = () => {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse p-5 md:px-6 md:py-5"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gray-100" />

            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 rounded bg-gray-100" />
              <div className="h-2.5 w-24 rounded bg-gray-100" />
            </div>

            <div className="hidden h-6 w-20 rounded-full bg-gray-100 md:block" />

            <div className="hidden h-3 w-24 rounded bg-gray-100 md:block" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SafetyPage;