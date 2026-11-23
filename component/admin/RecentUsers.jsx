import Link from "next/link";
import { ArrowUpRight, UserRound } from "lucide-react";

const formatRelativeTime = (date) => {
  if (!date) return "Recently";

  const createdAt = new Date(date);

  if (Number.isNaN(createdAt.getTime())) {
    return "Recently";
  }

  const now = new Date();
  const difference =
    now.getTime() - createdAt.getTime();

  const seconds = Math.floor(difference / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} ${
      days === 1 ? "day" : "days"
    } ago`;
  }

  return createdAt.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatRole = (role) => {
  if (!role) return "User";

  return role.charAt(0).toUpperCase() + role.slice(1);
};

const RecentUsers = ({ users = [] }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-5">
        <div>
          <h2 className="font-semibold text-gray-900">
            Recent Users
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Recently registered users
          </p>
        </div>

        <Link
          href="/admin/users"
          className="flex items-center gap-1 text-xs font-semibold text-[#159669] hover:underline"
        >
          View all
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="divide-y divide-gray-50">
        {users.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-gray-500">
              No recent users.
            </p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id || user.id || user.email}
              className="flex items-center gap-3 px-5 py-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <UserRound size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {`${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unnamed user"}
                  </p>

                  <span className="shrink-0 text-[11px] text-gray-400">
                    {formatRelativeTime(user.createdAt)}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <p className="truncate text-xs text-gray-400">
                    {user.email || "No email"}
                  </p>

                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                    {formatRole(user.role)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentUsers;