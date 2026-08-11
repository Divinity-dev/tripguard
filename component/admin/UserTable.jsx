"use client";

import {
CheckCircle2,
Clock3,
MoreHorizontal,
ShieldAlert,
UserRound,
} from "lucide-react";

const statusStyles = {
Active: "bg-emerald-50 text-emerald-600",
Pending: "bg-amber-50 text-amber-600",
Suspended: "bg-red-50 text-red-600",
};

const UserTable = ({
users = [],
onView,
onStatusChange,
showActions = true,
}) => {
return ( <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"> <div className="overflow-x-auto"> <table className="w-full min-w-[850px]"> <thead> <tr className="border-b border-gray-100 bg-gray-50/70"> <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
User </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Role
          </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Verification
          </th>

          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Joined
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
        {users.length > 0 ? (
          users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-50 transition last:border-0 hover:bg-gray-50/50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#63E6BE]/15 text-sm font-semibold text-[#159669]">
                    {user.name
                      ?.charAt(0)
                      ?.toUpperCase() || <UserRound size={17} />}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                  {user.role}
                </span>
              </td>

              <td className="px-5 py-4">
                {user.verified ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <CheckCircle2 size={14} />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
                    <Clock3 size={14} />
                    Pending
                  </span>
                )}
              </td>

              <td className="px-5 py-4 text-sm text-gray-600">
                {user.joined}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    statusStyles[user.status] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              {showActions && (
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onView && (
                      <button
                        type="button"
                        onClick={() => onView(user)}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#159669] hover:bg-[#63E6BE]/10"
                      >
                        View
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onStatusChange?.(user)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      aria-label={`Actions for ${user.name}`}
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={showActions ? 6 : 5}
              className="px-5 py-12 text-center"
            >
              <ShieldAlert className="mx-auto h-8 w-8 text-gray-300" />

              <p className="mt-3 text-sm font-medium text-gray-700">
                No users found
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Users matching your filters will appear here.
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

export default UserTable;
