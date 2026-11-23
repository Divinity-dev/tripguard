"use client";

import Link from "next/link";
import {
ArrowLeft,
Bell,
Menu,
Search,
} from "lucide-react";

const AdminNavbar = () => {
return ( <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur"> <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
{/* Left */} <div className="flex items-center gap-3">
{/* Mobile menu button */} <button
         type="button"
         className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden"
         aria-label="Open admin menu"
       > <Menu size={19} /> </button>


      {/* Back to website */}
      <Link
        href="/"
        className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-[#63E6BE]/40 hover:bg-[#63E6BE]/5 hover:text-[#159669]"
      >
        <ArrowLeft
          size={14}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />

        <span className="hidden sm:inline">
          Back to website
        </span>

        <span className="sm:hidden">
          Website
        </span>
      </Link>
    </div>

    {/* Right */}
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Search */}
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        aria-label="Search"
      >
        <Search size={17} />
      </button>

      {/* Notifications */}
      <Link
        href="/admin/notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        aria-label="Admin notifications"
      >
        <Bell size={17} />

        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#63E6BE]" />
      </Link>
    </div>
  </div>
</header>


);
};

export default AdminNavbar;
