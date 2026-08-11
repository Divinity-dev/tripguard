"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
AlertCircle,
CheckCircle2,
ChevronDown,
ChevronLeft,
ChevronRight,
Clock3,
Eye,
Filter,
MoreVertical,
Search,
ShieldCheck,
UserRound,
Users,
UserX,
Building2,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";

const users = [
{
id: "USR-1001",
name: "Daniel Okafor",
email: "[daniel.okafor@example.com](mailto:daniel.okafor@example.com)",
phone: "+234 801 234 5678",
type: "traveller",
status: "active",
verified: true,
bookings: 8,
joined: "Aug 2, 2026",
lastActive: "18 min ago",
},
{
id: "USR-1002",
name: "Chiamaka Eze",
email: "[chiamaka.eze@example.com](mailto:chiamaka.eze@example.com)",
phone: "+234 802 345 6789",
type: "traveller",
status: "active",
verified: true,
bookings: 5,
joined: "Jul 29, 2026",
lastActive: "1 hr ago",
},
{
id: "USR-1003",
name: "Tunde Adeyemi",
email: "[tunde.adeyemi@example.com](mailto:tunde.adeyemi@example.com)",
phone: "+234 803 456 7890",
type: "traveller",
status: "active",
verified: true,
bookings: 12,
joined: "Jul 24, 2026",
lastActive: "2 hrs ago",
},
{
id: "USR-1004",
name: "Aisha Bello",
email: "[aisha.bello@example.com](mailto:aisha.bello@example.com)",
phone: "+234 804 567 8901",
type: "traveller",
status: "active",
verified: false,
bookings: 3,
joined: "Jul 20, 2026",
lastActive: "Yesterday",
},
{
id: "USR-1005",
name: "Michael Johnson",
email: "[michael.johnson@example.com](mailto:michael.johnson@example.com)",
phone: "+234 805 678 9012",
type: "traveller",
status: "inactive",
verified: true,
bookings: 7,
joined: "Jul 17, 2026",
lastActive: "3 days ago",
},
{
id: "USR-1006",
name: "Blessing Okoro",
email: "[blessing.okoro@example.com](mailto:blessing.okoro@example.com)",
phone: "+234 806 789 0123",
type: "traveller",
status: "active",
verified: true,
bookings: 6,
joined: "Jul 14, 2026",
lastActive: "2 hrs ago",
},
{
id: "USR-1007",
name: "Femi Williams",
email: "[femi.williams@example.com](mailto:femi.williams@example.com)",
phone: "+234 807 890 1234",
type: "traveller",
status: "suspended",
verified: true,
bookings: 4,
joined: "Jul 10, 2026",
lastActive: "5 days ago",
},
{
id: "USR-1008",
name: "Esther Nwosu",
email: "[esther.nwosu@example.com](mailto:esther.nwosu@example.com)",
phone: "+234 808 901 2345",
type: "traveller",
status: "active",
verified: true,
bookings: 9,
joined: "Jul 7, 2026",
lastActive: "3 hrs ago",
},
{
id: "USR-1009",
name: "Samuel Adekunle",
email: "[samuel.adekunle@example.com](mailto:samuel.adekunle@example.com)",
phone: "+234 809 012 3456",
type: "owner",
status: "active",
verified: true,
bookings: 0,
joined: "Jul 4, 2026",
lastActive: "5 hrs ago",
},
{
id: "USR-1010",
name: "Grace Ibrahim",
email: "[grace.ibrahim@example.com](mailto:grace.ibrahim@example.com)",
phone: "+234 810 123 4567",
type: "owner",
status: "active",
verified: true,
bookings: 0,
joined: "Jun 29, 2026",
lastActive: "Yesterday",
},
{
id: "USR-1011",
name: "David Olatunji",
email: "[david.olatunji@example.com](mailto:david.olatunji@example.com)",
phone: "+234 811 234 5678",
type: "owner",
status: "pending",
verified: false,
bookings: 0,
joined: "Jun 25, 2026",
lastActive: "2 days ago",
},
{
id: "USR-1012",
name: "Kemi Adebayo",
email: "[kemi.adebayo@example.com](mailto:kemi.adebayo@example.com)",
phone: "+234 812 345 6789",
type: "owner",
status: "active",
verified: true,
bookings: 0,
joined: "Jun 21, 2026",
lastActive: "4 hrs ago",
},
];

const ITEMS_PER_PAGE = 8;

const userTypeFilters = [
{
value: "all",
label: "All users",
},
{
value: "traveller",
label: "Travellers",
},
{
value: "owner",
label: "Owners",
},
];

const statusFilters = [
{
value: "all",
label: "All status",
},
{
value: "active",
label: "Active",
},
{
value: "inactive",
label: "Inactive",
},
{
value: "pending",
label: "Pending",
},
{
value: "suspended",
label: "Suspended",
},
];

