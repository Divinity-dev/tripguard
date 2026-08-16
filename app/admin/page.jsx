"use client";

import Link from "next/link";
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

const dashboardStats = [
{
label: "Total revenue",
value: "₦5.83m",
change: "+14.0%",
description: "vs previous period",
icon: Wallet,
iconClass: "bg-[#63E6BE]/10 text-[#159669]",
positive: true,
},
{
label: "Total bookings",
value: "187",
change: "+14.0%",
description: "vs previous period",
icon: CalendarDays,
iconClass: "bg-blue-50 text-blue-600",
positive: true,
},
{
label: "Registered users",
value: "364",
change: "+18.2%",
description: "this month",
icon: Users,
iconClass: "bg-violet-50 text-violet-600",
positive: true,
},
{
label: "Accommodations",
value: "42",
change: "+6",
description: "new this month",
icon: Hotel,
iconClass: "bg-orange-50 text-orange-600",
positive: true,
},
];

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

const recentBookings = [
{
id: "TG-10284",
guest: "Daniel Okafor",
accommodation: "The Meridian House",
location: "Victoria Island, Lagos",
amount: "₦285,000",
status: "confirmed",
date: "Aug 10, 2026",
},
{
id: "TG-10283",
guest: "Chiamaka Eze",
accommodation: "Palm Court Residence",
location: "Lekki Phase 1, Lagos",
amount: "₦198,000",
status: "confirmed",
date: "Aug 10, 2026",
},
{
id: "TG-10282",
guest: "Tunde Adeyemi",
accommodation: "Cedar View Suites",
location: "Ikeja, Lagos",
amount: "₦165,000",
status: "completed",
date: "Aug 9, 2026",
},
{
id: "TG-10281",
guest: "Aisha Bello",
accommodation: "Lagos Marina Apartments",
location: "Ikoyi, Lagos",
amount: "₦242,000",
status: "active",
date: "Aug 9, 2026",
},
{
id: "TG-10280",
guest: "Michael Johnson",
accommodation: "The Meridian House",
location: "Victoria Island, Lagos",
amount: "₦315,000",
status: "completed",
date: "Aug 8, 2026",
},
];

const notifications = [
{
id: 1,
title: "Safety notification delivered",
description:
"Check-in details were sent to Sarah Okafor.",
time: "18 min ago",
type: "success",
icon: ShieldCheck,
},
{
id: 2,
title: "New accommodation submitted",
description:
"Harbour Point Residence is awaiting review.",
time: "42 min ago",
type: "info",
icon: Hotel,
},
{
id: 3,
title: "Safety notification failed",
description:
"Check-out email for Femi Williams could not be delivered.",
time: "2 hrs ago",
type: "danger",
icon: ShieldAlert,
},
{
id: 4,
title: "New booking received",
description:
"Daniel Okafor booked The Meridian House.",
time: "3 hrs ago",
type: "booking",
icon: CalendarDays,
},
];

const topAccommodations = [
{
name: "The Meridian House",
location: "Victoria Island, Lagos",
bookings: 48,
revenue: "₦1.86m",
occupancy: 86,
},
{
name: "Palm Court Residence",
location: "Lekki Phase 1, Lagos",
bookings: 42,
revenue: "₦1.58m",
occupancy: 81,
},
{
name: "Cedar View Suites",
location: "Ikeja, Lagos",
bookings: 37,
revenue: "₦1.28m",
occupancy: 76,
},
{
name: "Lagos Marina Apartments",
location: "Ikoyi, Lagos",
bookings: 31,
revenue: "₦1.11m",
occupancy: 72,
},
];

