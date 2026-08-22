"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Hotel,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";
import AdminNavbar from "@/component/admin/AdminNavbar";
import ProtectedRoute from "../../component/ProtectedRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const emptyStats = {
  totalUsers: 0,
  totalOwners: 0,
  totalAdmins: 0,
  totalAccommodations: 0,
  pendingAccommodations: 0,
  totalBookings: 0,
  pendingBookings: 0,
  successfulPayments: 0,
  totalContactMessages: 0,
  unreadContactMessages: 0,
  totalRevenue: 0,
};

const bookingChart = [
  {
    label: "Mon",
    bookings: 5,
    revenue: 145000,
  },
  {
    label: "Tue",
    bookings: 7,
    revenue: 218000,
  },
  {
    label: "Wed",
    bookings: 4,
    revenue: 126000,
  },
  {
    label: "Thu",
    bookings: 8,
    revenue: 276000,
  },
  {
    label: "Fri",
    bookings: 6,
    revenue: 194000,
  },
  {
    label: "Sat",
    bookings: 8,
    revenue: 231000,
  },
  {
    label: "Sun",
    bookings: 4,
    revenue: 94600,
  },
];



const AdminDashboard = () => {
  const [stats, setStats] = useState(emptyStats);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [topAccommodations, setTopAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/admin/dashboard`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Unable to retrieve dashboard statistics"
          );
        }

        setStats(data.stats || emptyStats);
        setRecentBookings(data.recentBookings || []);
        setRecentNotifications(data.recentNotifications || []);
        setTopAccommodations(data.topAccommodations || []);
      } catch (error) {
        console.error(
          "Dashboard stats error:",
          error
        );

        setError(
          error.message ||
          "Unable to load dashboard statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const dashboardStats = [
    {
      label: "Total revenue",
      value: formatNaira(stats.totalRevenue),
      change: "—",
      description: "successful payments",
      icon: Wallet,
      iconClass:
        "bg-[#63E6BE]/10 text-[#159669]",
      positive: true,
    },
    {
      label: "Total bookings",
      value: formatNumber(stats.totalBookings),
      change: "—",
      description: `${formatNumber(
        stats.pendingBookings
      )} pending`,
      icon: CalendarDays,
      iconClass: "bg-blue-50 text-blue-600",
      positive: true,
    },
    {
      label: "Registered users",
      value: formatNumber(stats.totalUsers),
      change: "—",
      description: `${formatNumber(
        stats.totalOwners
      )} owners`,
      icon: Users,
      iconClass:
        "bg-violet-50 text-violet-600",
      positive: true,
    },
    {
      label: "Accommodations",
      value: formatNumber(
        stats.totalAccommodations
      ),
      change: "—",
      description: `${formatNumber(
        stats.pendingAccommodations
      )} pending review`,
      icon: Hotel,
      iconClass:
        "bg-orange-50 text-orange-600",
      positive: true,
    },
  ];

  const maxBookings = Math.max(
    ...bookingChart.map(
      (item) => item.bookings
    )
  );

  const maxRevenue = Math.max(
    ...bookingChart.map(
      (item) => item.revenue
    )
  );

  const formatRelativeTime = (date) => {
    if (!date) return "";

    const now = new Date();
    const created = new Date(date);

    const diffInSeconds = Math.floor(
      (now - created) / 1000
    );

    if (diffInSeconds < 60) {
      return "Just now";
    }

    const diffInMinutes = Math.floor(
      diffInSeconds / 60
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "min" : "mins"
        } ago`;
    }

    const diffInHours = Math.floor(
      diffInMinutes / 60
    );

    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hr" : "hrs"
        } ago`;
    }

    const diffInDays = Math.floor(
      diffInHours / 24
    );

    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"
        } ago`;
    }

    return created.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <ProtectedRoute allowedRole="admin">
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="lg:ml-72">
          <AdminNavbar />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">

              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <AdminPageHeader
                  title="Dashboard"
                  description="Here's what's happening across TripGuard today."
                />

                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                  <CalendarDays
                    size={15}
                    className="text-gray-400"
                  />

                  <span className="text-xs font-medium text-gray-500">
                    {formatCurrentDate()}
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  <AlertCircle size={17} />

                  <span>{error}</span>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {dashboardStats.map((stat) => (
                  <DashboardStat
                    key={stat.label}
                    {...stat}
                    loading={loading}
                  />
                ))}
              </div>

              {/* Main analytics */}
              <div className="grid gap-6 xl:grid-cols-3">

                {/* Booking Chart */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Booking overview
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Bookings and revenue for the last 7 days.
                      </p>
                    </div>

                    <Link
                      href="/admin/reports"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#159669] hover:underline"
                    >
                      View reports
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                  <div className="mt-8 overflow-x-auto">
                    <div
                      className="flex min-w-[560px] items-end gap-3 sm:gap-5"
                      style={{ height: "270px" }}
                    >
                      {bookingChart.map(
                        (item) => {
                          const bookingHeight =
                            maxBookings > 0
                              ? Math.max(
                                8,
                                (item.bookings /
                                  maxBookings) *
                                100
                              )
                              : 0;

                          const revenueHeight =
                            maxRevenue > 0
                              ? Math.max(
                                8,
                                (item.revenue /
                                  maxRevenue) *
                                100
                              )
                              : 0;

                          return (
                            <div
                              key={item.label}
                              className="flex h-full flex-1 flex-col justify-end"
                            >
                              <div className="flex min-h-0 flex-1 items-end justify-center gap-1.5">

                                {/* Bookings */}
                                <div className="group relative flex h-full w-1/3 items-end justify-center">
                                  <div
                                    className="w-full max-w-8 rounded-t-md bg-gray-900 transition-all duration-300 group-hover:opacity-80"
                                    style={{
                                      height: `${bookingHeight}%`,
                                    }}
                                  />

                                  <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] text-white group-hover:block">
                                    {item.bookings}{" "}
                                    bookings
                                  </div>
                                </div>

                                {/* Revenue */}
                                <div className="group relative flex h-full w-1/3 items-end justify-center">
                                  <div
                                    className="w-full max-w-8 rounded-t-md bg-[#63E6BE] transition-all duration-300 group-hover:opacity-80"
                                    style={{
                                      height: `${revenueHeight}%`,
                                    }}
                                  />

                                  <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] text-white group-hover:block">
                                    {formatCompactCurrency(
                                      item.revenue
                                    )}
                                  </div>
                                </div>
                              </div>

                              <p className="mt-3 text-center text-[11px] font-medium text-gray-400">
                                {item.label}
                              </p>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </section>

                {/* Safety Overview */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Safety overview
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Current protection activity.
                      </p>
                    </div>

                    <Link
                      href="/admin/safety"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </div>

                  <div className="mt-6 flex items-center gap-5">
                    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-[12px] border-[#63E6BE]/20">
                      <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-[#63E6BE] border-r-[#63E6BE] -rotate-45" />

                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          92%
                        </p>

                        <p className="text-[9px] font-medium text-gray-400">
                          Protected
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-4">
                      <SafetyMetric
                        label="Protected bookings"
                        value={formatNumber(
                          Math.max(
                            0,
                            stats.totalBookings -
                            stats.pendingBookings
                          )
                        )}
                        icon={ShieldCheck}
                        iconClass="text-emerald-600 bg-emerald-50"
                      />

                      <SafetyMetric
                        label="Pending attention"
                        value={formatNumber(
                          stats.pendingBookings
                        )}
                        icon={Clock3}
                        iconClass="text-amber-600 bg-amber-50"
                      />

                      <SafetyMetric
                        label="Failed notifications"
                        value="—"
                        icon={ShieldAlert}
                        iconClass="text-red-600 bg-red-50"
                      />
                    </div>
                  </div>

                  <Link
                    href="/admin/safety"
                    className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-xs font-semibold text-white transition hover:bg-gray-800"
                  >
                    Open safety center
                    <ArrowRight size={14} />
                  </Link>
                </section>
              </div>

              {/* Recent bookings + notifications */}
              <div className="grid gap-6 xl:grid-cols-3">

                {/* Recent bookings */}
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm xl:col-span-2">
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Recent bookings
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Latest accommodation bookings.
                      </p>
                    </div>

                    <Link
                      href="/admin/bookings"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#159669] hover:underline"
                    >
                      View all
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/70">
                          <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            Guest
                          </th>

                          <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            Accommodation
                          </th>

                          <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            Amount
                          </th>

                          <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {recentBookings.map((booking) => {
                          const guestName = booking.guest
                            ? `${booking.guest.firstName || ""} ${booking.guest.lastName || ""
                              }`.trim()
                            : "Unknown guest";

                          return (
                            <tr
                              key={booking._id}
                              className="transition hover:bg-gray-50"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#63E6BE]/10 text-xs font-bold text-[#159669]">
                                    {getInitials(guestName)}
                                  </div>

                                  <div>
                                    <p className="text-xs font-semibold text-gray-800">
                                      {guestName}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-gray-400">
                                      {booking.bookingReference ||
                                        booking._id}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <p className="text-xs font-medium text-gray-700">
                                  {booking.accommodation?.name ||
                                    "Accommodation unavailable"}
                                </p>

                                <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                                  <MapPin size={10} />

                                  {typeof booking.accommodation?.location ===
                                    "string"
                                    ? booking.accommodation.location
                                    : "Location unavailable"}
                                </div>
                              </td>

                              <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                                {formatNaira(booking.totalAmount)}
                              </td>

                              <td className="px-6 py-4">
                                <BookingStatus
                                  status={booking.bookingStatus}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile */}
                  <div className="divide-y divide-gray-100 md:hidden">
                    <div className="divide-y divide-gray-100 md:hidden">
                      {recentBookings.map((booking) => {
                        const guestName = booking.guest
                          ? `${booking.guest.firstName || ""} ${booking.guest.lastName || ""
                            }`.trim()
                          : "Unknown guest";

                        return (
                          <Link
                            key={booking._id}
                            href={`/admin/bookings/${booking._id}`}
                            className="block p-5 transition hover:bg-gray-50"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#63E6BE]/10 text-xs font-bold text-[#159669]">
                                  {getInitials(guestName)}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-xs font-semibold text-gray-800">
                                    {guestName}
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-gray-400">
                                    {booking.bookingReference || booking._id}
                                  </p>
                                </div>
                              </div>

                              <BookingStatus
                                status={booking.bookingStatus}
                              />
                            </div>

                            <div className="mt-4">
                              <p className="text-xs font-medium text-gray-700">
                                {booking.accommodation?.name ||
                                  "Accommodation unavailable"}
                              </p>

                              <p className="mt-1 text-xs font-bold text-gray-900">
                                {formatNaira(booking.totalAmount)}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Notifications */}
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Recent activity
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Latest system notifications.
                      </p>
                    </div>

                    <Link
                      href="/admin/notifications"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                      <Bell size={16} />
                    </Link>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {recentNotifications.map((notification) => {
                      const Icon = getNotificationIcon(
                        notification.type
                      );

                      return (
                        <div
                          key={notification._id}
                          className="p-5"
                        >
                          <div className="flex gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getNotificationIconClass(
                                notification.type
                              )}`}
                            >
                              <Icon size={15} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-800">
                                {notification.title}
                              </p>

                              <p className="mt-1 text-[11px] leading-5 text-gray-400">
                                {notification.message}
                              </p>

                              <p className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                                <Clock3 size={10} />

                                {formatRelativeTime(
                                  notification.createdAt
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-100 p-4">
                    <Link
                      href="/admin/notifications"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                    >
                      View all notifications
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </section>
              </div>

              {/* Top accommodations */}
              <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Top accommodations
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Best-performing properties this month.
                    </p>
                  </div>

                  <Link
                    href="/admin/accommodations"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#159669] hover:underline"
                  >
                    Manage accommodations
                    <ArrowRight size={13} />
                  </Link>
                </div>

                <div className="grid divide-y divide-gray-100 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
                  {topAccommodations.length > 0 ? (
                    topAccommodations.map((accommodation, index) => (
                      <div
                        key={accommodation._id}
                        className="p-5 sm:p-6"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                            <Hotel size={17} />
                          </div>

                          {index === 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#63E6BE]/10 px-2 py-1 text-[10px] font-semibold text-[#159669]">
                              <TrendingUp size={10} />
                              Top
                            </span>
                          )}
                        </div>

                        <h3 className="mt-4 truncate text-sm font-semibold text-gray-800">
                          {accommodation.name || "Unnamed accommodation"}
                        </h3>

                        <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-gray-400">
                          <MapPin size={10} />

                          {accommodation.location
                            ? typeof accommodation.location === "string"
                              ? accommodation.location
                              : [
                                accommodation.location.city,
                                accommodation.location.state,
                              ]
                                .filter(Boolean)
                                .join(", ") || "Location unavailable"
                            : "Location unavailable"}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-wide text-gray-400">
                              Bookings
                            </p>

                            <p className="mt-1 text-sm font-bold text-gray-800">
                              {formatNumber(accommodation.bookings)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-wide text-gray-400">
                              Revenue
                            </p>

                            <p className="mt-1 text-sm font-bold text-gray-800">
                              {formatNaira(accommodation.revenue)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">
                              Bookings performance
                            </span>

                            <span className="text-[10px] font-semibold text-gray-600">
                              {formatNumber(accommodation.bookings)} bookings
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-[#63E6BE]"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    (accommodation.bookings /
                                      Math.max(
                                        ...topAccommodations.map(
                                          (item) => item.bookings || 0
                                        )
                                      )) *
                                    100
                                  )
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center md:col-span-2 xl:col-span-4">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                        <Hotel size={22} />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-gray-700">
                        No accommodation data yet
                      </h3>

                      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-400">
                        Top-performing accommodations will appear here once
                        bookings are made.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Quick actions */}
              <section className="rounded-2xl border border-gray-100 bg-gray-900 p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="font-semibold text-white">
                      Quick actions
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Jump directly to the areas that need your attention.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <QuickAction
                      href="/admin/accommodations"
                      icon={Hotel}
                      label="Accommodations"
                    />

                    <QuickAction
                      href="/admin/bookings"
                      icon={CalendarDays}
                      label="Bookings"
                    />

                    <QuickAction
                      href="/admin/safety"
                      icon={ShieldCheck}
                      label="Safety"
                    />

                    <QuickAction
                      href="/admin/reports"
                      icon={BarChart3}
                      label="Reports"
                    />
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const DashboardStat = ({
  label,
  value,
  change,
  description,
  icon: Icon,
  iconClass,
  positive,
  loading,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${positive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
            }`}
        >
          <TrendingUp size={10} />
          {change}
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-gray-900">
        {loading ? (
          <span className="inline-block h-6 w-20 animate-pulse rounded bg-gray-100" />
        ) : (
          value
        )}
      </p>

      <p className="mt-1 text-[10px] text-gray-400">
        {description}
      </p>
    </div>
  );
};

const SafetyMetric = ({
  label,
  value,
  icon: Icon,
  iconClass,
}) => {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        <Icon size={14} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] text-gray-400">
          {label}
        </p>

        <p className="text-sm font-bold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
};

const BookingStatus = ({ status }) => {
  const statusConfig = {
    confirmed: {
      label: "Confirmed",
      className:
        "bg-blue-50 text-blue-600",
    },
    completed: {
      label: "Completed",
      className:
        "bg-emerald-50 text-emerald-600",
    },
    active: {
      label: "Active",
      className:
        "bg-[#63E6BE]/10 text-[#159669]",
    },
    cancelled: {
      label: "Cancelled",
      className:
        "bg-red-50 text-red-600",
    },
    pending: {
      label: "Pending",
      className:
        "bg-amber-50 text-amber-600",
    },
  };

  const config =
    statusConfig[status] ||
    statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
    >
      {status === "completed" ||
        status === "active" ? (
        <CheckCircle2 size={11} />
      ) : status === "pending" ? (
        <Clock3 size={11} />
      ) : status === "cancelled" ? (
        <AlertCircle size={11} />
      ) : (
        <CheckCircle2 size={11} />
      )}

      {config.label}
    </span>
  );
};

const QuickAction = ({
  href,
  icon: Icon,
  label,
}) => {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-medium text-gray-300 transition hover:border-[#63E6BE]/30 hover:bg-[#63E6BE]/10 hover:text-[#63E6BE]"
    >
      <Icon
        size={15}
        className="shrink-0 transition-transform group-hover:scale-110"
      />

      <span className="truncate">
        {label}
      </span>
    </Link>
  );
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const getNotificationIconClass = (
  type
) => {
  const classes = {
    success:
      "bg-emerald-50 text-emerald-600",
    info: "bg-blue-50 text-blue-600",
    danger:
      "bg-red-50 text-red-600",
    booking:
      "bg-[#63E6BE]/10 text-[#159669]",
  };

  return (
    classes[type] ||
    "bg-gray-100 text-gray-500"
  );
};

const getNotificationIcon = (type) => {
  const icons = {
    booking: CalendarDays,
    accommodation: Hotel,
    payment: Wallet,
    safety: ShieldCheck,
    system: Bell,
  };

  return icons[type] || Bell;
};

const formatNaira = (amount) => {
  return `₦${Number(amount || 0).toLocaleString(
    "en-NG"
  )}`;
};

const formatNumber = (number) => {
  return Number(number || 0).toLocaleString(
    "en-NG"
  );
};

const formatCompactCurrency = (
  amount
) => {
  if (amount >= 1000000) {
    return `₦${(
      amount / 1000000
    ).toFixed(1)}m`;
  }

  if (amount >= 1000) {
    return `₦${(
      amount / 1000
    ).toFixed(0)}k`;
  }

  return `₦${amount}`;
};

const formatCurrentDate = () => {
  return new Intl.DateTimeFormat(
    "en-NG",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date());
};

export default AdminDashboard;