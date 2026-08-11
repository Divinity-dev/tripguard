"use client";

import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0f0e] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#63E6BE]">
                <ShieldCheck className="h-6 w-6 text-[#0b0f0e]" />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Trip<span className="text-[#63E6BE]">Guard</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Find comfortable places to stay while keeping the people who
              matter most informed and protected throughout your trip.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>

            <ul className="mt-5 space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 transition hover:text-[#63E6BE]"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/accommodations"
                  className="text-sm text-gray-400 transition hover:text-[#63E6BE]"
                >
                  Explore stays
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-400 transition hover:text-[#63E6BE]"
                >
                  About Us
                </Link>
              </li>

               <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-400 transition hover:text-[#63E6BE]"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              For property owners
            </h3>

            <ul className="mt-5 space-y-4">
              <li>
                <Link
                  href="/list-property"
                  className="group inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-[#63E6BE]"
                >
                  List your property
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="text-sm text-gray-400 transition hover:text-[#63E6BE]"
                >
                  Log in
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="text-sm text-gray-400 transition hover:text-[#63E6BE]"
                >
                  Get started
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>

            <ul className="mt-5 space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#63E6BE]" />

                <span className="text-sm leading-6 text-gray-400">
                  Lagos, Nigeria
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-[#63E6BE]" />

                <a
                  href="mailto:hello@tripguard.com"
                  className="text-sm text-gray-400 transition hover:text-[#63E6BE]"
                >
                  hello@tripguard.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-[#63E6BE]" />

                <a
                  href="tel:+2340000000000"
                  className="text-sm text-gray-400 transition hover:text-[#63E6BE]"
                >
                  +234 000 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="mt-14 flex flex-col gap-4 rounded-2xl border border-[#63E6BE]/20 bg-[#63E6BE]/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#63E6BE]/10">
              <ShieldCheck className="h-5 w-5 text-[#63E6BE]" />
            </div>

            <div>
              <h4 className="font-semibold text-white">
                Travel with peace of mind.
              </h4>

              <p className="mt-1 text-sm text-gray-400">
                TripGuard helps keep your loved ones informed about your stay.
              </p>
            </div>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#63E6BE] transition hover:text-white"
          >
            Learn more
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} TripGuard. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 transition hover:text-[#63E6BE]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-sm text-gray-500 transition hover:text-[#63E6BE]"
            >
              Terms of Service
            </Link>

            <Link
              href="/contact"
              className="text-sm text-gray-500 transition hover:text-[#63E6BE]"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
