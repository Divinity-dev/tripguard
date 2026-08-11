"use client";

import { useMemo, useState } from "react";
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
Mail,
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

const safetyRecords = [
{
id: "TG-10284",
guest: "Daniel Okafor",
guestEmail: "[daniel.okafor@example.com](mailto:daniel.okafor@example.com)",
accommodation: "The Meridian House",
location: "Victoria Island, Lagos",
checkIn: "Aug 12, 2026",
checkOut: "Aug 16, 2026",
status: "protected",
notificationStatus: "scheduled",
lastNotification: "Booking confirmation sent",
lastNotificationTime: "18 min ago",
emergencyContact: "Sarah Okafor",
emergencyEmail: "[sarah.okafor@example.com](mailto:sarah.okafor@example.com)",
},
{
id: "TG-10283",
guest: "Chiamaka Eze",
guestEmail: "[chiamaka.eze@example.com](mailto:chiamaka.eze@example.com)",
accommodation: "Palm Court Residence",
location: "Lekki Phase 1, Lagos",
checkIn: "Aug 12, 2026",
checkOut: "Aug 15, 2026",
status: "attention",
notificationStatus: "pending",
lastNotification: "Awaiting check-in notification",
lastNotificationTime: "1 hr ago",
emergencyContact: "Emeka Eze",
emergencyEmail: "[emeka.eze@example.com](mailto:emeka.eze@example.com)",
},
{
id: "TG-10282",
guest: "Tunde Adeyemi",
guestEmail: "[tunde.adeyemi@example.com](mailto:tunde.adeyemi@example.com)",
accommodation: "Cedar View Suites",
location: "Ikeja, Lagos",
checkIn: "Aug 11, 2026",
checkOut: "Aug 14, 2026",
status: "active",
notificationStatus: "delivered",
lastNotification: "Check-in notification delivered",
lastNotificationTime: "2 hrs ago",
emergencyContact: "Kemi Adeyemi",
emergencyEmail: "[kemi.adeyemi@example.com](mailto:kemi.adeyemi@example.com)",
},
{
id: "TG-10281",
guest: "Aisha Bello",
guestEmail: "[aisha.bello@example.com](mailto:aisha.bello@example.com)",
accommodation: "Lagos Marina Apartments",
location: "Ikoyi, Lagos",
checkIn: "Aug 10, 2026",
checkOut: "Aug 13, 2026",
status: "active",
notificationStatus: "delivered",
lastNotification: "Check-in notification delivered",
lastNotificationTime: "Yesterday",
emergencyContact: "Musa Bello",
emergencyEmail: "[musa.bello@example.com](mailto:musa.bello@example.com)",
},
{
id: "TG-10280",
guest: "Michael Johnson",
guestEmail: "[michael.johnson@example.com](mailto:michael.johnson@example.com)",
accommodation: "The Meridian House",
location: "Victoria Island, Lagos",
checkIn: "Aug 9, 2026",
checkOut: "Aug 12, 2026",
status: "completed",
notificationStatus: "delivered",
lastNotification: "Check-out notification delivered",
lastNotificationTime: "Yesterday",
emergencyContact: "Grace Johnson",
emergencyEmail: "[grace.johnson@example.com](mailto:grace.johnson@example.com)",
},
{
id: "TG-10279",
guest: "Blessing Okoro",
guestEmail: "[blessing.okoro@example.com](mailto:blessing.okoro@example.com)",
accommodation: "Palm Court Residence",
location: "Lekki Phase 1, Lagos",
checkIn: "Aug 8, 2026",
checkOut: "Aug 11, 2026",
status: "completed",
notificationStatus: "delivered",
lastNotification: "Check-out notification delivered",
lastNotificationTime: "2 days ago",
emergencyContact: "David Okoro",
emergencyEmail: "[david.okoro@example.com](mailto:david.okoro@example.com)",
},
{
id: "TG-10278",
guest: "Femi Williams",
guestEmail: "[femi.williams@example.com](mailto:femi.williams@example.com)",
accommodation: "Cedar View Suites",
location: "Ikeja, Lagos",
checkIn: "Aug 7, 2026",
checkOut: "Aug 10, 2026",
status: "issue",
notificationStatus: "failed",
lastNotification: "Check-out notification failed",
lastNotificationTime: "2 days ago",
emergencyContact: "Joy Williams",
emergencyEmail: "[joy.williams@example.com](mailto:joy.williams@example.com)",
},
{
id: "TG-10277",
guest: "Esther Nwosu",
guestEmail: "[esther.nwosu@example.com](mailto:esther.nwosu@example.com)",
accommodation: "Lagos Marina Apartments",
location: "Ikoyi, Lagos",
checkIn: "Aug 6, 2026",
checkOut: "Aug 9, 2026",
status: "completed",
notificationStatus: "delivered",
lastNotification: "Check-out notification delivered",
lastNotificationTime: "3 days ago",
emergencyContact: "Chinedu Nwosu",
emergencyEmail: "[chinedu.nwosu@example.com](mailto:chinedu.nwosu@example.com)",
},
];

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

