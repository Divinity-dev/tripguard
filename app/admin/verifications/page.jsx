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
FileCheck2,
Filter,
Search,
ShieldCheck,
UserRound,
XCircle,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";

const verificationRequests = [
{
id: "VER-1001",
userId: "USR-1001",
name: "Daniel Okafor",
email: "[daniel.okafor@example.com](mailto:daniel.okafor@example.com)",
type: "traveller",
document: "National ID",
documentNumber: "********4821",
submitted: "Aug 11, 2026",
submittedTime: "9:42 AM",
status: "pending",
risk: "low",
},
{
id: "VER-1002",
userId: "USR-1004",
name: "Aisha Bello",
email: "[aisha.bello@example.com](mailto:aisha.bello@example.com)",
type: "traveller",
document: "NIN",
documentNumber: "********7314",
submitted: "Aug 10, 2026",
submittedTime: "4:18 PM",
status: "pending",
risk: "medium",
},
{
id: "VER-1003",
userId: "USR-1009",
name: "Samuel Adekunle",
email: "[samuel.adekunle@example.com](mailto:samuel.adekunle@example.com)",
type: "owner",
document: "Driver's License",
documentNumber: "********1942",
submitted: "Aug 10, 2026",
submittedTime: "1:25 PM",
status: "approved",
risk: "low",
},
{
id: "VER-1004",
userId: "USR-1010",
name: "Grace Ibrahim",
email: "[grace.ibrahim@example.com](mailto:grace.ibrahim@example.com)",
type: "owner",
document: "National ID",
documentNumber: "********6820",
submitted: "Aug 9, 2026",
submittedTime: "11:06 AM",
status: "approved",
risk: "low",
},
{
id: "VER-1005",
userId: "USR-1011",
name: "David Olatunji",
email: "[david.olatunji@example.com](mailto:david.olatunji@example.com)",
type: "owner",
document: "NIN",
documentNumber: "********5318",
submitted: "Aug 8, 2026",
submittedTime: "3:52 PM",
status: "pending",
risk: "high",
},
{
id: "VER-1006",
userId: "USR-1002",
name: "Chiamaka Eze",
email: "[chiamaka.eze@example.com](mailto:chiamaka.eze@example.com)",
type: "traveller",
document: "International Passport",
documentNumber: "********9017",
submitted: "Aug 7, 2026",
submittedTime: "10:34 AM",
status: "approved",
risk: "low",
},
{
id: "VER-1007",
userId: "USR-1005",
name: "Michael Johnson",
email: "[michael.johnson@example.com](mailto:michael.johnson@example.com)",
type: "traveller",
document: "NIN",
documentNumber: "********2731",
submitted: "Aug 6, 2026",
submittedTime: "2:15 PM",
status: "rejected",
risk: "high",
},
{
id: "VER-1008",
userId: "USR-1003",
name: "Tunde Adeyemi",
email: "[tunde.adeyemi@example.com](mailto:tunde.adeyemi@example.com)",
type: "traveller",
document: "National ID",
documentNumber: "********8124",
submitted: "Aug 5, 2026",
submittedTime: "8:21 AM",
status: "approved",
risk: "low",
},
{
id: "VER-1009",
userId: "USR-1012",
name: "Kemi Adebayo",
email: "[kemi.adebayo@example.com](mailto:kemi.adebayo@example.com)",
type: "owner",
document: "Driver's License",
documentNumber: "********4429",
submitted: "Aug 4, 2026",
submittedTime: "5:08 PM",
status: "pending",
risk: "medium",
},
{
id: "VER-1010",
userId: "USR-1006",
name: "Blessing Okoro",
email: "[blessing.okoro@example.com](mailto:blessing.okoro@example.com)",
type: "traveller",
document: "NIN",
documentNumber: "********6175",
submitted: "Aug 3, 2026",
submittedTime: "12:41 PM",
status: "approved",
risk: "low",
},
];

const ITEMS_PER_PAGE = 7;

const statusFilters = [
{
value: "all",
label: "All",
},
{
value: "pending",
label: "Pending",
},
{
value: "approved",
label: "Approved",
},
{
value: "rejected",
label: "Rejected",
},
];

const typeFilters = [
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

const AdminVerificationsPage = () => {
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] =
useState("all");
const [typeFilter, setTypeFilter] =
useState("all");
const [currentPage, setCurrentPage] = useState(1);
const [showFilters, setShowFilters] = useState(false);

const pendingCount = verificationRequests.filter(
(item) => item.status === "pending"
).length;

const approvedCount = verificationRequests.filter(
(item) => item.status === "approved"
).length;

const rejectedCount = verificationRequests.filter(
(item) => item.status === "rejected"
).length;

const highRiskCount = verificationRequests.filter(
(item) => item.risk === "high"
).length;

const filteredRequests = useMemo(() => {
const search = searchTerm
.trim()
.toLowerCase();


return verificationRequests.filter(
  (request) => {
    const matchesSearch =
      !search ||
      request.id
        .toLowerCase()
        .includes(search) ||
      request.userId
        .toLowerCase()
        .includes(search) ||
      request.name
        .toLowerCase()
        .includes(search) ||
      request.email
        .toLowerCase()
        .includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      request.status === statusFilter;

    const matchesType =
      typeFilter === "all" ||
      request.type === typeFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType
    );
  }
);


}, [
searchTerm,
statusFilter,
typeFilter,
]);

