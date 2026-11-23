"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
ArrowLeft,
CheckCircle2,
Clock3,
Download,
FileCheck2,
FileText,
Mail,
MapPin,
Phone,
ShieldAlert,
ShieldCheck,
UserRound,
XCircle,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";

const verificationRequests = {
"VER-1001": {
id: "VER-1001",
userId: "USR-1001",
name: "Daniel Okafor",
email: "[daniel.okafor@example.com](mailto:daniel.okafor@example.com)",
phone: "+234 801 234 5678",
type: "traveller",
document: "National ID",
documentNumber: "********4821",
submitted: "August 11, 2026",
submittedTime: "9:42 AM",
status: "pending",
risk: "low",
location: "Lagos, Nigeria",
dateOfBirth: "January 18, 1995",
nationality: "Nigerian",
verificationMethod: "Identity document",
documentFront: "/verification-document.jpg",
documentBack: "/verification-document-back.jpg",
selfie: "/verification-selfie.jpg",
},

"VER-1002": {
id: "VER-1002",
userId: "USR-1004",
name: "Aisha Bello",
email: "[aisha.bello@example.com](mailto:aisha.bello@example.com)",
phone: "+234 802 345 6789",
type: "traveller",
document: "NIN",
documentNumber: "********7314",
submitted: "August 10, 2026",
submittedTime: "4:18 PM",
status: "pending",
risk: "medium",
location: "Abuja, Nigeria",
dateOfBirth: "March 12, 1997",
nationality: "Nigerian",
verificationMethod: "Identity document",
documentFront: "/verification-document.jpg",
documentBack: "/verification-document-back.jpg",
selfie: "/verification-selfie.jpg",
},

"VER-1003": {
id: "VER-1003",
userId: "USR-1009",
name: "Samuel Adekunle",
email: "[samuel.adekunle@example.com](mailto:samuel.adekunle@example.com)",
phone: "+234 803 456 7890",
type: "owner",
document: "Driver's License",
documentNumber: "********1942",
submitted: "August 10, 2026",
submittedTime: "1:25 PM",
status: "approved",
risk: "low",
location: "Lagos, Nigeria",
dateOfBirth: "November 4, 1988",
nationality: "Nigerian",
verificationMethod: "Identity document",
documentFront: "/verification-document.jpg",
documentBack: "/verification-document-back.jpg",
selfie: "/verification-selfie.jpg",
},

"VER-1004": {
id: "VER-1004",
userId: "USR-1010",
name: "Grace Ibrahim",
email: "[grace.ibrahim@example.com](mailto:grace.ibrahim@example.com)",
phone: "+234 804 567 8901",
type: "owner",
document: "National ID",
documentNumber: "********6820",
submitted: "August 9, 2026",
submittedTime: "11:06 AM",
status: "approved",
risk: "low",
location: "Kano, Nigeria",
dateOfBirth: "June 28, 1990",
nationality: "Nigerian",
verificationMethod: "Identity document",
documentFront: "/verification-document.jpg",
documentBack: "/verification-document-back.jpg",
selfie: "/verification-selfie.jpg",
},

"VER-1005": {
id: "VER-1005",
userId: "USR-1011",
name: "David Olatunji",
email: "[david.olatunji@example.com](mailto:david.olatunji@example.com)",
phone: "+234 805 678 9012",
type: "owner",
document: "NIN",
documentNumber: "********5318",
submitted: "August 8, 2026",
submittedTime: "3:52 PM",
status: "pending",
risk: "high",
location: "Ibadan, Nigeria",
dateOfBirth: "September 15, 1985",
nationality: "Nigerian",
verificationMethod: "Identity document",
documentFront: "/verification-document.jpg",
documentBack: "/verification-document-back.jpg",
selfie: "/verification-selfie.jpg",
},
};

