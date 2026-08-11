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
CalendarCheck,
CheckCircle2,
Clock3,
CreditCard,
ExternalLink,
FileText,
Globe,
Heart,
Home,
Mail,
MapPin,
MoreHorizontal,
Phone,
ShieldCheck,
UserRound,
Users,
XCircle,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";

const bookings = {
"TG-10284": {
id: "TG-10284",
status: "Confirmed",
guest: {
  name: "Daniel Okafor",
  email: "daniel@example.com",
  phone: "+234 803 456 7890",
  verified: true,
},

accommodation: {
  id: "1",
  name: "The Meridian House",
  type: "Hotel",
  address: "14 Admiralty Way",
  city: "Lekki",
  state: "Lagos",
  country: "Nigeria",
  image:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
  website: "https://example.com",
},

stay: {
  checkIn: "August 14, 2026",
  checkOut: "August 18, 2026",
  nights: 4,
  guests: 2,
  roomType: "Deluxe Room",
},

payment: {
  reference: "TG-PAY-984521",
  method: "Paystack",
  status: "Paid",
  amount: "₦185,000",
  accommodationFee: "₦170,000",
  serviceFee: "₦10,000",
  protectionFee: "₦5,000",
  paidAt: "August 10, 2026, 2:34 PM",
},

safety: {
  contactName: "Sarah Okafor",
  relationship: "Sister",
  email: "sarah.okafor@example.com",
  phone: "+234 809 123 4567",
  notifications: [
    {
      title: "Booking confirmation",
      status: "Sent",
      date: "August 10, 2026, 2:35 PM",
    },
    {
      title: "Check-in notification",
      status: "Scheduled",
      date: "August 14, 2026",
    },
    {
      title: "Check-out notification",
      status: "Scheduled",
      date: "August 18, 2026",
    },
  ],
},

timeline: [
  {
    title: "Booking confirmed",
    description: "Payment was successfully completed.",
    date: "August 10, 2026",
    time: "2:34 PM",
    completed: true,
  },
  {
    title: "Confirmation sent",
    description:
      "Booking details were sent to the guest and safety contact.",
    date: "August 10, 2026",
    time: "2:35 PM",
    completed: true,
  },
  {
    title: "Check-in",
    description: "Guest is scheduled to check in.",
    date: "August 14, 2026",
    time: "2:00 PM",
    completed: false,
  },
  {
    title: "Check-out",
    description: "Guest is scheduled to check out.",
    date: "August 18, 2026",
    time: "11:00 AM",
    completed: false,
  },
],

createdAt: "August 10, 2026, 2:31 PM",

},
};

const statusStyles = {
Confirmed: "bg-emerald-50 text-emerald-600",
Pending: "bg-amber-50 text-amber-600",
"Checked In": "bg-blue-50 text-blue-600",
Completed: "bg-gray-100 text-gray-600",
Cancelled: "bg-red-50 text-red-600",
};

