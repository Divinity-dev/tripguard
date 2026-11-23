"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Hotel,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RANGE_OPTIONS = {
  "7": "Last 7 days",
  "30": "Last 30 days",
  "90": "Last 90 days",
  "365": "Last 12 months",
};

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState("30");
  const [showRangeMenu, setShowRangeMenu] = useState(false);

  const [report, setReport] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [accommodationPerformance, setAccommodationPerformance] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPerformancePage, setCurrentPerformancePage] =
    useState(1);

  const performanceItemsPerPage = 5;

  const currentData = report || {
    revenue: 0,
    bookings: 0,
    users: 0,
    accommodations: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    safetyNotifications: 0,
    previousRevenue: 0,
    previousBookings: 0,
  };

  const currentLabel =
    RANGE_OPTIONS[dateRange] || "Last 30 days";

  // ==========================================
  // FETCH REPORT
  // ==========================================

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/admin/reports?range=${dateRange}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load report."
          );
        }

        /*
         * Backend response is expected to contain:
         *
         * {
         *   success: true,
         *   report: {...},
         *   trend: [...],
         *   accommodationPerformance: [...]
         * }
         *
         * We also keep the fallbacks below so the page
         * remains tolerant of small response-shape differences.
         */

        const reportData =
          data?.report ||
          data?.data?.report ||
          data?.data ||
          {};

        const trend =
          data?.trend ||
          data?.bookingTrend ||
          data?.data?.trend ||
          [];

        const performance =
          data?.accommodationPerformance ||
          data?.data?.accommodationPerformance ||
          [];

        setReport(reportData);
        setTrendData(Array.isArray(trend) ? trend : []);
        setAccommodationPerformance(
          Array.isArray(performance) ? performance : []
        );

        setCurrentPerformancePage(1);
      } catch (err) {
        console.error("Failed to fetch admin report:", err);

        setError(
          err?.message ||
            "Unable to load the report. Please try again."
        );

        setReport(null);
        setTrendData([]);
        setAccommodationPerformance([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [dateRange]);

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const revenueGrowth = useMemo(() => {
    if (!currentData.previousRevenue) return 0;

    return (
      ((currentData.revenue -
        currentData.previousRevenue) /
        currentData.previousRevenue) *
      100
    );
  }, [currentData]);

  const bookingGrowth = useMemo(() => {
    if (!currentData.previousBookings) return 0;

    return (
      ((currentData.bookings -
        currentData.previousBookings) /
        currentData.previousBookings) *
      100
    );
  }, [currentData]);

  const completionRate =
    currentData.bookings > 0
      ? Math.round(
          (currentData.completedBookings /
            currentData.bookings) *
            100
        )
      : 0;

  const cancellationRate =
    currentData.bookings > 0
      ? Math.round(
          (currentData.cancelledBookings /
            currentData.bookings) *
            100
        )
      : 0;

  const maxBookings =
    trendData.length > 0
      ? Math.max(
          ...trendData.map(
            (item) => Number(item.bookings) || 0
          )
        )
      : 0;

  const maxRevenue =
    trendData.length > 0
      ? Math.max(
          ...trendData.map(
            (item) => Number(item.revenue) || 0
          )
        )
      : 0;

  const performanceTotalPages = Math.max(
    1,
    Math.ceil(
      accommodationPerformance.length /
        performanceItemsPerPage
    )
  );

  const paginatedPerformance =
    accommodationPerformance.slice(
      (currentPerformancePage - 1) *
        performanceItemsPerPage,
      currentPerformancePage *
        performanceItemsPerPage
    );

  // ==========================================
  // FORMATTERS
  // ==========================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const formatCompactCurrency = (amount) => {
    const value = Number(amount) || 0;

    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}m`;
    }

    if (value >= 1000) {
      return `₦${(value / 1000).toFixed(0)}k`;
    }

    return `₦${value}`;
  };

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setShowRangeMenu(false);
    setCurrentPerformancePage(1);
  };

  const handleExport = () => {
    if (!report) return;

    const exportData = {
      period: currentLabel,
      report,
      trend: trendData,
      accommodationPerformance,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob(
      [JSON.stringify(exportData, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `tripguard-report-${dateRange}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="lg:ml-72">
          <AdminNavbar />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <AdminPageHeader
                  title="Reports"
                  description="Track TripGuard performance, bookings, revenue, users, and safety activity."
                />

                <div className="flex items-center gap-2">
                  <div className="h-10 w-36 animate-pulse rounded-xl bg-gray-200" />
                  <div className="h-10 w-24 animate-pulse rounded-xl bg-gray-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-sm"
                  />
                ))}
              </div>

              <div className="h-[390px] animate-pulse rounded-2xl border border-gray-100 bg-white shadow-sm" />

              <div className="grid gap-4 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-sm"
                  />
                ))}
              </div>

              <div className="h-96 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-sm" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="lg:ml-72">
        <AdminNavbar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <AdminPageHeader
                title="Reports"
                description="Track TripGuard performance, bookings, revenue, users, and safety activity."
              />

              <div className="flex flex-wrap items-center gap-2">
                {/* DATE RANGE */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowRangeMenu(
                        (current) => !current
                      )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50"
                  >
                    <CalendarDays size={16} />

                    {currentLabel}

                    <ChevronDown size={15} />
                  </button>

                  {showRangeMenu && (
                    <div className="absolute right-0 top-12 z-30 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
                      {Object.entries(
                        RANGE_OPTIONS
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            handleDateRangeChange(
                              key
                            )
                          }
                          className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition ${
                            dateRange === key
                              ? "bg-[#63E6BE]/10 font-semibold text-[#159669]"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* EXPORT */}
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={!report}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <TrendingDown size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Unable to load reports
                    </p>

                    <p className="mt-1 text-xs text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN STATS */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <ReportStat
                icon={Wallet}
                label="Total revenue"
                value={formatCurrency(
                  currentData.revenue
                )}
                trend={revenueGrowth}
                iconClass="bg-[#63E6BE]/10 text-[#159669]"
              />

              <ReportStat
                icon={CalendarDays}
                label="Total bookings"
                value={currentData.bookings}
                trend={bookingGrowth}
                iconClass="bg-blue-50 text-blue-600"
              />

              <ReportStat
                icon={Users}
                label="New users"
                value={currentData.users}
                iconClass="bg-violet-50 text-violet-600"
              />

              <ReportStat
                icon={Hotel}
                label="Active accommodations"
                value={currentData.accommodations}
                iconClass="bg-orange-50 text-orange-600"
              />
            </div>

            {/* BOOKING PERFORMANCE */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Booking performance
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Booking volume and revenue for{" "}
                    {currentLabel.toLowerCase()}.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
                    Bookings
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#63E6BE]" />
                    Revenue
                  </div>
                </div>
              </div>

              {trendData.length === 0 ? (
                <div className="flex h-[280px] items-center justify-center">
                  <div className="text-center">
                    <BarChart3
                      size={32}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 text-sm font-medium text-gray-500">
                      No trend data available
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      There is not enough activity for
                      this period yet.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-8 overflow-x-auto">
                  <div
                    className="flex min-w-[560px] items-end gap-3 sm:gap-5"
                    style={{ height: "280px" }}
                  >
                    {trendData.map(
                      (item, index) => {
                        const bookings =
                          Number(item.bookings) ||
                          0;

                        const revenue =
                          Number(item.revenue) ||
                          0;

                        const bookingHeight =
                          maxBookings > 0
                            ? Math.max(
                                8,
                                (bookings /
                                  maxBookings) *
                                  100
                              )
                            : 0;

                        const revenueHeight =
                          maxRevenue > 0
                            ? Math.max(
                                8,
                                (revenue /
                                  maxRevenue) *
                                  100
                              )
                            : 0;

                        const label =
                          item.day ||
                          item.label ||
                          item.period ||
                          item.week ||
                          `P${index + 1}`;

                        return (
                          <div
                            key={`${label}-${index}`}
                            className="flex h-full flex-1 flex-col justify-end"
                          >
                            <div className="flex min-h-0 flex-1 items-end justify-center gap-1.5">
                              {/* BOOKINGS */}
                              <div className="group relative flex h-full w-1/3 items-end justify-center">
                                <div
                                  className="w-full max-w-8 rounded-t-md bg-gray-900 transition-all duration-300 group-hover:opacity-80"
                                  style={{
                                    height: `${bookingHeight}%`,
                                  }}
                                />

                                <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] text-white group-hover:block">
                                  {bookings} bookings
                                </div>
                              </div>

                              {/* REVENUE */}
                              <div className="group relative flex h-full w-1/3 items-end justify-center">
                                <div
                                  className="w-full max-w-8 rounded-t-md bg-[#63E6BE] transition-all duration-300 group-hover:opacity-80"
                                  style={{
                                    height: `${revenueHeight}%`,
                                  }}
                                />

                                <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] text-white group-hover:block">
                                  {formatCompactCurrency(
                                    revenue
                                  )}
                                </div>
                              </div>
                            </div>

                            <p className="mt-3 text-center text-[11px] font-medium text-gray-400">
                              {label}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* SECONDARY STATISTICS */}
            <div className="grid gap-4 lg:grid-cols-3">
              <ReportMiniCard
                icon={CheckCircle2}
                title="Booking completion"
                value={`${completionRate}%`}
                description={`${currentData.completedBookings} completed bookings`}
                progress={completionRate}
              />

              <ReportMiniCard
                icon={TrendingDown}
                title="Cancellation rate"
                value={`${cancellationRate}%`}
                description={`${currentData.cancelledBookings} cancelled bookings`}
                progress={cancellationRate}
                progressInverse
              />

              <ReportMiniCard
                icon={ShieldCheck}
                title="Safety notifications"
                value={
                  currentData.safetyNotifications
                }
                description="Notifications processed"
                progress={
                  currentData.bookings > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (currentData.safetyNotifications /
                            currentData.bookings) *
                            100
                        )
                      )
                    : 0
                }
              />
            </div>

            {/* ACCOMMODATION PERFORMANCE */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Accommodation performance
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Top-performing accommodations based
                    on bookings and revenue.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <BarChart3 size={15} />
                  Performance overview
                </div>
              </div>

              {accommodationPerformance.length ===
              0 ? (
                <div className="flex min-h-[240px] items-center justify-center px-5">
                  <div className="text-center">
                    <Hotel
                      size={34}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 text-sm font-medium text-gray-500">
                      No accommodation performance
                      data
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      There is no accommodation activity
                      to display for this period.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* DESKTOP TABLE */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/70">
                          <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Accommodation
                          </th>

                          <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Bookings
                          </th>

                          <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Revenue
                          </th>

                          <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Occupancy
                          </th>

                          <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Performance
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {paginatedPerformance.map(
                          (
                            accommodation,
                            index
                          ) => {
                            const name =
                              accommodation.name ||
                              accommodation.accommodationName ||
                              "Unknown accommodation";

                            const location =
                              accommodation.location ||
                              accommodation.address ||
                              "Location unavailable";

                            const bookings =
                              Number(
                                accommodation.bookings
                              ) || 0;

                            const revenue =
                              Number(
                                accommodation.revenue
                              ) || 0;

                            const occupancy = Math.min(
                              100,
                              Math.max(
                                0,
                                Number(
                                  accommodation.occupancy
                                ) || 0
                              )
                            );

                            return (
                              <tr
                                key={
                                  accommodation._id ||
                                  accommodation.id ||
                                  name
                                }
                                className="transition hover:bg-gray-50"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                                      <Hotel
                                        size={17}
                                      />
                                    </div>

                                    <div>
                                      <p className="text-sm font-semibold text-gray-800">
                                        {name}
                                      </p>

                                      <p className="mt-0.5 text-xs text-gray-400">
                                        {location}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                                  {bookings}
                                </td>

                                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                                  {formatCurrency(
                                    revenue
                                  )}
                                </td>

                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                                      <div
                                        className="h-full rounded-full bg-[#63E6BE]"
                                        style={{
                                          width: `${occupancy}%`,
                                        }}
                                      />
                                    </div>

                                    <span className="text-xs font-semibold text-gray-600">
                                      {occupancy}%
                                    </span>
                                  </div>
                                </td>

                                <td className="px-6 py-4 text-right">
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                      index === 0
                                        ? "bg-[#63E6BE]/10 text-[#159669]"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                                  >
                                    {index ===
                                    0 ? (
                                      <TrendingUp
                                        size={12}
                                      />
                                    ) : (
                                      <BarChart3
                                        size={12}
                                      />
                                    )}

                                    {index ===
                                    0
                                      ? "Top performer"
                                      : "Performing"}
                                  </span>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARDS */}
                  <div className="divide-y divide-gray-100 md:hidden">
                    {paginatedPerformance.map(
                      (
                        accommodation,
                        index
                      ) => {
                        const name =
                          accommodation.name ||
                          accommodation.accommodationName ||
                          "Unknown accommodation";

                        const location =
                          accommodation.location ||
                          accommodation.address ||
                          "Location unavailable";

                        const bookings =
                          Number(
                            accommodation.bookings
                          ) || 0;

                        const revenue =
                          Number(
                            accommodation.revenue
                          ) || 0;

                        const occupancy = Math.min(
                          100,
                          Math.max(
                            0,
                            Number(
                              accommodation.occupancy
                            ) || 0
                          )
                        );

                        return (
                          <div
                            key={
                              accommodation._id ||
                              accommodation.id ||
                              name
                            }
                            className="p-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                                  <Hotel
                                    size={17}
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-gray-800">
                                    {name}
                                  </p>

                                  <p className="mt-0.5 truncate text-xs text-gray-400">
                                    {location}
                                  </p>
                                </div>
                              </div>

                              {index === 0 && (
                                <span className="shrink-0 rounded-full bg-[#63E6BE]/10 px-2 py-1 text-[10px] font-semibold text-[#159669]">
                                  Top
                                </span>
                              )}
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                  Bookings
                                </p>

                                <p className="mt-1 text-sm font-bold text-gray-800">
                                  {bookings}
                                </p>
                              </div>

                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                  Revenue
                                </p>

                                <p className="mt-1 text-sm font-bold text-gray-800">
                                  {formatCurrency(
                                    revenue
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <div className="mb-1.5 flex items-center justify-between">
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                  Occupancy
                                </span>

                                <span className="text-xs font-semibold text-gray-600">
                                  {occupancy}%
                                </span>
                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full bg-[#63E6BE]"
                                  style={{
                                    width: `${occupancy}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* PAGINATION */}
                  <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 sm:px-6">
                    <p className="text-xs text-gray-400">
                      {accommodationPerformance.length}{" "}
                      accommodations
                    </p>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={
                          currentPerformancePage ===
                          1
                        }
                        onClick={() =>
                          setCurrentPerformancePage(
                            (page) =>
                              Math.max(
                                1,
                                page - 1
                              )
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Previous page"
                      >
                        <ChevronLeft
                          size={15}
                        />
                      </button>

                      <span className="px-2 text-xs font-medium text-gray-500">
                        {currentPerformancePage}{" "}
                        /{" "}
                        {performanceTotalPages}
                      </span>

                      <button
                        type="button"
                        disabled={
                          currentPerformancePage ===
                          performanceTotalPages
                        }
                        onClick={() =>
                          setCurrentPerformancePage(
                            (page) =>
                              Math.min(
                                performanceTotalPages,
                                page + 1
                              )
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Next page"
                      >
                        <ChevronRight
                          size={15}
                        />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* REPORT SUMMARY */}
            <section className="rounded-2xl border border-gray-100 bg-gray-900 p-5 text-white shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Report summary
                    </h2>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">
                      During{" "}
                      {currentLabel.toLowerCase()},
                      TripGuard processed{" "}
                      <span className="font-semibold text-white">
                        {currentData.bookings}
                      </span>{" "}
                      bookings and generated{" "}
                      <span className="font-semibold text-[#63E6BE]">
                        {formatCurrency(
                          currentData.revenue
                        )}
                      </span>{" "}
                      in revenue.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-500">
                      Completion
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      {completionRate}%
                    </p>
                  </div>

                  <div className="hidden h-8 w-px bg-white/10 sm:block" />

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-500">
                      Safety
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      {
                        currentData.safetyNotifications
                      }
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

// ==========================================
// REPORT STAT
// ==========================================

const ReportStat = ({
  icon: Icon,
  label,
  value,
  trend,
  iconClass,
}) => {
  const hasTrend = typeof trend === "number";
  const isPositive = trend >= 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </div>

        {hasTrend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp size={11} />
            ) : (
              <TrendingDown size={11} />
            )}

            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 truncate text-xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};

// ==========================================
// REPORT MINI CARD
// ==========================================

const ReportMiniCard = ({
  icon: Icon,
  title,
  value,
  description,
  progress,
  progressInverse = false,
}) => {
  const normalizedProgress = Math.min(
    100,
    Math.max(0, Number(progress) || 0)
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <Icon size={18} />
        </div>

        <span className="text-xl font-bold text-gray-900">
          {value}
        </span>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-gray-800">
        {title}
      </h3>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${
            progressInverse
              ? "bg-gray-800"
              : "bg-[#63E6BE]"
          }`}
          style={{
            width: `${normalizedProgress}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ReportsPage;