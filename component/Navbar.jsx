"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute left-0 top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-md">
            <ShieldCheck className="h-6 w-6 text-[#63E6BE]" />
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Trip<span className="text-[#63E6BE]">Guard</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#stays"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            Explore stays
          </Link>

          <Link
            href="#safety"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            How it works
          </Link>

          <Link
            href="#owners"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            List your property
          </Link>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#173C37] transition hover:bg-[#63E6BE]"
          >
            Get started
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-white md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mx-4 rounded-2xl border border-white/10 bg-[#10201E]/95 p-5 shadow-2xl backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="#stays"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Explore stays
            </Link>

            <Link
              href="#safety"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              How it works
            </Link>

            <Link
              href="#owners"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              List your property
            </Link>

            <div className="my-2 h-px bg-white/10" />

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Log in
            </Link>

            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-[#63E6BE] px-4 py-3 text-center text-sm font-semibold text-[#173C37]"
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;