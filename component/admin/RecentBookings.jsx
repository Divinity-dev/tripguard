import Link from "next/link";
import {
ArrowUpRight,
CheckCircle2,
Clock3,
XCircle,
} from "lucide-react";

const bookings = [
{
id: "TG-10284",
guest: "Daniel Okafor",
property: "The Meridian House",
amount: "₦185,000",
status: "Completed",
},
{
id: "TG-10283",
guest: "Amaka Eze",
property: "Palm Court Residence",
amount: "₦240,000",
status: "Pending",
},
{
id: "TG-10282",
guest: "Michael Adeyemi",
property: "Cedar View Suites",
amount: "₦150,000",
status: "Completed",
},
{
id: "TG-10281",
guest: "Sarah Williams",
property: "The Meridian House",
amount: "₦95,000",
status: "Cancelled",
},
];

const statusStyles = {
Completed: "bg-emerald-50 text-emerald-600",
Pending: "bg-amber-50 text-amber-600",
Cancelled: "bg-red-50 text-red-600",
};

const statusIcons = {
Completed: CheckCircle2,
Pending: Clock3,
Cancelled: XCircle,
};

const RecentBookings = () => {
return ( <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"> <div className="flex items-center justify-between border-b border-gray-100 p-5"> <div> <h2 className="font-semibold text-gray-900">
Recent Bookings </h2>

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
          const StatusIcon = statusIcons[booking.status];

          return (
            <tr
              key={booking.id}
              className="border-b border-gray-50 last:border-0"
            >
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-gray-900">
                  {booking.id}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {booking.property}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-gray-600">
                {booking.guest}
              </td>

              <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                {booking.amount}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[booking.status]}`}
                >
                  <StatusIcon size={12} />
                  {booking.status}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

);
};

export default RecentBookings;
