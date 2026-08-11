"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
ArrowLeft,
ArrowUpRight,
BadgeCheck,
Ban,
BedDouble,
Building2,
CalendarCheck,
CheckCircle2,
ChevronLeft,
ChevronRight,
Clock3,
Edit3,
ExternalLink,
FileCheck2,
Globe,
Home,
MapPin,
MoreHorizontal,
ShieldCheck,
Star,
UserRound,
Users,
XCircle,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";

const accommodations = {
"1": {
id: "1",
name: "The Meridian House",
type: "Hotel",
status: "Approved",
description:
"A premium accommodation located in the heart of Lagos, offering comfortable rooms, modern amenities, and a secure environment for travellers.",
images: [
"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80",
"https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=80",
"https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=80",
],
owner: {
name: "Ibrahim Musa",
email: "[ibrahim@example.com](mailto:ibrahim@example.com)",
phone: "+234 803 456 7890",
verified: true,
},
location: {
address: "14 Admiralty Way",
city: "Lekki",
state: "Lagos",
country: "Nigeria",
},
pricing: {
nightly: "₦85,000",
weekly: "₦550,000",
monthly: "₦2,000,000",
},
rooms: 24,
guests: 48,
rating: 4.8,
reviews: 126,
bookings: 284,
revenue: "₦18,420,000",
amenities: [
"Free Wi-Fi",
"Swimming Pool",
"24/7 Security",
"Air Conditioning",
"Parking",
"Restaurant",
"Gym",
"Airport Shuttle",
],
submittedAt: "August 4, 2026",
approvedAt: "August 5, 2026",
website: "https://example.com",
verification: {
status: "Verified",
documents: [
"Business Registration",
"Government ID",
"Property Ownership Document",
],
},
},
};

const statusStyles = {
Approved: "bg-emerald-50 text-emerald-600",
Pending: "bg-amber-50 text-amber-600",
Suspended: "bg-red-50 text-red-600",
Rejected: "bg-red-50 text-red-600",
};