const SafetyPage = () => {
const [activeFilter, setActiveFilter] = useState("all");
const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(1);

const protectedCount = safetyRecords.filter(
(record) =>
record.status === "protected" ||
record.status === "active"
).length;

const attentionCount = safetyRecords.filter(
(record) => record.status === "attention"
).length;

const issueCount = safetyRecords.filter(
(record) => record.status === "issue"
).length;

const deliveredCount = safetyRecords.filter(
(record) => record.notificationStatus === "delivered"
).length;

const filteredRecords = useMemo(() => {
const search = searchTerm.trim().toLowerCase();


return safetyRecords.filter((record) => {
  const matchesFilter =
    activeFilter === "all" ||
    record.status === activeFilter;

  const matchesSearch =
    !search ||
    record.id.toLowerCase().includes(search) ||
    record.guest.toLowerCase().includes(search) ||
    record.accommodation
      .toLowerCase()
      .includes(search) ||
    record.location.toLowerCase().includes(search);

  return matchesFilter && matchesSearch;
});

}, [activeFilter, searchTerm]);

const totalPages = Math.max(
1,
Math.ceil(
filteredRecords.length / ITEMS_PER_PAGE
)
);

const safeCurrentPage = Math.min(
currentPage,
totalPages
);

const paginatedRecords = filteredRecords.slice(
(safeCurrentPage - 1) * ITEMS_PER_PAGE,
safeCurrentPage * ITEMS_PER_PAGE
);

const handleFilterChange = (filter) => {
setActiveFilter(filter);
setCurrentPage(1);
};

const handleSearchChange = (event) => {
setSearchTerm(event.target.value);
setCurrentPage(1);
};

return ( <div className="min-h-screen bg-gray-50"> <AdminSidebar />

  <div className="lg:ml-72">
    <AdminNavbar />

    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader
          title="Safety"
          description="Monitor TripGuard protection, safety notifications, and safety-related activity."
        />

        {/* Safety overview */}
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

        {/* Safety information */}
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
                  Every protected booking can automatically
                  notify the traveller's trusted contact at
                  check-in and check-out. Monitor delivery
                  status here and resolve failed notifications
                  when necessary.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-900 p-5 text-white shadow-sm">
            <p className="text-xs font-medium text-gray-400">
              Protection coverage
            </p>

            <p className="mt-2 text-3xl font-bold">
              {safetyRecords.length > 0
                ? Math.round(
                    (protectedCount /
                      safetyRecords.length) *
                      100
                  )
                : 0}
              %
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#63E6BE]"
                style={{
                  width: `${
                    safetyRecords.length > 0
                      ? Math.round(
                          (protectedCount /
                            safetyRecords.length) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Active bookings currently covered by
              TripGuard safety protection.
            </p>
          </div>
        </div>

        {/* Filters and search */}
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
                onChange={handleSearchChange}
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
                {filters.map((filter) => {
                  const count =
                    filter.value === "all"
                      ? safetyRecords.length
                      : safetyRecords.filter(
                          (record) =>
                            record.status ===
                            filter.value
                        ).length;

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() =>
                        handleFilterChange(
                          filter.value
                        )
                      }
                      className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        activeFilter === filter.value
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {filter.label}
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
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Safety records */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-gray-900">
              Safety activity
            </h2>

            <p className="text-xs text-gray-400">
              {filteredRecords.length} safety records
              matching your search and filters.
            </p>
          </div>

          {paginatedRecords.length > 0 ? (
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
                    {paginatedRecords.map((record) => (
                      <SafetyRow
                        key={record.id}
                        record={record}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-gray-100 md:hidden">
                {paginatedRecords.map((record) => (
                  <SafetyMobileCard
                    key={record.id}
                    record={record}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <ShieldCheck size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No safety records found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Try changing your search or selected
                safety status.
              </p>

              {(searchTerm ||
                activeFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("all");
                    setCurrentPage(1);
                  }}
                  className="mt-4 text-sm font-semibold text-[#159669] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredRecords.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-600">
                  {(safeCurrentPage - 1) *
                    ITEMS_PER_PAGE +
                    1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-600">
                  {Math.min(
                    safeCurrentPage * ITEMS_PER_PAGE,
                    filteredRecords.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600">
                  {filteredRecords.length}
                </span>
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} />
                </button>

                <span className="px-3 text-xs font-medium text-gray-500">
                  Page {safeCurrentPage} of{" "}
                  {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    safeCurrentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(
                        totalPages,
                        page + 1
                      )
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={15} />
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

const SafetyRow = ({ record }) => {
return ( <tr className="transition hover:bg-gray-50"> <td className="px-6 py-4"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#63E6BE]/10 text-[#159669]"> <UserRound size={17} /> </div>


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
    <SafetyStatus status={record.status} />
  </td>

  <td className="px-6 py-4">
    <NotificationStatus
      status={record.notificationStatus}
    />

    <p className="mt-1 max-w-[180px] truncate text-[11px] text-gray-400">
      {record.lastNotification}
    </p>
  </td>

  <td className="px-6 py-4">
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/bookings/${record.id}`}
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
        <MoreVertical size={15} />
      </button>
    </div>
  </td>
</tr>

);
};

const SafetyMobileCard = ({ record }) => {
return ( <div className="p-5"> <div className="flex items-start justify-between gap-3"> <div className="flex min-w-0 items-center gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#63E6BE]/10 text-[#159669]"> <UserRound size={17} /> </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-800">
          {record.guest}
        </p>

        <p className="mt-0.5 text-xs text-gray-400">
          {record.id}
        </p>
      </div>
    </div>

    <SafetyStatus status={record.status} />
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

  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
    <div>
      <NotificationStatus
        status={record.notificationStatus}
      />

      <p className="mt-1 text-[11px] text-gray-400">
        {record.lastNotification}
      </p>
    </div>

    <Link
      href={`/admin/bookings/${record.id}`}
      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
    >
      <Eye size={13} />
      View
    </Link>
  </div>
</div>


);
};

const SafetyStatus = ({ status }) => {
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
statusConfig[status] || statusConfig.active;

const Icon = config.icon;

return (
<span
className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.className}`}
> <Icon size={12} />
{config.label} </span>
);
};

const NotificationStatus = ({ status }) => {
const statusConfig = {
delivered: {
label: "Delivered",
icon: CheckCircle2,
className: "text-emerald-600",
},
scheduled: {
label: "Scheduled",
icon: Clock3,
className: "text-blue-600",
},
pending: {
label: "Pending",
icon: Clock3,
className: "text-amber-600",
},
failed: {
label: "Failed",
icon: XCircle,
className: "text-red-600",
},
};

const config =
statusConfig[status] ||
statusConfig.pending;

const Icon = config.icon;

return (
<span
className={`inline-flex items-center gap-1.5 text-xs font-semibold ${config.className}`}
> <Icon size={13} />
{config.label} </span>
);
};

const SafetyStat = ({
icon: Icon,
label,
value,
iconClass,
}) => {
return ( <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
<div
className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
> <Icon size={19} /> </div>


  <p className="mt-4 text-xs text-gray-500">
    {label}
  </p>

  <p className="mt-1 text-xl font-bold text-gray-900">
    {value}
  </p>
</div>

);
};

export default SafetyPage;
