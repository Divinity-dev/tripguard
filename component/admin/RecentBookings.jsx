import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

const formatCurrency = (amount) => {
  const value = Number(amount || 0);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatStatus = (status) => {
  if (!status) return "Pending";

  return status
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

const statusStyles = {
  completed: "bg-emerald-50 text-emerald-600",
  confirmed: "bg-blue-50 text-blue-600",
  pending: "bg-amber-50 text-amber-600",
  "checked-in": "bg-violet-50 text-violet-600",
  "checked-out": "bg-indigo-50 text-indigo-600",
  cancelled: "bg-red-50 text-red-600",
};

const statusIcons = {
  completed: CheckCircle2,
  confirmed: CheckCircle2,
  pending: Clock3,
  "checked-in": CheckCircle2,
  "checked-out": CheckCircle2,
  cancelled: XCircle,
};

const RecentBookings = ({ bookings = [] }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-5">
        <div>
          <h2 className="font-semibold text-gray-900">
            Recent Bookings
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Latest booking activity
          </p>
        </div>

        <Link
          href="/admin/bookings"
          className="flex items-center gap-1 text-xs font-semibold text-[#159669] hover:underline"
        >
          View all
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        {bookings.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-gray-500">
              No recent bookings.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Booking
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Guest
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Amount
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => {
                const status =
                  booking.bookingStatus ||
                  booking.status ||
                  "pending";

                const normalizedStatus =
                  status.toLowerCase();

                const StatusIcon =
                  statusIcons[normalizedStatus] ||
                  Clock3;

                const statusClass =
                  statusStyles[normalizedStatus] ||
                  "bg-gray-50 text-gray-600";

                const bookingId =
                  booking.bookingReference ||
                  booking._id ||
                  booking.id;

                const guestName =
  `${booking.guest?.firstName || ""} ${
    booking.guest?.lastName || ""
  }`.trim() || "Unknown guest";

                const propertyName =
                  booking.accommodation?.name ||
                  booking.property?.name ||
                  "Accommodation";

                return (
                  <tr
                    key={booking._id || booking.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {bookingId}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {propertyName}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {guestName}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(
                        booking.totalAmount
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}
                      >
                        <StatusIcon size={12} />

                        {formatStatus(status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentBookings;