import Link from "next/link";
import { ArrowUpRight, UserRound } from "lucide-react";

const users = [
{
name: "Daniel Okafor",
email: "[daniel@example.com](mailto:daniel@example.com)",
type: "Traveller",
joined: "Today",
},
{
name: "Amaka Eze",
email: "[amaka@example.com](mailto:amaka@example.com)",
type: "Traveller",
joined: "Today",
},
{
name: "Ibrahim Musa",
email: "[ibrahim@example.com](mailto:ibrahim@example.com)",
type: "Owner",
joined: "Yesterday",
},
{
name: "Sarah Williams",
email: "[sarah@example.com](mailto:sarah@example.com)",
type: "Traveller",
joined: "Yesterday",
},
];

const RecentUsers = () => {
return ( <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"> <div className="flex items-center justify-between border-b border-gray-100 p-5"> <div> <h2 className="font-semibold text-gray-900">
Recent Users </h2>

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
    {users.map((user) => (
      <div
        key={user.email}
        className="flex items-center gap-3 px-5 py-4"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <UserRound size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user.name}
            </p>

            <span className="shrink-0 text-[11px] text-gray-400">
              {user.joined}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <p className="truncate text-xs text-gray-400">
              {user.email}
            </p>

            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
              {user.type}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


);
};

export default RecentUsers;
