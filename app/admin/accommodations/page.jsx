"use client";

import {
Building2,
CalendarCheck,
CircleDollarSign,
ShieldCheck,
Users,
ArrowUpRight,
ArrowDownRight,
MoreHorizontal,
Clock3,
CheckCircle2,
XCircle,
AlertTriangle,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminStatCard from "@/component/admin/AdminStatCard";
import RecentBookings from "@/component/admin/RecentBookings";
import RecentUsers from "@/component/admin/RecentUsers";
import RevenueChart from "@/component/admin/RevenueChart";

const stats = [
{
title: "Total Revenue",
value: "₦8,420,500",
change: "+12.8%",
trend: "up",
icon: CircleDollarSign,
description: "vs. last month",
},
{
title: "Total Bookings",
value: "1,284",
change: "+8.4%",
trend: "up",
icon: CalendarCheck,
description: "vs. last month",
},
{
title: "Accommodations",
value: "486",
change: "+5.2%",
trend: "up",
icon: Building2,
description: "vs. last month",
},
{
title: "Registered Users",
value: "12,840",
change: "+14.6%",
trend: "up",
icon: Users,
description: "vs. last month",
},
];

const quickStats = [
{
label: "Pending Verifications",
value: "24",
icon: ShieldCheck,
iconClass: "bg-amber-50 text-amber-600",
},
{
label: "Pending Bookings",
value: "18",
icon: Clock3,
iconClass: "bg-blue-50 text-blue-600",
},
{
label: "Completed Bookings",
value: "1,126",
icon: CheckCircle2,
iconClass: "bg-emerald-50 text-emerald-600",
},
{
label: "Reported Issues",
value: "7",
icon: AlertTriangle,
iconClass: "bg-red-50 text-red-600",
},
];

const activities = [
{
title: "New accommodation submitted",
description: "Palm Court Residence was submitted for approval.",
time: "12 minutes ago",
type: "accommodation",
},
{
title: "New owner verification",
description: "A new accommodation owner submitted verification documents.",
time: "35 minutes ago",
type: "verification",
},
{
title: "Booking completed",
description: "Booking TG-10284 was successfully completed.",
time: "1 hour ago",
type: "booking",
},
{
title: "Safety alert resolved",
description: "A reported safety issue has been resolved.",
time: "2 hours ago",
type: "safety",
},
];

const activityIcon = {
accommodation: Building2,
verification: ShieldCheck,
booking: CalendarCheck,
safety: AlertTriangle,
};

const activityIconClass = {
accommodation: "bg-blue-50 text-blue-600",
verification: "bg-emerald-50 text-emerald-600",
booking: "bg-violet-50 text-violet-600",
safety: "bg-red-50 text-red-600",
};

const AdminPage = () => {
return ( <div className="min-h-screen bg-gray-50"> <AdminSidebar />

  <div className="lg:ml-72">
    <AdminNavbar />

    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
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

          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#63E6BE] px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-[#4fd9ad]">
            View Reports
            <ArrowUpRight size={17} />
          </button>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <AdminStatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {quickStats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClass}`}
                  >
                    <Icon size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="mt-0.5 text-xl font-bold text-gray-900">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue + activity */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RevenueChart />
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

              <button className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700">
                <MoreHorizontal size={19} />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {activities.map((activity) => {
                const Icon = activityIcon[activity.type];

                return (
                  <div
                    key={`${activity.title}-${activity.time}`}
                    className="flex gap-3"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activityIconClass[activity.type]}`}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-gray-500">
                        {activity.description}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RecentBookings />
          <RecentUsers />
        </div>

        {/* Platform status */}
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
              <span className="text-sm text-gray-600">API</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 size={14} />
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">Payments</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 size={14} />
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">Notifications</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 size={14} />
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