const AccommodationDetailsPage = () => {
const params = useParams();
const router = useRouter();

const accommodation = accommodations[params.id] || accommodations["1"];

const [activeImage, setActiveImage] = useState(0);
const [showActions, setShowActions] = useState(false);
const [showSuspendModal, setShowSuspendModal] = useState(false);

const nextImage = () => {
setActiveImage(
(current) => (current + 1) % accommodation.images.length
);
};

const previousImage = () => {
setActiveImage(
(current) =>
(current - 1 + accommodation.images.length) %
accommodation.images.length
);
};

const handleApprove = () => {
alert("Accommodation approved successfully.");
};

const handleReject = () => {
alert("Accommodation rejected.");
};

const handleSuspend = () => {
setShowSuspendModal(false);
alert("Accommodation suspended.");
};

return ( <div className="min-h-screen bg-gray-50"> <AdminSidebar />

  <div className="lg:ml-72">
    <AdminNavbar />

    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to accommodations
        </button>

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {accommodation.name}
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[accommodation.status]}`}
              >
                <CheckCircle2 size={13} />
                {accommodation.status}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Building2 size={15} />
                {accommodation.type}
              </span>

              <span className="flex items-center gap-1.5">
                <MapPin size={15} />
                {accommodation.location.city},{" "}
                {accommodation.location.state}
              </span>

              <span className="flex items-center gap-1.5">
                <Star
                  size={15}
                  className="fill-amber-400 text-amber-400"
                />
                {accommodation.rating} ({accommodation.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {accommodation.website && (
              <a
                href={accommodation.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Globe size={16} />
                Website
                <ExternalLink size={13} />
              </a>
            )}

            <Link
              href={`/admin/accommodations/${accommodation.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Edit3 size={16} />
              Edit
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowActions((current) => !current)
                }
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:bg-gray-50"
                aria-label="Accommodation actions"
              >
                <MoreHorizontal size={19} />
              </button>

              {showActions && (
                <div className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
                  {accommodation.status !== "Approved" && (
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-emerald-600 hover:bg-emerald-50"
                    >
                      <CheckCircle2 size={16} />
                      Approve
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowActions(false);
                      setShowSuspendModal(true);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <Ban size={16} />
                    Suspend
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-2xl bg-gray-200 lg:col-span-3">
            <img
              src={accommodation.images[activeImage]}
              alt={accommodation.name}
              className="h-[320px] w-full object-cover sm:h-[430px] lg:h-[500px]"
            />

            <button
              type="button"
              onClick={previousImage}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur transition hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur transition hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              {activeImage + 1} / {accommodation.images.length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {accommodation.images.slice(0, 4).map((image, index) => (
              <button
                type="button"
                key={image}
                onClick={() => setActiveImage(index)}
                className={`relative overflow-hidden rounded-2xl ${
                  activeImage === index
                    ? "ring-2 ring-[#63E6BE] ring-offset-2"
                    : ""
                }`}
              >
                <img
                  src={image}
                  alt={`${accommodation.name} ${index + 1}`}
                  className="h-36 w-full object-cover transition hover:scale-105 lg:h-[118px]"
                />

                {index === 3 &&
                  accommodation.images.length > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-semibold text-white">
                      +{accommodation.images.length - 4} more
                    </div>
                  )}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck size={19} />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Total Bookings
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {accommodation.bookings}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Star size={19} />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Average Rating
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {accommodation.rating}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <CircleDollarSignIcon />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Total Revenue
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {accommodation.revenue}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <BedDouble size={19} />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Rooms
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {accommodation.rooms}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                About this accommodation
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {accommodation.description}
              </p>
            </section>

            {/* Amenities */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Amenities
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {accommodation.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-3 text-sm text-gray-600"
                  >
                    <CheckCircle2
                      size={15}
                      className="shrink-0 text-[#159669]"
                    />
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Pricing
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-400">
                    Nightly
                  </p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {accommodation.pricing.nightly}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-400">
                    Weekly
                  </p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {accommodation.pricing.weekly}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-400">
                    Monthly
                  </p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {accommodation.pricing.monthly}
                  </p>
                </div>
              </div>
            </section>

            {/* Verification */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Verification
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Documents submitted by the accommodation owner.
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  <BadgeCheck size={14} />
                  {accommodation.verification.status}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                {accommodation.verification.documents.map(
                  (document) => (
                    <div
                      key={document}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileCheck2
                          size={17}
                          className="text-[#159669]"
                        />

                        <span className="text-sm text-gray-700">
                          {document}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="text-xs font-semibold text-[#159669] hover:underline"
                      >
                        View
                      </button>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Owner */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Property Owner
                </h2>

                {accommodation.owner.verified && (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <BadgeCheck size={14} />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#63E6BE]/15 text-[#159669]">
                  <UserRound size={21} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {accommodation.owner.name}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Accommodation Owner
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600">
                  {accommodation.owner.email}
                </p>

                <p className="text-sm text-gray-600">
                  {accommodation.owner.phone}
                </p>
              </div>

              <Link
                href="/admin/users/1"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                View Owner Profile
                <ArrowUpRight size={15} />
              </Link>
            </section>

            {/* Location */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">
                Location
              </h2>

              <div className="mt-4 overflow-hidden rounded-xl bg-gray-100">
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#159669] shadow-sm">
                      <MapPin size={20} />
                    </div>

                    <p className="mt-2 text-sm font-medium text-gray-700">
                      {accommodation.location.city}
                    </p>

                    <p className="text-xs text-gray-400">
                      {accommodation.location.state},{" "}
                      {accommodation.location.country}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">
                {accommodation.location.address},{" "}
                {accommodation.location.city},{" "}
                {accommodation.location.state}
              </p>
            </section>

            {/* Property information */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">
                Property Information
              </h2>

              <div className="mt-4 space-y-4">
                <InfoRow
                  icon={Home}
                  label="Property Type"
                  value={accommodation.type}
                />

                <InfoRow
                  icon={BedDouble}
                  label="Rooms"
                  value={`${accommodation.rooms} rooms`}
                />

                <InfoRow
                  icon={Users}
                  label="Capacity"
                  value={`${accommodation.guests} guests`}
                />

                <InfoRow
                  icon={Clock3}
                  label="Submitted"
                  value={accommodation.submittedAt}
                />

                <InfoRow
                  icon={ShieldCheck}
                  label="Approved"
                  value={accommodation.approvedAt}
                />
              </div>
            </section>
          </div>
        </div>

        {/* Admin action bar */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Administrative Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the visibility and approval status of this
                accommodation.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {accommodation.status !== "Approved" && (
                <button
                  type="button"
                  onClick={handleApprove}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#63E6BE] px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-[#4fd9ad]"
                >
                  <CheckCircle2 size={17} />
                  Approve
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowSuspendModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Ban size={17} />
                Suspend Property
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>

  {/* Suspend modal */}
  {showSuspendModal && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <Ban size={22} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-gray-900">
          Suspend accommodation?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Suspending this accommodation will remove it from traveller
          searches until an administrator restores it.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowSuspendModal(false)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSuspend}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Suspend Property
          </button>
        </div>
      </div>
    </div>
  )}
</div>


);
};

const InfoRow = ({ icon: Icon, label, value }) => {
return ( <div className="flex items-center justify-between gap-3"> <div className="flex items-center gap-2.5"> <Icon size={16} className="text-gray-400" />


    <span className="text-sm text-gray-500">{label}</span>
  </div>

  <span className="text-right text-sm font-medium text-gray-900">
    {value}
  </span>
</div>


);
};

const CircleDollarSignIcon = () => {
return ( <span className="text-lg font-bold">
₦ </span>
);
};

export default AccommodationDetailsPage;