const totalPages = Math.max(
1,
Math.ceil(
filteredRequests.length /
ITEMS_PER_PAGE
)
);

const safeCurrentPage = Math.min(
currentPage,
totalPages
);

const paginatedRequests =
filteredRequests.slice(
(safeCurrentPage - 1) *
ITEMS_PER_PAGE,
safeCurrentPage * ITEMS_PER_PAGE
);

const updateStatusFilter = (value) => {
setStatusFilter(value);
setCurrentPage(1);
};

const updateTypeFilter = (value) => {
setTypeFilter(value);
setCurrentPage(1);
};

const handleSearch = (event) => {
setSearchTerm(event.target.value);
setCurrentPage(1);
};

const clearFilters = () => {
setSearchTerm("");
setStatusFilter("all");
setTypeFilter("all");
setCurrentPage(1);
};

return ( <div className="min-h-screen bg-gray-50"> <AdminSidebar />


  <div className="lg:ml-72">
    <AdminNavbar />

    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader
          title="Verifications"
          description="Review identity verification submissions and keep the TripGuard community safe."
        />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <VerificationStat
            icon={Clock3}
            label="Pending review"
            value={pendingCount}
            iconClass="bg-amber-50 text-amber-600"
          />

          <VerificationStat
            icon={CheckCircle2}
            label="Approved"
            value={approvedCount}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <VerificationStat
            icon={XCircle}
            label="Rejected"
            value={rejectedCount}
            iconClass="bg-red-50 text-red-600"
          />

          <VerificationStat
            icon={ShieldCheck}
            label="High risk"
            value={highRiskCount}
            iconClass="bg-violet-50 text-violet-600"
          />
        </div>

        {/* Review notice */}
        {pendingCount > 0 && (
          <div className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600">
                <AlertCircle size={17} />
              </div>

              <div>
                <p className="text-xs font-semibold text-amber-800">
                  Verification review required
                </p>

                <p className="mt-1 text-[11px] leading-5 text-amber-700">
                  There are {pendingCount}{" "}
                  verification submissions waiting
                  for administrator review.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                updateStatusFilter(
                  "pending"
                )
              }
              className="rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-amber-700"
            >
              Review pending
            </button>
          </div>
        )}

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
                onChange={handleSearch}
                placeholder="Search by name, email, user ID or verification ID..."
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
              className={`flex-col gap-3 lg:flex lg:flex-row ${
                showFilters
                  ? "flex"
                  : "hidden"
              }`}
            >
              <FilterSelect
                value={typeFilter}
                onChange={updateTypeFilter}
                options={typeFilters}
              />

              <FilterSelect
                value={statusFilter}
                onChange={updateStatusFilter}
                options={statusFilters}
              />

              {(searchTerm ||
                statusFilter !== "all" ||
                typeFilter !== "all") && (
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

          {/* Desktop quick filters */}
          <div className="mt-4 hidden items-center gap-2 border-t border-gray-100 pt-4 lg:flex">
            <span className="mr-1 text-xs font-medium text-gray-400">
              Status:
            </span>

            {statusFilters.map(
              (filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    updateStatusFilter(
                      filter.value
                    )
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    statusFilter ===
                    filter.value
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              )
            )}

            <div className="mx-2 h-5 w-px bg-gray-200" />

            <span className="text-xs font-medium text-gray-400">
              User:
            </span>

            {typeFilters.map(
              (filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    updateTypeFilter(
                      filter.value
                    )
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    typeFilter ===
                    filter.value
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              )
            )}
          </div>
        </section>

        {/* Verification list */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-semibold text-gray-900">
                Verification requests
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {filteredRequests.length} submissions
                matching your filters.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <FileCheck2 size={14} />
              Identity verification queue
            </div>
          </div>

          {paginatedRequests.length > 0 ? (
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
                        Document
                      </th>

                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Submitted
                      </th>

                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Risk
                      </th>

                      <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Status
                      </th>

                      <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedRequests.map(
                      (request) => (
                        <VerificationRow
                          key={request.id}
                          request={request}
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-gray-100 md:hidden">
                {paginatedRequests.map(
                  (request) => (
                    <VerificationCard
                      key={request.id}
                      request={request}
                    />
                  )
                )}
              </div>
            </>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <FileCheck2 size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No verification requests
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                No submissions match your current
                search and filter settings.
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

          {filteredRequests.length > 0 && (
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
                    filteredRequests.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600">
                  {filteredRequests.length}
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
                      Math.max(
                        1,
                        page - 1
                      )
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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

const VerificationRow = ({ request }) => {
return ( <tr className="transition hover:bg-gray-50"> <td className="px-6 py-4"> <div className="flex items-center gap-3"> <UserAvatar name={request.name} />


      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-800">
          {request.name}
        </p>

        <p className="mt-0.5 text-[10px] text-gray-400">
          {request.email}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-[10px] text-gray-400">
            {request.userId}
          </span>

          <UserTypeBadge
            type={request.type}
          />
        </div>
      </div>
    </div>
  </td>

  <td className="px-6 py-4">
    <p className="text-xs font-semibold text-gray-700">
      {request.document}
    </p>

    <p className="mt-1 font-mono text-[10px] text-gray-400">
      {request.documentNumber}
    </p>
  </td>

  <td className="px-6 py-4">
    <p className="text-xs font-medium text-gray-600">
      {request.submitted}
    </p>

    <p className="mt-1 text-[10px] text-gray-400">
      {request.submittedTime}
    </p>
  </td>

  <td className="px-6 py-4">
    <RiskBadge risk={request.risk} />
  </td>

  <td className="px-6 py-4">
    <VerificationStatus
      status={request.status}
    />
  </td>

  <td className="px-6 py-4">
    <div className="flex justify-end">
      <Link
        href={`/admin/verifications/${request.id}`}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-gray-900 px-3 text-[10px] font-semibold text-white transition hover:bg-gray-800"
      >
        <Eye size={13} />
        Review
      </Link>
    </div>
  </td>
</tr>


);
};

const VerificationCard = ({ request }) => {
return ( <div className="p-5"> <div className="flex items-start justify-between gap-3"> <div className="flex min-w-0 items-center gap-3"> <UserAvatar name={request.name} />


      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-800">
          {request.name}
        </p>

        <p className="mt-0.5 truncate text-xs text-gray-400">
          {request.email}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          {request.id}
        </p>
      </div>
    </div>

    <VerificationStatus
      status={request.status}
    />
  </div>

  <div className="mt-4 rounded-xl bg-gray-50 p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
          Document
        </p>

        <p className="mt-1 text-xs font-semibold text-gray-700">
          {request.document}
        </p>

        <p className="mt-1 font-mono text-[10px] text-gray-400">
          {request.documentNumber}
        </p>
      </div>

      <RiskBadge risk={request.risk} />
    </div>
  </div>

  <div className="mt-4 flex items-center justify-between">
    <div>
      <p className="text-[10px] text-gray-400">
        Submitted
      </p>

      <p className="mt-1 text-xs font-medium text-gray-600">
        {request.submitted}
      </p>
    </div>

    <Link
      href={`/admin/verifications/${request.id}`}
      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
    >
      <Eye size={13} />
      Review
    </Link>
  </div>
</div>


);
};

const VerificationStat = ({
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

  <p className="mt-1 text-xl font-bold text-gray-900">
    {value}
  </p>
</div>


);
};

const FilterSelect = ({
value,
onChange,
options,
}) => {
return ( <div className="relative">
<select
value={value}
onChange={(event) =>
onChange(event.target.value)
}
className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-600 outline-none transition focus:border-[#63E6BE] focus:ring-2 focus:ring-[#63E6BE]/10 lg:w-40"
>
{options.map((option) => ( <option
         key={option.value}
         value={option.value}
       >
{option.label} </option>
))} </select>


  <ChevronDown
    size={15}
    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
  />
</div>


);
};

const UserAvatar = ({ name }) => {
return ( <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#63E6BE]/10 text-xs font-bold text-[#159669]">
{getInitials(name)} </div>
);
};

const UserTypeBadge = ({ type }) => {
return (
<span
className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold ${
        type === "owner"
          ? "bg-orange-50 text-orange-600"
          : "bg-blue-50 text-blue-600"
      }`}
> <UserRound size={9} />
{type === "owner"
? "Owner"
: "Traveller"} </span>
);
};

const VerificationStatus = ({
status,
}) => {
const config = {
pending: {
label: "Pending",
className:
"bg-amber-50 text-amber-600",
icon: Clock3,
},
approved: {
label: "Approved",
className:
"bg-emerald-50 text-emerald-600",
icon: CheckCircle2,
},
rejected: {
label: "Rejected",
className:
"bg-red-50 text-red-600",
icon: XCircle,
},
};

const current =
config[status] || config.pending;

const Icon = current.icon;

return (
<span
className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${current.className}`}
> <Icon size={11} />
{current.label} </span>
);
};

const RiskBadge = ({ risk }) => {
const config = {
low: {
label: "Low risk",
className:
"bg-emerald-50 text-emerald-600",
},
medium: {
label: "Medium risk",
className:
"bg-amber-50 text-amber-600",
},
high: {
label: "High risk",
className:
"bg-red-50 text-red-600",
},
};

const current =
config[risk] || config.low;

return (
<span
className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${current.className}`}
>
{current.label} </span>
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

export default AdminVerificationsPage;
