"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../redux/actions/authActions";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const dashboardRoute =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "owner"
      ? "/owner"
      : "/traveller";

  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!isHomePage) {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      const heroHeight = window.innerHeight;

      setScrolled(window.scrollY > heroHeight - 80);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  const transparentNavbar = isHomePage && !scrolled;

  const handleLogout = async () => {
    setMenuOpen(false);

    try {
      await dispatch(logoutUser());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        transparentNavbar
          ? "bg-transparent"
          : "bg-[#173C37] shadow-lg"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#63E6BE]">
            <ShieldCheck className="h-5 w-5 text-[#173C37]" />
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Trip<span className="text-[#63E6BE]">Guard</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 md:flex">

          <Link
            href="/accommodations"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            Explore stays
          </Link>

          {isAuthenticated && user && (
            <Link
              href={dashboardRoute}
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              Dashboard
            </Link>
          )}

          <Link
            href="/about"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            Contact Us
          </Link>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Log out
            </button>
          ) : (
            <>
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
            </>
          )}

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
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
        <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-[#10201E]/95 p-5 shadow-2xl backdrop-blur-xl md:hidden">

          <nav className="flex flex-col gap-2">

            <Link
              href="/accommodations"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Explore stays
            </Link>

            {isAuthenticated && user && (
              <Link
                href={dashboardRoute}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Contact Us
            </Link>

            <div className="my-2 h-px bg-white/10" />

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-[#63E6BE] px-4 py-3 text-center text-sm font-semibold text-[#173C37] transition hover:bg-[#7AEECC]"
                >
                  Get started
                </Link>
              </>
            )}

          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;