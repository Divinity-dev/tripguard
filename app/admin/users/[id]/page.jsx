"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
ArrowLeft,
Ban,
CalendarDays,
CheckCircle2,
Clock3,
Edit3,
Eye,
FileCheck2,
Mail,
MapPin,
MoreVertical,
Phone,
ShieldAlert,
ShieldCheck,
UserRound,
UserX,
Wallet,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";

const users = {
"USR-1001": {
id: "USR-1001",
name: "Daniel Okafor",
email: "[daniel.okafor@example.com](mailto:daniel.okafor@example.com)",
phone: "+234 801 234 5678",
type: "traveller",
status: "active",
verified: true,
joined: "August 2, 2026",
lastActive: "18 minutes ago",
location: "Lagos, Nigeria",
avatar: null,
totalBookings: 8,
completedBookings: 6,
activeBookings: 1,
cancelledBookings: 1,
totalSpent: "₦1,842,000",
safetyProtected: 7,
safetyNotifications: 14,
},

"USR-1002": {
id: "USR-1002",
name: "Chiamaka Eze",
email: "[chiamaka.eze@example.com](mailto:chiamaka.eze@example.com)",
phone: "+234 802 345 6789",
type: "traveller",
status: "active",
verified: true,
joined: "July 29, 2026",
lastActive: "1 hour ago",
location: "Abuja, Nigeria",
avatar: null,
totalBookings: 5,
completedBookings: 4,
activeBookings: 1,
cancelledBookings: 0,
totalSpent: "₦936,000",
safetyProtected: 5,
safetyNotifications: 10,
},

"USR-1003": {
id: "USR-1003",
name: "Tunde Adeyemi",
email: "[tunde.adeyemi@example.com](mailto:tunde.adeyemi@example.com)",
phone: "+234 803 456 7890",
type: "traveller",
status: "active",
verified: true,
joined: "July 24, 2026",
lastActive: "2 hours ago",
location: "Ibadan, Nigeria",
avatar: null,
totalBookings: 12,
completedBookings: 9,
activeBookings: 2,
cancelledBookings: 1,
totalSpent: "₦2,418,000",
safetyProtected: 11,
safetyNotifications: 22,
},

"USR-1004": {
id: "USR-1004",
name: "Aisha Bello",
email: "[aisha.bello@example.com](mailto:aisha.bello@example.com)",
phone: "+234 804 567 8901",
type: "traveller",
status: "active",
verified: false,
joined: "July 20, 2026",
lastActive: "Yesterday",
location: "Kano, Nigeria",
avatar: null,
totalBookings: 3,
completedBookings: 2,
activeBookings: 1,
cancelledBookings: 0,
totalSpent: "₦520,000",
safetyProtected: 3,
safetyNotifications: 6,
},

"USR-1005": {
id: "USR-1005",
name: "Michael Johnson",
email: "[michael.johnson@example.com](mailto:michael.johnson@example.com)",
phone: "+234 805 678 9012",
type: "traveller",
status: "inactive",
verified: true,
joined: "July 17, 2026",
lastActive: "3 days ago",
location: "Port Harcourt, Nigeria",
avatar: null,
totalBookings: 7,
completedBookings: 7,
activeBookings: 0,
cancelledBookings: 0,
totalSpent: "₦1,430,000",
safetyProtected: 7,
safetyNotifications: 14,
},
};

const bookingHistory = [
{
id: "TG-10284",
accommodation: "The Meridian House",
location: "Victoria Island, Lagos",
checkIn: "Aug 10, 2026",
checkOut: "Aug 15, 2026",
amount: "₦285,000",
status: "active",
},
{
id: "TG-10192",
accommodation: "Palm Court Residence",
location: "Lekki Phase 1, Lagos",
checkIn: "Jul 20, 2026",
checkOut: "Jul 25, 2026",
amount: "₦198,000",
status: "completed",
},
{
id: "TG-10081",
accommodation: "Cedar View Suites",
location: "Ikeja, Lagos",
checkIn: "Jul 4, 2026",
checkOut: "Jul 8, 2026",
amount: "₦165,000",
status: "completed",
},
{
id: "TG-09942",
accommodation: "Lagos Marina Apartments",
location: "Ikoyi, Lagos",
checkIn: "Jun 15, 2026",
checkOut: "Jun 20, 2026",
amount: "₦242,000",
status: "cancelled",
},
];

