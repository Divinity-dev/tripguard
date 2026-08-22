"use client";

import Link from "next/link";
import { Check, ShieldCheck, X } from "lucide-react";

const PaymentSuccessModal = ({
  amount = 0,
  onClose = () => {},
  propertyName = "your stay",
  bookingReference = "",
}) => {
  const formattedAmount = `₦${Number(amount).toLocaleString(
    "en-NG"
  )}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#07110F]/70 backdrop-blur-sm"
        aria-label="Close confirmation"
      />

      <div className="relative w-full max-w-md rounded-[28px] border border-[#DDE6E3] bg-white p-8 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F5F1] text-[#173C37] transition hover:bg-[#173C37] hover:text-white"
          aria-label="Close confirmation"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E1F5ED]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#397A69]">
            <Check className="h-6 w-6 text-white" />
          </div>
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
          Booking confirmed
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-[#172322]">
          Your stay is booked!
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#75817D]">
          Your payment was successful and your booking at{" "}
          <span className="font-semibold text-[#173C37]">
            {propertyName}
          </span>{" "}
          has been confirmed.
        </p>

        <div className="mt-6 rounded-2xl bg-[#F7F8F4] p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7A8581]">
              Booking amount
            </span>

            <span className="text-sm font-bold text-[#173C37]">
              {formattedAmount}
            </span>
          </div>

          {bookingReference && (
            <div className="mt-3 flex items-center justify-between border-t border-[#E8EAE5] pt-3">
              <span className="text-xs text-[#7A8581]">
                Booking reference
              </span>

              <span className="max-w-[180px] truncate text-xs font-semibold text-[#173C37]">
                {bookingReference}
              </span>
            </div>
          )}
        </div>

        <div className="mt-5 rounded-2xl bg-[#F0F7F4] p-4 text-left">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#397A69]" />

            <p className="text-xs leading-5 text-[#6E7B76]">
              When you're ready to use your accommodation, go to
              your booking and check in. That's when TripGuard will
              notify your trusted contact.
            </p>
          </div>
        </div>

        <Link
          href="/traveller/bookings"
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#173C37] px-5 py-4 font-semibold text-white transition hover:bg-[#23584E]"
        >
          View my booking
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;