const AdminUsersPage = () => {
const [searchTerm, setSearchTerm] = useState("");
const [userType, setUserType] = useState("all");
const [status, setStatus] = useState("all");
const [currentPage, setCurrentPage] = useState(1);
const [showFilters, setShowFilters] = useState(false);

const activeUsers = users.filter(
(user) => user.status === "active"
).length;

const travellerCount = users.filter(
(user) => user.type === "traveller"
).length;

const ownerCount = users.filter(
(user) => user.type === "owner"
).length;

const verifiedCount = users.filter(
(user) => user.verified
).length;

const filteredUsers = useMemo(() => {
const search = searchTerm.trim().toLowerCase();


return users.filter((user) => {
  const matchesSearch =
    !search ||
    user.id.toLowerCase().includes(search) ||
    user.name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search) ||
    user.phone.toLowerCase().includes(search);

  const matchesType =
    userType === "all" ||
    user.type === userType;

  const matchesStatus =
    status === "all" ||
    user.status === status;

  return (
    matchesSearch &&
    matchesType &&
    matchesStatus
  );
});


}, [searchTerm, userType, status]);

const totalPages = Math.max(
1,
Math.ceil(
filteredUsers.length / ITEMS_PER_PAGE
)
);

const safeCurrentPage = Math.min(
currentPage,
totalPages
);

const paginatedUsers = filteredUsers.slice(
(safeCurrentPage - 1) * ITEMS_PER_PAGE,
safeCurrentPage * ITEMS_PER_PAGE
);

const handleSearchChange = (event) => {
setSearchTerm(event.target.value);
setCurrentPage(1);
};

const handleTypeChange = (value) => {
setUserType(value);
setCurrentPage(1);
};

const handleStatusChange = (value) => {
setStatus(value);
setCurrentPage(1);
};

const clearFilters = () => {
setSearchTerm("");
setUserType("all");
setStatus("all");
setCurrentPage(1);
};

