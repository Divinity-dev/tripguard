"use client";

import {
Building2,
CheckCircle2,
Clock3,
MoreHorizontal,
XCircle,
} from "lucide-react";

const statusStyles = {
Approved: "bg-emerald-50 text-emerald-600",
Pending: "bg-amber-50 text-amber-600",
Suspended: "bg-red-50 text-red-600",
Rejected: "bg-red-50 text-red-600",
};

const statusIcons = {
Approved: CheckCircle2,
Pending: Clock3,
Suspended: XCircle,
Rejected: XCircle,
};

const AccommodationTable = ({
accommodations = [],
onView,
onStatusChange,
showActions = true,
}) => {
return ( <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"> <div className="overflow-x-auto"> <table className="w-full min-w-[850px]"> <thead> <tr className="border-b border-gray-100 bg-gray-50/70"> <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
Accommodation </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Owner
          </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Location
          </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Price / Night
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
        {accommodations.length > 0 ? (
          accommodations.map((accommodation) => {
            const StatusIcon =
              statusIcons[accommodation.status] || Clock3;

            const statusClass =
              statusStyles[accommodation.status] ||
              "bg-gray-100 text-gray-600";

            return (
              <tr
                key={accommodation.id}
                className="border-b border-gray-50 transition last:border-0 hover:bg-gray-50/50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {accommodation.image ? (
                        <img
                          src={accommodation.image}
                          alt={accommodation.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <Building2 size={19} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {accommodation.name}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {accommodation.type}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {accommodation.owner}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {accommodation.ownerEmail}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-gray-700">
                    {accommodation.city}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {accommodation.state}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {accommodation.price}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}
                  >
                    <StatusIcon size={12} />
                    {accommodation.status}
                  </span>
                </td>

                {showActions && (
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(accommodation)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#159669] hover:bg-[#63E6BE]/10"
                        >
                          View
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange?.(accommodation)
                        }
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        aria-label={`Actions for ${accommodation.name}`}
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
              colSpan={showActions ? 6 : 5}
              className="px-5 py-12 text-center"
            >
              <Building2 className="mx-auto h-8 w-8 text-gray-300" />

              <p className="mt-3 text-sm font-medium text-gray-700">
                No accommodations found
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Accommodations matching your filters will appear here.
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

);
};

export default AccommodationTable;