const AdminDashboard = () => {
const maxBookings = Math.max(
...bookingChart.map((item) => item.bookings)
);

const maxRevenue = Math.max(
...bookingChart.map((item) => item.revenue)
);

return (
    <ProtectedRoute allowedRole="admin">
   <div className="min-h-screen bg-gray-50"> <AdminSidebar />


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
              August 11, 2026
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <DashboardStat
              key={stat.label}
              {...stat}
            />
          ))}
        </div>

        {/* Main analytics */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Chart */}
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
                {bookingChart.map((item) => {
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
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Safety overview */}
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
                  value="172"
                  icon={ShieldCheck}
                  iconClass="text-emerald-600 bg-emerald-50"
                />

                <SafetyMetric
                  label="Pending attention"
                  value="8"
                  icon={Clock3}
                  iconClass="text-amber-600 bg-amber-50"
                />

                <SafetyMetric
                  label="Failed notifications"
                  value="7"
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
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#63E6BE]/10 text-xs font-bold text-[#159669]">
                            {getInitials(
                              booking.guest
                            )}
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-800">
                              {booking.guest}
                            </p>

                            <p className="mt-0.5 text-[10px] text-gray-400">
                              {booking.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-xs font-medium text-gray-700">
                          {booking.accommodation}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                          <MapPin size={10} />
                          {booking.location}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                        {booking.amount}
                      </td>

                      <td className="px-6 py-4">
                        <BookingStatus
                          status={booking.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile bookings */}
            <div className="divide-y divide-gray-100 md:hidden">
              {recentBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="block p-5 transition hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#63E6BE]/10 text-xs font-bold text-[#159669]">
                        {getInitials(
                          booking.guest
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-gray-800">
                          {booking.guest}
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {booking.id}
                        </p>
                      </div>
                    </div>

                    <BookingStatus
                      status={booking.status}
                    />
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-700">
                      {booking.accommodation}
                    </p>

                    <p className="mt-1 text-xs font-bold text-gray-900">
                      {booking.amount}
                    </p>
                  </div>
                </Link>
              ))}
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
              {notifications.map((notification) => {
                const Icon = notification.icon;

                return (
                  <div
                    key={notification.id}
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
                          {notification.description}
                        </p>

                        <p className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock3 size={10} />
                          {notification.time}
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
            {topAccommodations.map(
              (accommodation, index) => (
                <div
                  key={accommodation.name}
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
                    {accommodation.name}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-gray-400">
                    <MapPin size={10} />
                    {accommodation.location}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">
                        Bookings
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-800">
                        {accommodation.bookings}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">
                        Revenue
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-800">
                        {accommodation.revenue}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        Occupancy
                      </span>

                      <span className="text-[10px] font-semibold text-gray-600">
                        {accommodation.occupancy}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
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
        </section>

        {/* Quick actions */}
        <section className="rounded-2xl border border-gray-100 bg-gray-900 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-white">
                Quick actions
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Jump directly to the areas that need your
                attention.
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
}) => {
return ( <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> <div className="flex items-start justify-between gap-3">
<div
className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
> <Icon size={19} /> </div>


    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
        positive
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
    {value}
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
return ( <div className="flex items-center gap-2.5">
<div
className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
> <Icon size={14} /> </div>


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
status === "active" ? ( <CheckCircle2 size={11} />
) : status === "pending" ? ( <Clock3 size={11} />
) : status === "cancelled" ? ( <AlertCircle size={11} />
) : ( <CheckCircle2 size={11} />
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
return ( <Link
   href={href}
   className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-medium text-gray-300 transition hover:border-[#63E6BE]/30 hover:bg-[#63E6BE]/10 hover:text-[#63E6BE]"
 > <Icon
     size={15}
     className="shrink-0 transition-transform group-hover:scale-110"
   />

  <span className="truncate">{label}</span>
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

const getNotificationIconClass = (type) => {
const classes = {
success: "bg-emerald-50 text-emerald-600",
info: "bg-blue-50 text-blue-600",
danger: "bg-red-50 text-red-600",
booking: "bg-[#63E6BE]/10 text-[#159669]",
};

return (
classes[type] ||
"bg-gray-100 text-gray-500"
);
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

export default AdminDashboard;