const AdminVerificationDetailsPage = () => {
const params = useParams();

const verificationId =
params?.id || "VER-1001";

const verification =
verificationRequests[verificationId] ||
verificationRequests["VER-1001"];

const isPending =
verification.status === "pending";

return ( <div className="min-h-screen bg-gray-50"> <AdminSidebar />


  <div className="lg:ml-72">
    <AdminNavbar />

    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Back */}
        <Link
          href="/admin/verifications"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={15} />
          Back to verifications
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <AdminPageHeader
            title="Verification review"
            description={`Review ${verification.name}'s identity verification submission.`}
          />

          <div className="flex items-center gap-2">
            <VerificationStatus
              status={verification.status}
            />

            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-semibold text-gray-500">
              {verification.id}
            </span>
          </div>
        </div>

        {/* Pending banner */}
        {isPending && (
          <div className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600">
                <Clock3 size={18} />
              </div>

              <div>
                <p className="text-xs font-semibold text-amber-800">
                  This verification is awaiting review
                </p>

                <p className="mt-1 text-[11px] leading-5 text-amber-700">
                  Review the submitted identity information
                  and documents before approving or rejecting
                  this request.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <XCircle size={14} />
                Reject
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                <CheckCircle2 size={14} />
                Approve
              </button>
            </div>
          </div>
        )}

        {/* Main */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 xl:col-span-2">
            {/* Applicant */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#63E6BE]/10 text-lg font-bold text-[#159669]">
                    {getInitials(
                      verification.name
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-gray-900">
                        {verification.name}
                      </h2>

                      <UserTypeBadge
                        type={verification.type}
                      />
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      {verification.userId}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/admin/users/${verification.userId}`}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  <UserRound size={14} />
                  View user
                </Link>
              </div>

              <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
                <InfoItem
                  icon={Mail}
                  label="Email address"
                  value={verification.email}
                />

                <InfoItem
                  icon={Phone}
                  label="Phone number"
                  value={verification.phone}
                />

                <InfoItem
                  icon={MapPin}
                  label="Location"
                  value={verification.location}
                />

                <InfoItem
                  icon={UserRound}
                  label="Nationality"
                  value={verification.nationality}
                />
              </div>
            </section>

            {/* Submitted identity */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <FileCheck2 size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Identity information
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Information submitted by the applicant.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <IdentityField
                  label="Document type"
                  value={verification.document}
                />

                <IdentityField
                  label="Document number"
                  value={verification.documentNumber}
                  mono
                />

                <IdentityField
                  label="Date of birth"
                  value={verification.dateOfBirth}
                />

                <IdentityField
                  label="Nationality"
                  value={verification.nationality}
                />

                <IdentityField
                  label="Verification method"
                  value={
                    verification.verificationMethod
                  }
                />

                <IdentityField
                  label="Submitted"
                  value={`${verification.submitted} • ${verification.submittedTime}`}
                />
              </div>
            </section>

            {/* Documents */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Submitted documents
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Review the identity documents uploaded by
                    the applicant.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  <Download size={14} />
                  Download all
                </button>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <DocumentPreview
                  title="Document front"
                  src={
                    verification.documentFront
                  }
                />

                <DocumentPreview
                  title="Document back"
                  src={
                    verification.documentBack
                  }
                />

                <DocumentPreview
                  title="Selfie verification"
                  src={verification.selfie}
                  fullWidth
                />
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Verification result */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-semibold text-gray-900">
                Verification result
              </h2>

              <div
                className={`mt-5 rounded-2xl p-5 ${
                  verification.status ===
                  "approved"
                    ? "bg-emerald-50"
                    : verification.status ===
                      "rejected"
                    ? "bg-red-50"
                    : "bg-amber-50"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    verification.status ===
                    "approved"
                      ? "bg-white text-emerald-600"
                      : verification.status ===
                        "rejected"
                      ? "bg-white text-red-600"
                      : "bg-white text-amber-600"
                  }`}
                >
                  {verification.status ===
                  "approved" ? (
                    <CheckCircle2 size={20} />
                  ) : verification.status ===
                    "rejected" ? (
                    <XCircle size={20} />
                  ) : (
                    <Clock3 size={20} />
                  )}
                </div>

                <p
                  className={`mt-4 text-sm font-bold ${
                    verification.status ===
                    "approved"
                      ? "text-emerald-700"
                      : verification.status ===
                        "rejected"
                      ? "text-red-700"
                      : "text-amber-700"
                  }`}
                >
                  {verification.status ===
                  "approved"
                    ? "Verification approved"
                    : verification.status ===
                      "rejected"
                    ? "Verification rejected"
                    : "Awaiting review"}
                </p>

                <p
                  className={`mt-1 text-[11px] leading-5 ${
                    verification.status ===
                    "approved"
                      ? "text-emerald-600"
                      : verification.status ===
                        "rejected"
                      ? "text-red-600"
                      : "text-amber-600"
                  }`}
                >
                  {verification.status ===
                  "approved"
                    ? "This user's identity has been successfully verified."
                    : verification.status ===
                      "rejected"
                    ? "This verification submission was rejected."
                    : "An administrator needs to review this submission."}
                </p>
              </div>

              {isPending && (
                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={15} />
                    Approve verification
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <XCircle size={15} />
                    Reject verification
                  </button>
                </div>
              )}
            </section>

            {/* Risk assessment */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Risk assessment
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Automated verification signals.
                  </p>
                </div>

                <ShieldCheck
                  size={19}
                  className="text-[#159669]"
                />
              </div>

              <div
                className={`mt-5 flex items-center gap-3 rounded-xl p-4 ${
                  verification.risk ===
                  "high"
                    ? "bg-red-50"
                    : verification.risk ===
                      "medium"
                    ? "bg-amber-50"
                    : "bg-emerald-50"
                }`}
              >
                {verification.risk ===
                "high" ? (
                  <ShieldAlert
                    size={19}
                    className="text-red-600"
                  />
                ) : verification.risk ===
                  "medium" ? (
                  <ShieldAlert
                    size={19}
                    className="text-amber-600"
                  />
                ) : (
                  <ShieldCheck
                    size={19}
                    className="text-emerald-600"
                  />
                )}

                <div>
                  <p
                    className={`text-xs font-bold ${
                      verification.risk ===
                      "high"
                        ? "text-red-700"
                        : verification.risk ===
                          "medium"
                        ? "text-amber-700"
                        : "text-emerald-700"
                    }`}
                  >
                    {capitalize(
                      verification.risk
                    )} risk
                  </p>

                  <p
                    className={`mt-1 text-[10px] ${
                      verification.risk ===
                      "high"
                        ? "text-red-600"
                        : verification.risk ===
                          "medium"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    Identity review signals
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <RiskCheck
                  label="Document is readable"
                  passed
                />

                <RiskCheck
                  label="Document appears valid"
                  passed
                />

                <RiskCheck
                  label="Identity information matches"
                  passed={
                    verification.risk !==
                    "high"
                  }
                />

                <RiskCheck
                  label="Selfie similarity check"
                  passed={
                    verification.risk ===
                    "low"
                  }
                />

                <RiskCheck
                  label="No duplicate identity detected"
                  passed={
                    verification.risk !==
                    "high"
                  }
                />
              </div>
            </section>

            {/* Submission details */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-semibold text-gray-900">
                Submission details
              </h2>

              <div className="mt-5 space-y-4">
                <DetailRow
                  label="Verification ID"
                  value={verification.id}
                />

                <DetailRow
                  label="User ID"
                  value={verification.userId}
                />

                <DetailRow
                  label="Submitted"
                  value={verification.submitted}
                />

                <DetailRow
                  label="Time"
                  value={verification.submittedTime}
                />

                <DetailRow
                  label="Method"
                  value={
                    verification.verificationMethod
                  }
                />
              </div>
            </section>

            {/* Safety note */}
            <section className="rounded-2xl border border-[#63E6BE]/20 bg-[#63E6BE]/5 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#159669] shadow-sm">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-800">
                    Why verification matters
                  </h3>

                  <p className="mt-1.5 text-[10px] leading-5 text-gray-500">
                    Verified identities help TripGuard create a
                    safer environment for travellers and
                    accommodation owners.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom action bar */}
        {isPending && (
          <div className="sticky bottom-4 z-20 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-800">
                  Ready to make a decision?
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Approve only when the submitted identity
                  information has been sufficiently verified.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <XCircle size={14} />
                  Reject
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  <CheckCircle2 size={14} />
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  </div>
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

const IdentityField = ({
label,
value,
mono = false,
}) => {
return ( <div className="rounded-xl border border-gray-100 bg-gray-50 p-4"> <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
{label} </p>


  <p
    className={`mt-1.5 text-xs font-semibold text-gray-700 ${
      mono ? "font-mono" : ""
    }`}
  >
    {value}
  </p>
</div>


);
};

const DocumentPreview = ({
title,
src,
fullWidth = false,
}) => {
return (
<div
className={`overflow-hidden rounded-2xl border border-gray-100 ${
        fullWidth ? "md:col-span-2" : ""
      }`}
> <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3"> <div className="flex items-center gap-2"> <FileText
         size={14}
         className="text-gray-400"
       />


      <span className="text-xs font-semibold text-gray-700">
        {title}
      </span>
    </div>

    <button
      type="button"
      className="text-gray-400 transition hover:text-gray-700"
      aria-label={`Download ${title}`}
    >
      <Download size={14} />
    </button>
  </div>

  <div className="flex min-h-[220px] items-center justify-center bg-gray-100 p-4 sm:min-h-[260px]">
    <div className="flex h-full min-h-[190px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white">
      <FileCheck2
        size={35}
        className="text-gray-300"
      />

      <p className="mt-3 text-xs font-semibold text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-gray-400">
        Uploaded document preview
      </p>

      <button
        type="button"
        className="mt-4 rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-semibold text-gray-600 transition hover:bg-gray-50"
      >
        Open document
      </button>
    </div>
  </div>
</div>


);
};

const RiskCheck = ({
label,
passed,
}) => {
return ( <div className="flex items-center justify-between gap-3"> <span className="text-xs text-gray-500">
{label} </span>


  {passed ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
      <CheckCircle2 size={12} />
      Passed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600">
      <XCircle size={12} />
      Flagged
    </span>
  )}
</div>


);
};

const DetailRow = ({
label,
value,
}) => {
return ( <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0"> <span className="text-[10px] text-gray-400">
{label} </span>


  <span className="text-right text-[10px] font-semibold text-gray-600">
    {value}
  </span>
</div>


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

const UserTypeBadge = ({ type }) => {
return (
<span
className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
        type === "owner"
          ? "bg-orange-50 text-orange-600"
          : "bg-blue-50 text-blue-600"
      }`}
> <UserRound size={9} />


  {type === "owner"
    ? "Owner"
    : "Traveller"}
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

export default AdminVerificationDetailsPage;