const BookingDetailsPage = () => {
const params = useParams();
const router = useRouter();

const booking =
bookings[params.id] || bookings["TG-10284"];

const [showActions, setShowActions] = useState(false);
const [showCancelModal, setShowCancelModal] = useState(false);

const handleCancelBooking = () => {
setShowCancelModal(false);
alert("Booking cancelled successfully.");
};

const handleMarkCheckedIn = () => {
alert("Booking marked as checked in.");
};

return ( <div className="min-h-screen bg-gray-50"> <AdminSidebar />

  <div className="lg:ml-72">
    <AdminNavbar />

    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to bookings
        </button>

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Booking {booking.id}
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[booking.status]
                }`}
              >
                <CheckCircle2 size={13} />
                {booking.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Created on {booking.createdAt}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <FileText size={16} />
              Download Receipt
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowActions((current) => !current)
                }
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:bg-gray-50"
                aria-label="Booking actions"
              >
                <MoreHorizontal size={19} />
              </button>

              {showActions && (
                <div className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
                  {booking.status === "Confirmed" && (
                    <button
                      type="button"
                      onClick={handleMarkCheckedIn}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-blue-600 hover:bg-blue-50"
                    >
                      <CheckCircle2 size={16} />
                      Mark as checked in
                    </button>
                  )}

                  {booking.status !== "Cancelled" && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowActions(false);
                        setShowCancelModal(true);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <Ban size={16} />
                      Cancel booking
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking overview */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard
            icon={CalendarCheck}
            label="Check-in"
            value={booking.stay.checkIn}
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            icon={CalendarCheck}
            label="Check-out"
            value={booking.stay.checkOut}
            iconClass="bg-violet-50 text-violet-600"
          />

          <SummaryCard
            icon={Clock3}
            label="Duration"
            value={`${booking.stay.nights} nights`}
            iconClass="bg-amber-50 text-amber-600"
          />

          <SummaryCard
            icon={CreditCard}
            label="Total paid"
            value={booking.payment.amount}
            iconClass="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Accommodation */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Accommodation
                </h2>

                <Link
                  href={`/admin/accommodations/${booking.accommodation.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#159669] hover:underline"
                >
                  View property
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                <img
                  src={booking.accommodation.image}
                  alt={booking.accommodation.name}
                  className="h-36 w-full rounded-xl object-cover sm:h-28 sm:w-40"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {booking.accommodation.name}
                    </h3>

                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                      {booking.accommodation.type}
                    </span>
                  </div>

                  <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <span>
                      {booking.accommodation.address},{" "}
                      {booking.accommodation.city},{" "}
                      {booking.accommodation.state}
                    </span>
                  </div>

                  {booking.accommodation.website && (
                    <a
                      href={booking.accommodation.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#159669] hover:underline"
                    >
                      <Globe size={14} />
                      Visit website
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* Guest */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Guest Information
                </h2>

                {booking.guest.verified && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <BadgeCheck size={15} />
                    Verified guest
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#63E6BE]/15 text-[#159669]">
                  <UserRound size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {booking.guest.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Guest
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">
                <ContactItem
                  icon={Mail}
                  value={booking.guest.email}
                />

                <ContactItem
                  icon={Phone}
                  value={booking.guest.phone}
                />
              </div>
            </section>

            {/* Stay details */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Stay Details
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailBox
                  icon={CalendarCheck}
                  label="Check-in"
                  value={booking.stay.checkIn}
                />

                <DetailBox
                  icon={CalendarCheck}
                  label="Check-out"
                  value={booking.stay.checkOut}
                />

                <DetailBox
                  icon={BedDouble}
                  label="Room type"
                  value={booking.stay.roomType}
                />

                <DetailBox
                  icon={Users}
                  label="Guests"
                  value={`${booking.stay.guests} guests`}
                />
              </div>
            </section>

            {/* Safety */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#63E6BE]/15 text-[#159669]">
                      <ShieldCheck size={18} />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900">
                      TripGuard Safety Contact
                    </h2>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    This person receives safety notifications about
                    the guest's stay.
                  </p>
                </div>

                <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 sm:block">
                  Protected
                </span>
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
                    <Heart size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {booking.safety.contactName}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      {booking.safety.relationship}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-200 pt-4 sm:grid-cols-2">
                  <ContactItem
                    icon={Mail}
                    value={booking.safety.email}
                  />

                  <ContactItem
                    icon={Phone}
                    value={booking.safety.phone}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {booking.safety.notifications.map(
                  (notification) => (
                    <div
                      key={notification.title}
                      className="flex flex-col gap-2 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {notification.status === "Sent" ? (
                          <CheckCircle2
                            size={17}
                            className="text-emerald-500"
                          />
                        ) : (
                          <Clock3
                            size={17}
                            className="text-amber-500"
                          />
                        )}

                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {notification.title}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {notification.date}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold ${
                          notification.status === "Sent"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {notification.status}
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Details
                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 size={14} />
                  {booking.payment.status}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <PriceRow
                  label="Accommodation fee"
                  value={booking.payment.accommodationFee}
                />

                <PriceRow
                  label="Service fee"
                  value={booking.payment.serviceFee}
                />

                <PriceRow
                  label="Safety protection"
                  value={booking.payment.protectionFee}
                />

                <div className="border-t border-gray-100 pt-4">
                  <PriceRow
                    label="Total paid"
                    value={booking.payment.amount}
                    strong
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-400">
                    Payment reference
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {booking.payment.reference}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Payment method
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {booking.payment.method}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400">
                    Paid on
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {booking.payment.paidAt}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Timeline */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">
                Booking Timeline
              </h2>

              <div className="mt-6">
                {booking.timeline.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="relative flex gap-3 pb-7 last:pb-0"
                  >
                    {index !== booking.timeline.length - 1 && (
                      <div className="absolute left-[9px] top-5 h-full w-px bg-gray-200" />
                    )}

                    <div
                      className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        item.completed
                          ? "bg-[#63E6BE] text-gray-900"
                          : "border-2 border-gray-200 bg-white text-gray-300"
                      }`}
                    >
                      {item.completed && (
                        <CheckCircle2 size={12} />
                      )}
                    </div>

                    <div className="-mt-0.5 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-400">
                        {item.description}
                      </p>

                      <p className="mt-1 text-[11px] font-medium text-gray-500">
                        {item.date} · {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick info */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">
                Booking Information
              </h2>

              <div className="mt-5 space-y-4">
                <InfoRow
                  icon={FileText}
                  label="Booking ID"
                  value={booking.id}
                />

                <InfoRow
                  icon={Home}
                  label="Property"
                  value={booking.accommodation.name}
                />

                <InfoRow
                  icon={Users}
                  label="Guests"
                  value={String(booking.stay.guests)}
                />

                <InfoRow
                  icon={Clock3}
                  label="Duration"
                  value={`${booking.stay.nights} nights`}
                />

                <InfoRow
                  icon={CreditCard}
                  label="Payment"
                  value={booking.payment.status}
                />
              </div>
            </section>

            {/* Property link */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <Home size={20} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Need more property details?
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                View the complete accommodation profile, owner
                information, verification documents, amenities and
                property history.
              </p>

              <Link
                href={`/admin/accommodations/${booking.accommodation.id}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                View Accommodation
                <ArrowUpRight size={15} />
              </Link>
            </section>
          </div>
        </div>

        {/* Admin actions */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Administrative Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage this booking from the administrator dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {booking.status === "Confirmed" && (
                <button
                  type="button"
                  onClick={handleMarkCheckedIn}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#63E6BE] px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-[#4fd9ad]"
                >
                  <CheckCircle2 size={17} />
                  Mark as Checked In
                </button>
              )}

              {booking.status !== "Cancelled" &&
                booking.status !== "Completed" && (
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <XCircle size={17} />
                    Cancel Booking
                  </button>
                )}
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>

  {/* Cancel modal */}
  {showCancelModal && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <Ban size={22} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-gray-900">
          Cancel this booking?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          This action will cancel booking{" "}
          <span className="font-semibold text-gray-700">
            {booking.id}
          </span>
          . The guest and accommodation owner may need to be
          notified about the cancellation.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowCancelModal(false)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Keep Booking
          </button>

          <button
            type="button"
            onClick={handleCancelBooking}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  )}
</div>

);
};

const SummaryCard = ({
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

  <p className="mt-1 text-sm font-bold leading-5 text-gray-900">
    {value}
  </p>
</div>


);
};

const ContactItem = ({
icon: Icon,
value,
}) => {
return ( <div className="flex items-center gap-2.5 text-sm text-gray-600"> <Icon
     size={16}
     className="shrink-0 text-gray-400"
   />


  <span className="truncate">
    {value}
  </span>
</div>


);
};

const DetailBox = ({
icon: Icon,
label,
value,
}) => {
return ( <div className="rounded-xl bg-gray-50 p-4"> <div className="flex items-center gap-2 text-xs text-gray-400"> <Icon size={15} />
{label} </div>


  <p className="mt-2 text-sm font-semibold text-gray-800">
    {value}
  </p>
</div>

);
};

const PriceRow = ({
label,
value,
strong = false,
}) => {
return ( <div className="flex items-center justify-between gap-4">
<span
className={`text-sm ${
          strong
            ? "font-semibold text-gray-900"
            : "text-gray-500"
        }`}
>
{label} </span>

  <span
    className={`text-sm ${
      strong
        ? "text-lg font-bold text-gray-900"
        : "font-medium text-gray-700"
    }`}
  >
    {value}
  </span>
</div>

);
};

const InfoRow = ({
icon: Icon,
label,
value,
}) => {
return ( <div className="flex items-center justify-between gap-3"> <div className="flex min-w-0 items-center gap-2.5"> <Icon
       size={16}
       className="shrink-0 text-gray-400"
     />


    <span className="text-sm text-gray-500">
      {label}
    </span>
  </div>

  <span className="max-w-[55%] truncate text-right text-sm font-medium text-gray-900">
    {value}
  </span>
</div>

);
};

export default BookingDetailsPage;
