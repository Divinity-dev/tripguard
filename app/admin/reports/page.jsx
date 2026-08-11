"use client";

import { useMemo, useState } from "react";
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

const reportData = {
"7": {
label: "Last 7 days",
revenue: 1284500,
bookings: 42,
users: 86,
accommodations: 18,
completedBookings: 31,
cancelledBookings: 4,
safetyNotifications: 39,
previousRevenue: 1098000,
previousBookings: 36,
},
"30": {
label: "Last 30 days",
revenue: 5827000,
bookings: 187,
users: 364,
accommodations: 42,
completedBookings: 139,
cancelledBookings: 17,
safetyNotifications: 172,
previousRevenue: 5112000,
previousBookings: 164,
},
"90": {
label: "Last 90 days",
revenue: 17482000,
bookings: 593,
users: 1092,
accommodations: 68,
completedBookings: 448,
cancelledBookings: 49,
safetyNotifications: 541,
previousRevenue: 15124000,
previousBookings: 512,
},
"365": {
label: "Last 12 months",
revenue: 62450000,
bookings: 2184,
users: 3864,
accommodations: 126,
completedBookings: 1687,
cancelledBookings: 164,
safetyNotifications: 1996,
previousRevenue: 53890000,
previousBookings: 1862,
},
};

const bookingTrendData = {
"7": [
{ day: "Mon", bookings: 5, revenue: 145000 },
{ day: "Tue", bookings: 7, revenue: 218000 },
{ day: "Wed", bookings: 4, revenue: 126000 },
{ day: "Thu", bookings: 8, revenue: 276000 },
{ day: "Fri", bookings: 6, revenue: 194000 },
{ day: "Sat", bookings: 8, revenue: 231000 },
{ day: "Sun", bookings: 4, revenue: 94600 },
],
"30": [
{ day: "W1", bookings: 39, revenue: 1180000 },
{ day: "W2", bookings: 44, revenue: 1395000 },
{ day: "W3", bookings: 48, revenue: 1572000 },
{ day: "W4", bookings: 56, revenue: 1680000 },
],
"90": [
{ day: "Apr", bookings: 158, revenue: 4720000 },
{ day: "May", bookings: 186, revenue: 5510000 },
{ day: "Jun", bookings: 249, revenue: 7252000 },
],
"365": [
{ day: "Sep", bookings: 124, revenue: 3510000 },
{ day: "Oct", bookings: 138, revenue: 3840000 },
{ day: "Nov", bookings: 147, revenue: 4120000 },
{ day: "Dec", bookings: 183, revenue: 5260000 },
{ day: "Jan", bookings: 161, revenue: 4710000 },
{ day: "Feb", bookings: 174, revenue: 4950000 },
{ day: "Mar", bookings: 186, revenue: 5280000 },
{ day: "Apr", bookings: 194, revenue: 5510000 },
{ day: "May", bookings: 211, revenue: 6020000 },
{ day: "Jun", bookings: 238, revenue: 6880000 },
{ day: "Jul", bookings: 207, revenue: 5940000 },
{ day: "Aug", bookings: 221, revenue: 6330000 },
],
};

const accommodationPerformance = [
{
name: "The Meridian House",
location: "Victoria Island, Lagos",
bookings: 48,
revenue: 1860000,
occupancy: 86,
},
{
name: "Palm Court Residence",
location: "Lekki Phase 1, Lagos",
bookings: 42,
revenue: 1575000,
occupancy: 81,
},
{
name: "Cedar View Suites",
location: "Ikeja, Lagos",
bookings: 37,
revenue: 1284000,
occupancy: 76,
},
{
name: "Lagos Marina Apartments",
location: "Ikoyi, Lagos",
bookings: 31,
revenue: 1108000,
occupancy: 72,
},
{
name: "Harbour Point Residence",
location: "Yaba, Lagos",
bookings: 29,
revenue: 997000,
occupancy: 68,
},
];

const ReportsPage = () => {
const [dateRange, setDateRange] = useState("30");
const [showRangeMenu, setShowRangeMenu] =
useState(false);
const [currentPerformancePage, setCurrentPerformancePage] =
useState(1);

const currentData = reportData[dateRange];
const trendData = bookingTrendData[dateRange];

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

const maxBookings = Math.max(
...trendData.map((item) => item.bookings)
);

const maxRevenue = Math.max(
...trendData.map((item) => item.revenue)
);

const performanceItemsPerPage = 5;

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

const formatCurrency = (amount) => {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency: "NGN",
maximumFractionDigits: 0,
}).format(amount);
};

const formatCompactCurrency = (amount) => {
if (amount >= 1000000) {
return `₦${(amount / 1000000).toFixed(1)}m`;
}
if (amount >= 1000) {
  return `₦${(amount / 1000).toFixed(0)}k`;
}

return `₦${amount}`;


};

const handleDateRangeChange = (range) => {
setDateRange(range);
setShowRangeMenu(false);
setCurrentPerformancePage(1);
};