return ( <div className="min-h-screen bg-gray-50"> <AdminSidebar />


  <div className="lg:ml-72">
    <AdminNavbar />

    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <AdminPageHeader
          title="Users"
          description="Manage TripGuard travellers, accommodation owners, and account activity."
        />

        {/* User statistics */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <UserStat
            icon={Users}
            label="Total users"
            value={users.length}
            iconClass="bg-blue-50 text-blue-600"
          />

          <UserStat
            icon={UserRound}
            label="Travellers"
            value={travellerCount}
            iconClass="bg-[#63E6BE]/10 text-[#159669]"
          />

          <UserStat
            icon={Building2}
            label="Accommodation owners"
            value={ownerCount}
            iconClass="bg-orange-50 text-orange-600"
          />

          <UserStat
            icon={ShieldCheck}
            label="Verified users"
            value={verifiedCount}
            iconClass="bg-violet-50 text-violet-600"
          />
        </div>

        {/* Search and filters */}
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-lg">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name, email, phone or ID..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#63E6BE] focus:bg-white focus:ring-2 focus:ring-[#63E6BE]/10"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (current) => !current
                )
              }
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition lg:hidden ${
                showFilters
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter size={16} />
              Filters
            </button>

            <div
              className={`flex-col gap-3 lg:flex lg:flex-row lg:items-center ${
                showFilters ? "flex" : "hidden"
              }`}
            >
              <div className="relative">
                <select
                  value={userType}
                  onChange={(event) =>
                    handleTypeChange(
                      event.target.value
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-600 outline-none transition focus:border-[#63E6BE] focus:ring-2 focus:ring-[#63E6BE]/10 lg:w-40"
                >
                  {userTypeFilters.map(
                    (filter) => (
                      <option
                        key={filter.value}
                        value={filter.value}
                      >
                        {filter.label}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="relative">
                <select
                  value={status}
                  onChange={(event) =>
                    handleStatusChange(
                      event.target.value
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-600 outline-none transition focus:border-[#63E6BE] focus:ring-2 focus:ring-[#63E6BE]/10 lg:w-40"
                >
                  {statusFilters.map(
                    (filter) => (
                      <option
                        key={filter.value}
                        value={filter.value}
                      >
                        {filter.label}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {(searchTerm ||
                userType !== "all" ||
                status !== "all") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-11 rounded-xl px-3 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Desktop filters */}
          <div className="mt-4 hidden items-center gap-2 border-t border-gray-100 pt-4 lg:flex">
            <span className="mr-1 text-xs font-medium text-gray-400">
              User type:
            </span>

            {userTypeFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  handleTypeChange(
                    filter.value
                  )
                }
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  userType === filter.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}

            <div className="mx-2 h-5 w-px bg-gray-200" />

            <span className="text-xs font-medium text-gray-400">
              Status:
            </span>

            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  handleStatusChange(
                    filter.value
                  )
                }
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  status === filter.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {/* Users table */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-semibold text-gray-900">
                All users
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {filteredUsers.length} users matching
                your current filters.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <UserRound size={14} />
              {activeUsers} active users
            </div>
          </div>

          {paginatedUsers.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        User
                      </th>

                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Type
                      </th>

                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Verification
                      </th>

                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Bookings
                      </th>

                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Status
                      </th>

                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Last active
                      </th>

                      <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedUsers.map((user) => (
                      <UserTableRow
                        key={user.id}
                        user={user}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-gray-100 md:hidden">
                {paginatedUsers.map((user) => (
                  <UserMobileCard
                    key={user.id}
                    user={user}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <Users size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No users found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                No users match your current search and
                filter settings.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-semibold text-[#159669] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredUsers.length > 0 && (
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
                    safeCurrentPage *
                      ITEMS_PER_PAGE,
                    filteredUsers.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600">
                  {filteredUsers.length}
                </span>
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={
                    safeCurrentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                    safeCurrentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(
                        totalPages,
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
          )}
        </section>
      </div>
    </main>
  </div>
</div>


);
};

const UserTableRow = ({ user }) => {
return ( <tr className="transition hover:bg-gray-50"> <td className="px-6 py-4"> <div className="flex items-center gap-3"> <UserAvatar name={user.name} />


      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-800">
          {user.name}
        </p>

        <p className="mt-0.5 text-[10px] text-gray-400">
          {user.email}
        </p>

        <p className="mt-0.5 text-[10px] text-gray-400">
          {user.id}
        </p>
      </div>
    </div>
  </td>

  <td className="px-6 py-4">
    <UserTypeBadge type={user.type} />
  </td>

  <td className="px-6 py-4">
    {user.verified ? (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
        <CheckCircle2 size={13} />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600">
        <AlertCircle size={13} />
        Unverified
      </span>
    )}
  </td>

  <td className="px-6 py-4 text-xs font-semibold text-gray-700">
    {user.bookings}
  </td>

  <td className="px-6 py-4">
    <UserStatus status={user.status} />
  </td>

  <td className="px-6 py-4 text-xs text-gray-400">
    {user.lastActive}
  </td>

  <td className="px-6 py-4">
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/users/${user.id}`}
        title="View user"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
      >
        <Eye size={15} />
      </Link>

      <button
        type="button"
        title="More options"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
      >
        <MoreVertical size={15} />
      </button>
    </div>
  </td>
</tr>


);
};

const UserMobileCard = ({ user }) => {
return ( <div className="p-5"> <div className="flex items-start justify-between gap-3"> <div className="flex min-w-0 items-center gap-3"> <UserAvatar name={user.name} />


      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-800">
          {user.name}
        </p>

        <p className="mt-0.5 truncate text-xs text-gray-400">
          {user.email}
        </p>

        <p className="mt-0.5 text-[10px] text-gray-400">
          {user.id}
        </p>
      </div>
    </div>

    <UserStatus status={user.status} />
  </div>

  <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-3">
    <UserTypeBadge type={user.type} />

    {user.verified ? (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
        <CheckCircle2 size={12} />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
        <AlertCircle size={12} />
        Unverified
      </span>
    )}
  </div>

  <div className="mt-4 grid grid-cols-2 gap-4">
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        Bookings
      </p>

      <p className="mt-1 text-sm font-bold text-gray-800">
        {user.bookings}
      </p>
    </div>

    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        Joined
      </p>

      <p className="mt-1 text-xs font-medium text-gray-600">
        {user.joined}
      </p>
    </div>
  </div>

  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
    <p className="text-[10px] text-gray-400">
      Last active:{" "}
      <span className="font-medium text-gray-600">
        {user.lastActive}
      </span>
    </p>

    <Link
      href={`/admin/users/${user.id}`}
      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
    >
      <Eye size={13} />
      View
    </Link>
  </div>
</div>


);
};

const UserAvatar = ({ name }) => {
return ( <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#63E6BE]/10 text-xs font-bold text-[#159669]">
{getInitials(name)} </div>
);
};

const UserTypeBadge = ({ type }) => {
if (type === "owner") {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600"> <Building2 size={11} />
Owner </span>
);
}

return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600"> <UserRound size={11} />
Traveller </span>
);
};

const UserStatus = ({ status }) => {
const statusConfig = {
active: {
label: "Active",
icon: CheckCircle2,
className:
"bg-emerald-50 text-emerald-600",
},
inactive: {
label: "Inactive",
icon: Clock3,
className:
"bg-gray-100 text-gray-500",
},
pending: {
label: "Pending",
icon: AlertCircle,
className:
"bg-amber-50 text-amber-600",
},
suspended: {
label: "Suspended",
icon: UserX,
className:
"bg-red-50 text-red-600",
},
};

const config =
statusConfig[status] ||
statusConfig.inactive;

const Icon = config.icon;

return (
<span
className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
> <Icon size={11} />
{config.label} </span>
);
};

const UserStat = ({
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

const getInitials = (name) => {
return name
.split(" ")
.map((part) => part[0])
.join("")
.slice(0, 2)
.toUpperCase();
};

export default AdminUsersPage;
