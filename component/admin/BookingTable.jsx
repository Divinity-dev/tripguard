"use client";

import Link from "next/link";
import {
CalendarDays,
CheckCircle2,
Clock3,
MoreHorizontal,
XCircle,
} from "lucide-react";

const statusStyles = {
Confirmed: "bg-blue-50 text-blue-600",
"Checked In": "bg-violet-50 text-violet-600",
Completed: "bg-emerald-50 text-emerald-600",
Pending: "bg-amber-50 text-amber-600",
Cancelled: "bg-red-50 text-red-600",
};

const statusIcons = {
Confirmed: CalendarDays,
"Checked In": CheckCircle2,
Completed: CheckCircle2,
Pending: Clock3,
Cancelled: XCircle,
};

const BookingTable = ({
bookings = [],
onView,
onStatusChange,
showActions = true,
}) => {
return ( <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"> <div className="overflow-x-auto"> <table className="w-full min-w-[900px]"> <thead> <tr className="border-b border-gray-100 bg-gray-50/70"> <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
Booking </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Guest
          </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Accommodation
          </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Dates
          </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Amount
          </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Status
          </th>

          {showActions && (
            <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Action
            </th>
          )}
        </tr>
      </thead>

      <tbody>
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const StatusIcon =
              statusIcons[booking.status] || Clock3;

            const statusClass =
              statusStyles[booking.status] ||
              "bg-gray-100 text-gray-600";

            return (
              <tr
                key={booking.id}
                className="border-b border-gray-50 transition last:border-0 hover:bg-gray-50/50"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {booking.id}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {booking.createdAt}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                      {booking.guest?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.guest}
                      </p>

                      <p className="text-xs text-gray-400">
                        {booking.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {booking.accommodation}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {booking.location}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-gray-700">
                    {booking.checkIn}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    to {booking.checkOut}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {booking.amount}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}
                  >
                    <StatusIcon size={12} />
                    {booking.status}
                  </span>
                </td>

                {showActions && (
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(booking)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#159669] hover:bg-[#63E6BE]/10"
                        >
                          View
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange?.(booking)
                        }
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        aria-label={`Actions for ${booking.id}`}
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan={showActions ? 7 : 6}
              className="px-5 py-12 text-center"
            >
              <div className="mx-auto max-w-sm">
                <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />

                <p className="mt-3 text-sm font-medium text-gray-700">
                  No bookings found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Bookings matching your filters will appear here.
                </p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

);
};

export default BookingTable;