const handleExport = () => {
const report = {
period: currentData.label,
revenue: currentData.revenue,
bookings: currentData.bookings,
users: currentData.users,
accommodations: currentData.accommodations,
completedBookings:
currentData.completedBookings,
cancelledBookings:
currentData.cancelledBookings,
safetyNotifications:
currentData.safetyNotifications,
};

const blob = new Blob(
  [JSON.stringify(report, null, 2)],
  {
    type: "application/json",
  }
);

const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = `tripguard-report-${dateRange}.json`;
link.click();

URL.revokeObjectURL(url);


};

return ( <div className="min-h-screen bg-gray-50"> <AdminSidebar />

  <div className="lg:ml-72">
    <AdminNavbar />

    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <AdminPageHeader
            title="Reports"
            description="Track TripGuard performance, bookings, revenue, users, and safety activity."
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowRangeMenu((current) => !current)
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50"
              >
                <CalendarDays size={16} />
                {currentData.label}
                <ChevronDown size={15} />
              </button>

              {showRangeMenu && (
                <div className="absolute right-0 top-12 z-30 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
                  {Object.entries(reportData).map(
                    ([key, data]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          handleDateRangeChange(key)
                        }
                        className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition ${
                          dateRange === key
                            ? "bg-[#63E6BE]/10 font-semibold text-[#159669]"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {data.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Main stats */}
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

        {/* Revenue and bookings chart */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Booking performance
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Booking volume and revenue for{" "}
                {currentData.label.toLowerCase()}.
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

          <div className="mt-8 overflow-x-auto">
            <div
              className="flex min-w-[560px] items-end gap-3 sm:gap-5"
              style={{ height: "280px" }}
            >
              {trendData.map((item) => {
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
                    key={item.day}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <div className="flex min-h-0 flex-1 items-end justify-center gap-1.5">
                      <div className="group relative flex h-full w-1/3 items-end justify-center">
                        <div
                          className="w-full max-w-8 rounded-t-md bg-gray-900 transition-all duration-300 group-hover:opacity-80"
                          style={{
                            height: `${bookingHeight}%`,
                          }}
                        />

                        <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] text-white group-hover:block">
                          {item.bookings} bookings
                        </div>
                      </div>

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
                      {item.day}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Secondary statistics */}
        <div className="grid gap-4 lg:grid-cols-3">
          <ReportMiniCard
            icon={CheckCircle2Icon}
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
            value={currentData.safetyNotifications}
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

        {/* Accommodation performance */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-semibold text-gray-900">
                Accommodation performance
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Top-performing accommodations based on
                bookings and revenue.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <BarChart3 size={15} />
              Performance overview
            </div>
          </div>

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
                  (accommodation, index) => (
                    <tr
                      key={accommodation.name}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                            <Hotel size={17} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {accommodation.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              {accommodation.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {accommodation.bookings}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {formatCurrency(
                          accommodation.revenue
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-[#63E6BE]"
                              style={{
                                width: `${accommodation.occupancy}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-semibold text-gray-600">
                            {accommodation.occupancy}%
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
                          {index === 0 ? (
                            <TrendingUp size={12} />
                          ) : (
                            <BarChart3 size={12} />
                          )}

                          {index === 0
                            ? "Top performer"
                            : "Performing"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile performance cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            {paginatedPerformance.map(
              (accommodation, index) => (
                <div
                  key={accommodation.name}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                        <Hotel size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {accommodation.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-gray-400">
                          {accommodation.location}
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
                        {accommodation.bookings}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Revenue
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-800">
                        {formatCurrency(
                          accommodation.revenue
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
                        {accommodation.occupancy}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#63E6BE]"
                        style={{
                          width: `${accommodation.occupancy}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Performance pagination */}
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 sm:px-6">
            <p className="text-xs text-gray-400">
              {accommodationPerformance.length}{" "}
              accommodations
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={
                  currentPerformancePage === 1
                }
                onClick={() =>
                  setCurrentPerformancePage(
                    (page) =>
                      Math.max(1, page - 1)
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              <span className="px-2 text-xs font-medium text-gray-500">
                {currentPerformancePage} /{" "}
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
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* Report summary */}
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
                  During {currentData.label.toLowerCase()},
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

              <div className="h-8 w-px bg-white/10" />

              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-500">
                  Safety
                </p>

                <p className="mt-1 text-lg font-bold">
                  {currentData.safetyNotifications}
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

const CheckCircle2Icon = CheckCircle2;

const ReportStat = ({
icon: Icon,
label,
value,
trend,
iconClass,
}) => {
const hasTrend = typeof trend === "number";
const isPositive = trend >= 0;

return ( <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> <div className="flex items-start justify-between gap-3">
<div
className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
> <Icon size={19} /> </div>

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
Math.max(0, progress)
);

return ( <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> <div className="flex items-center justify-between"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600"> <Icon size={18} /> </div>


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
