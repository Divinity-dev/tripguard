"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
LayoutDashboard,
Building2,
CalendarCheck,
Users,
ShieldCheck,
ShieldAlert,
Bell,
BarChart3,
Settings,
LogOut,
X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
{
label: "Overview",
href: "/admin",
icon: LayoutDashboard,
},
{
label: "Accommodations",
href: "/admin/accommodations",
icon: Building2,
},
{
label: "Bookings",
href: "/admin/bookings",
icon: CalendarCheck,
},
{
label: "Users",
href: "/admin/users",
icon: Users,
},
{
label: "Verifications",
href: "/admin/verifications",
icon: ShieldCheck,
badge: 24,
},
{
label: "Safety",
href: "/admin/safety",
icon: ShieldAlert,
},
{
label: "Notifications",
href: "/admin/notifications",
icon: Bell,
},
{
label: "Reports",
href: "/admin/reports",
icon: BarChart3,
},
];

// const bottomNavigation = [
// {
// label: "Settings",
// href: "/admin/settings",
// icon: Settings,
// },
// ];

const AdminSidebar = () => {
const pathname = usePathname();
const [mobileOpen, setMobileOpen] = useState(false);

const isActive = (href) => {
if (href === "/admin") {
return pathname === "/admin";
}

return pathname.startsWith(href);


};

return (
<>
{/* Mobile trigger */}
<button
onClick={() => setMobileOpen(true)}
className="fixed left-4 top-4 z-40 rounded-xl bg-white p-2.5 text-gray-700 shadow-lg lg:hidden"
aria-label="Open admin menu"
> <LayoutDashboard size={20} /> </button>

```
  {mobileOpen && (
    <button
      onClick={() => setMobileOpen(false)}
      className="fixed inset-0 z-40 bg-black/30 lg:hidden"
      aria-label="Close admin menu"
    />
  )}

  <aside
    className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
      mobileOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
      <Link
        href="/"
        className="flex items-center gap-2"
        onClick={() => setMobileOpen(false)}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#63E6BE] font-bold text-gray-900">
          T
        </div>

        <div>
          <span className="block text-lg font-bold tracking-tight text-gray-900">
            TripGuard
          </span>

          <span className="block text-[10px] font-medium uppercase tracking-widest text-gray-400">
            Administration
          </span>
        </div>
      </Link>

      <button
        onClick={() => setMobileOpen(false)}
        className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 lg:hidden"
        aria-label="Close admin menu"
      >
        <X size={19} />
      </button>
    </div>

    <div className="flex-1 overflow-y-auto px-4 py-6">
      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        Management
      </p>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#63E6BE]/15 text-[#159669]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon
                  size={18}
                  className={
                    active
                      ? "text-[#159669]"
                      : "text-gray-400 group-hover:text-gray-700"
                  }
                />
                {item.label}
              </span>

              {item.badge && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        System
      </p>

      {/* <nav className="space-y-1">
        {bottomNavigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#63E6BE]/15 text-[#159669]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                size={18}
                className={active ? "text-[#159669]" : "text-gray-400"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav> */}
    </div>

    <div className="border-t border-gray-100 p-4">
      <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
          A
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            TripGuard Admin
          </p>

          <p className="truncate text-xs text-gray-400">
            Super Administrator
          </p>
        </div>
      </div>

      <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600">
        <LogOut size={18} />
        Sign out
      </button>
    </div>
  </aside>
</>

);
};

export default AdminSidebar;