const safetyActivity = [
{
title: "Check-in notification delivered",
description:
"Safety details were successfully delivered to the designated loved one.",
time: "Aug 10, 2026 • 2:14 PM",
type: "success",
},
{
title: "Check-out notification delivered",
description:
"A check-out notification was successfully delivered.",
time: "Jul 25, 2026 • 11:03 AM",
type: "success",
},
{
title: "Safety contact added",
description:
"A new loved-one contact was added to the booking.",
time: "Jul 20, 2026 • 8:45 AM",
type: "info",
},
{
title: "Safety protection activated",
description:
"TripGuard protection was activated for a new booking.",
time: "Jul 4, 2026 • 4:31 PM",
type: "success",
},
];

const AdminUserDetailsPage = () => {
const params = useParams();

const userId = params?.id;
const user = users[userId] || users["USR-1001"];

return ( <div className="min-h-screen bg-gray-50"> <AdminSidebar />


  <div className="lg:ml-72">
    <AdminNavbar />

    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Back */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={15} />
          Back to users
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <AdminPageHeader
            title="User details"
            description={`Manage and review ${user.name}'s TripGuard account.`}
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
            >
              <Edit3 size={14} />
              Edit user
            </button>

            <button
              type="button"
              className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition ${
                user.status === "suspended"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              {user.status === "suspended" ? (
                <>
                  <CheckCircle2 size={14} />
                  Activate
                </>
              ) : (
                <>
                  <Ban size={14} />
                  Suspend
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile overview */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="h-28 bg-gray-900 sm:h-36" />

          <div className="px-5 pb-6 sm:px-6">
            <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#63E6BE]/10 text-2xl font-bold text-[#159669] shadow-sm sm:h-24 sm:w-24">
                  {getInitials(user.name)}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">
                      {user.name}
                    </h1>

                    <UserStatus
                      status={user.status}
                    />
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    {user.id}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <UserTypeBadge type={user.type} />

                {user.verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-600">
                    <CheckCircle2 size={11} />
                    Verified account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 text-[10px] font-semibold text-amber-600">
                    <Clock3 size={11} />
                    Verification pending
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <DetailStat
            icon={CalendarDays}
            label="Total bookings"
            value={user.totalBookings}
            iconClass="bg-blue-50 text-blue-600"
          />

          <DetailStat
            icon={CheckCircle2}
            label="Completed"
            value={user.completedBookings}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <DetailStat
            icon={ShieldCheck}
            label="Protected trips"
            value={user.safetyProtected}
            iconClass="bg-[#63E6BE]/10 text-[#159669]"
          />

          <DetailStat
            icon={Wallet}
            label="Total spent"
            value={user.totalSpent}
            iconClass="bg-violet-50 text-violet-600"
          />
        </div>

        {/* Main content */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 xl:col-span-2">
            {/* Account information */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Account information
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Personal and account details.
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InfoItem
                  icon={UserRound}
                  label="Full name"
                  value={user.name}
                />

                <InfoItem
                  icon={Mail}
                  label="Email address"
                  value={user.email}
                />

                <InfoItem
                  icon={Phone}
                  label="Phone number"
                  value={user.phone}
                />

                <InfoItem
                  icon={MapPin}
                  label="Location"
                  value={user.location}
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Joined"
                  value={user.joined}
                />

                <InfoItem
                  icon={Clock3}
                  label="Last active"
                  value={user.lastActive}
                />
              </div>
            </section>

            {/* Booking history */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Booking history
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Recent bookings made by this user.
                  </p>
                </div>

                <Link
                  href="/admin/bookings"
                  className="text-xs font-semibold text-[#159669] hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Accommodation
                      </th>

                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Dates
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
                    {bookingHistory.map(
                      (booking) => (
                        <tr
                          key={booking.id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <p className="text-xs font-semibold text-gray-800">
                              {
                                booking.accommodation
                              }
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                              <MapPin size={10} />
                              {
                                booking.location
                              }
                            </p>

                            <p className="mt-1 text-[10px] text-gray-400">
                              {booking.id}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-xs font-medium text-gray-600">
                              {booking.checkIn}
                            </p>

                            <p className="mt-1 text-[10px] text-gray-400">
                              to{" "}
                              {booking.checkOut}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                            {booking.amount}
                          </td>

                          <td className="px-6 py-4">
                            <BookingStatus
                              status={
                                booking.status
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-gray-100 md:hidden">
                {bookingHistory.map(
                  (booking) => (
                    <div
                      key={booking.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-800">
                            {
                              booking.accommodation
                            }
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                            <MapPin size={10} />
                            {
                              booking.location
                            }
                          </p>
                        </div>

                        <BookingStatus
                          status={
                            booking.status
                          }
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-gray-400">
                            Dates
                          </p>

                          <p className="mt-1 text-xs font-medium text-gray-600">
                            {booking.checkIn}
                          </p>

                          <p className="text-[10px] text-gray-400">
                            to {booking.checkOut}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-gray-400">
                            Amount
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-800">
                            {booking.amount}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Safety activity */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Safety activity
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Recent TripGuard protection activity.
                  </p>
                </div>

                <Link
                  href="/admin/safety"
                  className="text-xs font-semibold text-[#159669] hover:underline"
                >
                  Safety center
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                {safetyActivity.map(
                  (activity, index) => (
                    <div
                      key={`${activity.title}-${index}`}
                      className="flex gap-3"
                    >
                      <div
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          activity.type ===
                          "success"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {activity.type ===
                        "success" ? (
                          <ShieldCheck
                            size={15}
                          />
                        ) : (
                          <ShieldAlert
                            size={15}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-800">
                          {activity.title}
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-gray-400">
                          {
                            activity.description
                          }
                        </p>

                        <p className="mt-1.5 text-[10px] text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Account status */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-semibold text-gray-900">
                Account status
              </h2>

              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        user.status ===
                        "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {user.status ===
                      "active" ? (
                        <CheckCircle2
                          size={16}
                        />
                      ) : (
                        <UserX size={16} />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {capitalize(
                          user.status
                        )}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Account status
                      </p>
                    </div>
                  </div>

                  <UserStatus
                    status={user.status}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <StatusRow
                  label="Email verification"
                  value={
                    user.verified
                      ? "Verified"
                      : "Pending"
                  }
                  success={user.verified}
                />

                <StatusRow
                  label="Safety protection"
                  value={`${user.safetyProtected} trips`}
                  success
                />

                <StatusRow
                  label="Safety notifications"
                  value={`${user.safetyNotifications}`}
                  success
                />
              </div>
            </section>

            {/* Verification */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <FileCheck2 size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Identity verification
                  </h2>

                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Account verification status.
                  </p>
                </div>
              </div>

              <div
                className={`mt-5 rounded-xl p-4 ${
                  user.verified
                    ? "bg-emerald-50"
                    : "bg-amber-50"
                }`}
              >
                <div className="flex gap-3">
                  {user.verified ? (
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                  ) : (
                    <Clock3
                      size={17}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />
                  )}

                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        user.verified
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {user.verified
                        ? "Identity verified"
                        : "Verification pending"}
                    </p>

                    <p
                      className={`mt-1 text-[10px] leading-5 ${
                        user.verified
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {user.verified
                        ? "This user's account has passed the required verification checks."
                        : "This user has not completed the required verification process."}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <Eye size={14} />
                Review verification
              </button>
            </section>

            {/* Admin actions */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-semibold text-gray-900">
                Admin actions
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Actions available for this account.
              </p>

              <div className="mt-5 space-y-2">
                <AdminAction
                  icon={Mail}
                  label="Send email"
                />

                <AdminAction
                  icon={Eye}
                  label="View public profile"
                />

                <AdminAction
                  icon={ShieldCheck}
                  label="View safety activity"
                />

                <AdminAction
                  icon={Ban}
                  label={
                    user.status ===
                    "suspended"
                      ? "Reactivate account"
                      : "Suspend account"
                  }
                  danger={
                    user.status !==
                    "suspended"
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>


);
};

const DetailStat = ({
icon: Icon,
label,
value,
iconClass,
}) => {
return ( <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
<div
className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
> <Icon size={18} /> </div>


  <p className="mt-4 text-xs text-gray-500">
    {label}
  </p>

  <p className="mt-1 truncate text-xl font-bold text-gray-900">
    {value}
  </p>
</div>


);
};

const InfoItem = ({
icon: Icon,
label,
value,
}) => {
return ( <div className="flex gap-3"> <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400"> <Icon size={15} /> </div>


  <div className="min-w-0">
    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
      {label}
    </p>

    <p className="mt-1 truncate text-xs font-semibold text-gray-700">
      {value}
    </p>
  </div>
</div>


);
};

const StatusRow = ({
label,
value,
success,
}) => {
return ( <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0"> <span className="text-xs text-gray-500">
{label} </span>


  <span
    className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
      success
        ? "text-emerald-600"
        : "text-amber-600"
    }`}
  >
    {success && <CheckCircle2 size={11} />}
    {value}
  </span>
</div>


);
};

const AdminAction = ({
icon: Icon,
label,
danger = false,
}) => {
return (
<button
type="button"
className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-xs font-semibold transition ${
        danger
          ? "border-red-100 text-red-600 hover:bg-red-50"
          : "border-gray-100 text-gray-600 hover:bg-gray-50"
      }`}
> <Icon size={15} />
{label} </button>
);
};

const UserTypeBadge = ({ type }) => {
return (
<span
className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
        type === "owner"
          ? "bg-orange-50 text-orange-600"
          : "bg-blue-50 text-blue-600"
      }`}
> <UserRound size={11} />
{type === "owner"
? "Accommodation owner"
: "Traveller"} </span>
);
};

const UserStatus = ({ status }) => {
const config = {
active: {
label: "Active",
className:
"bg-emerald-50 text-emerald-600",
icon: CheckCircle2,
},
inactive: {
label: "Inactive",
className:
"bg-gray-100 text-gray-500",
icon: Clock3,
},
pending: {
label: "Pending",
className:
"bg-amber-50 text-amber-600",
icon: Clock3,
},
suspended: {
label: "Suspended",
className:
"bg-red-50 text-red-600",
icon: UserX,
},
};

const current =
config[status] || config.inactive;

const Icon = current.icon;

return (
<span
className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${current.className}`}
> <Icon size={11} />
{current.label} </span>
);
};

const BookingStatus = ({ status }) => {
const config = {
active: {
label: "Active",
className:
"bg-[#63E6BE]/10 text-[#159669]",
},
completed: {
label: "Completed",
className:
"bg-emerald-50 text-emerald-600",
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

const current =
config[status] || config.pending;

return (
<span
className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${current.className}`}
>
{status === "completed" ||
status === "active" ? ( <CheckCircle2 size={11} />
) : status === "cancelled" ? ( <ShieldAlert size={11} />
) : ( <Clock3 size={11} />
)}


  {current.label}
</span>


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

const capitalize = (value) => {
if (!value) {
return "";
}

return (
value.charAt(0).toUpperCase() +
value.slice(1)
);
};

export default AdminUserDetailsPage;
