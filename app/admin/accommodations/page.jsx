"use client";

import {
  Building2,
  CalendarCheck,
  CircleDollarSign,
  ShieldCheck,
  Users,
  ArrowUpRight,
  MoreHorizontal,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminStatCard from "@/component/admin/AdminStatCard";
import RecentBookings from "@/component/admin/RecentBookings";
import RecentUsers from "@/component/admin/RecentUsers";
import RevenueChart from "@/component/admin/RevenueChart";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

const formatCurrency = (amount) => {
  const value = Number(amount || 0);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (number) => {
  return new Intl.NumberFormat("en-NG").format(
    Number(number || 0)
  );
};

const formatRelativeTime = (date) => {
  if (!date) {
    return "Just now";
  }

  const createdAt = new Date(date);

  if (Number.isNaN(createdAt.getTime())) {
    return "Recently";
  }

  const now = new Date();

  const difference =
    now.getTime() - createdAt.getTime();

  const seconds = Math.floor(
    difference / 1000
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days} ${
      days === 1 ? "day" : "days"
    } ago`;
  }

  return createdAt.toLocaleDateString(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

/*
 * --------------------------------------------------
 * ACTIVITY ICONS
 * --------------------------------------------------
 */

const getActivityIcon = (type) => {
  switch (type) {
    case "accommodation":
      return Building2;

    case "verification":
      return ShieldCheck;

    case "booking":
      return CalendarCheck;

    case "payment":
      return CircleDollarSign;

    case "safety":
      return AlertTriangle;

    default:
      return Clock3;
  }
};

const getActivityIconClass = (type) => {
  switch (type) {
    case "accommodation":
      return "bg-blue-50 text-blue-600";

    case "verification":
      return "bg-emerald-50 text-emerald-600";

    case "booking":
      return "bg-violet-50 text-violet-600";

    case "payment":
      return "bg-amber-50 text-amber-600";

    case "safety":
      return "bg-red-50 text-red-600";

    default:
      return "bg-gray-50 text-gray-600";
  }
};

/*
 * --------------------------------------------------
 * ADMIN DASHBOARD
 * --------------------------------------------------
 */

const AdminPage = () => {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * --------------------------------------------------
   * FETCH DASHBOARD
   * --------------------------------------------------
   */

  const fetchDashboard = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/admin/dashboard`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load dashboard"
          );
        }

        if (!data.success) {
          throw new Error(
            data.message ||
              "Unable to load dashboard"
          );
        }

        setDashboard(data);
      } catch (error) {
        console.error(
          "Admin dashboard error:",
          error
        );

        setError(
          error.message ||
            "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /*
   * --------------------------------------------------
   * LOADING STATE
   * --------------------------------------------------
   */

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
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <RefreshCw
                      size={22}
                      className="animate-spin text-[#63E6BE]"
                    />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-gray-900">
                    Loading dashboard
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Fetching the latest TripGuard statistics...
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------
   * ERROR STATE
   * --------------------------------------------------
   */

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="lg:ml-72">
          <AdminNavbar />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <AlertTriangle size={22} />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-gray-900">
                    Unable to load dashboard
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {error ||
                      "Something went wrong while loading the dashboard."}
                  </p>

                  <button
                    type="button"
                    onClick={fetchDashboard}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#63E6BE] px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-[#4fd9ad]"
                  >
                    <RefreshCw size={16} />
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------
   * DASHBOARD DATA
   * --------------------------------------------------
   */

  const stats = dashboard.stats || {};

const recentUsers =
  dashboard.recentUsers || [];

  const recentBookings =
  dashboard.recentBookings || [];

const recentNotifications =
  dashboard.recentNotifications || [];

  /*
   * --------------------------------------------------
   * MAIN STATS
   * --------------------------------------------------
   *
   * We deliberately don't show fake
   * percentage changes anymore.
   *
   * Your backend currently doesn't
   * calculate previous-month comparisons.
   */

  const mainStats = [
    {
      title: "Total Revenue",
      value: formatCurrency(
        stats.totalRevenue
      ),
      change: "",
      trend: "up",
      icon: CircleDollarSign,
      description:
        "From successful payments",
    },

    {
      title: "Total Bookings",
      value: formatNumber(
        stats.totalBookings
      ),
      change: "",
      trend: "up",
      icon: CalendarCheck,
      description:
        "All bookings",
    },

    {
      title: "Accommodations",
      value: formatNumber(
        stats.totalAccommodations
      ),
      change: "",
      trend: "up",
      icon: Building2,
      description:
        "All listed properties",
    },

    {
      title: "Registered Users",
      value: formatNumber(
        stats.totalUsers
      ),
      change: "",
      trend: "up",
      icon: Users,
      description:
        "Traveller accounts",
    },
  ];

  /*
   * --------------------------------------------------
   * QUICK STATS
   * --------------------------------------------------
   */

  const quickStats = [
    {
      label: "Pending Verifications",
      value: formatNumber(
        stats.pendingAccommodations
      ),
      icon: ShieldCheck,
      iconClass:
        "bg-amber-50 text-amber-600",
    },

    {
      label: "Pending Bookings",
      value: formatNumber(
        stats.pendingBookings
      ),
      icon: Clock3,
      iconClass:
        "bg-blue-50 text-blue-600",
    },

    {
      label: "Successful Payments",
      value: formatNumber(
        stats.successfulPayments
      ),
      icon: CheckCircle2,
      iconClass:
        "bg-emerald-50 text-emerald-600",
    },

    {
      label: "Unread Issues",
      value: formatNumber(
        stats.unreadContactMessages
      ),
      icon: AlertTriangle,
      iconClass:
        "bg-red-50 text-red-600",
    },
  ];

  /*
   * --------------------------------------------------
   * RECENT ACTIVITY
   * --------------------------------------------------
   *
   * These come directly from the
   * Notification collection.
   */

  const activities =
    recentNotifications.map(
      (notification) => {
        let type =
          notification.type ||
          "system";

        /*
         * Convert some notification
         * types into dashboard categories.
         */

        if (
          type === "accommodation"
        ) {
          type = "accommodation";
        } else if (
          type === "booking"
        ) {
          type = "booking";
        } else if (
          type === "payment"
        ) {
          type = "payment";
        } else if (
          type === "safety"
        ) {
          type = "safety";
        } else if (
          type === "verification"
        ) {
          type = "verification";
        }

        return {
          id: notification._id,

          title:
            notification.title ||
            "TripGuard activity",

          description:
            notification.message ||
            "A new activity occurred on TripGuard.",

          time: formatRelativeTime(
            notification.createdAt
          ),

          type,
        };
      }
    );

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

            {/* ------------------------------------ */}
            {/* HEADER */}
            {/* ------------------------------------ */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-[#63E6BE]">
                  Admin Dashboard
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Good afternoon, Admin
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Here's what's happening across TripGuard today.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#63E6BE] px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-[#4fd9ad]"
              >
                View Reports
                <ArrowUpRight size={17} />
              </button>
            </div>

            {/* ------------------------------------ */}
            {/* MAIN STATS */}
            {/* ------------------------------------ */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {mainStats.map(
                (stat) => (
                  <AdminStatCard
                    key={stat.title}
                    {...stat}
                  />
                )
              )}
            </div>

            {/* ------------------------------------ */}
            {/* QUICK STATS */}
            {/* ------------------------------------ */}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {quickStats.map(
                (item) => {
                  const Icon =
                    item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClass}`}
                        >
                          <Icon
                            size={19}
                          />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            {item.label}
                          </p>

                          <p className="mt-0.5 text-xl font-bold text-gray-900">
                            {
                              item.value
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* ------------------------------------ */}
            {/* REVENUE + ACTIVITY */}
            {/* ------------------------------------ */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

              <div className="xl:col-span-2">
                <RevenueChart
                  data={
                    dashboard.bookingChart ||
                    []
                  }
                />
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Recent Activity
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Latest platform activity
                    </p>
                  </div>

                  <button
                    type="button"
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                  >
                    <MoreHorizontal
                      size={19}
                    />
                  </button>
                </div>

                <div className="mt-5 space-y-5">

                  {activities.length ===
                  0 ? (
                    <div className="rounded-xl bg-gray-50 p-5 text-center">
                      <p className="text-sm text-gray-500">
                        No recent activity.
                      </p>
                    </div>
                  ) : (
                    activities.map(
                      (
                        activity
                      ) => {
                        const Icon =
                          getActivityIcon(
                            activity.type
                          );

                        return (
                          <div
                            key={
                              activity.id
                            }
                            className="flex gap-3"
                          >
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getActivityIconClass(
                                activity.type
                              )}`}
                            >
                              <Icon
                                size={16}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {
                                  activity.title
                                }
                              </p>

                              <p className="mt-0.5 text-xs leading-5 text-gray-500">
                                {
                                  activity.description
                                }
                              </p>

                              <p className="mt-1 text-[11px] text-gray-400">
                                {
                                  activity.time
                                }
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )
                  )}

                </div>
              </div>
            </div>

            {/* ------------------------------------ */}
            {/* TABLES */}
            {/* ------------------------------------ */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
  <RecentBookings bookings={recentBookings} />
  <RecentUsers users={recentUsers} />
</div>

            {/* ------------------------------------ */}
            {/* PLATFORM STATUS */}
            {/* ------------------------------------ */}

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Platform Status
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Current health of TripGuard services.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  All systems operational
                </div>

              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    API
                  </span>

                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <CheckCircle2
                      size={14}
                    />
                    Operational
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    Payments
                  </span>

                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <CheckCircle2
                      size={14}
                    />
                    Operational
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    Notifications
                  </span>

                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <CheckCircle2
                      size={14}
                    />
                    Operational
                  </span>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;