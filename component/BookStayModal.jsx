"use client";

import { useState } from "react";
import { CalendarDays, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";

const BookStayModal = ({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
}) => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);

  const router = useRouter();

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      checkInDate,
      checkOutDate,
      guests,
    });
    router.push("/payment");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* BACKDROP */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#07110F]/60 backdrop-blur-sm"
        aria-label="Close booking form"
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md rounded-[28px] border border-[#DDE6E3] bg-white p-7 shadow-2xl">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
              TripGuard booking
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#172322]">
              Book your stay
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#75817D]">
              Choose your dates and the number of guests for your stay.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F5F1] text-[#173C37] transition hover:bg-[#173C37] hover:text-white"
            aria-label="Close booking form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* CHECK-IN / CHECK-OUT */}
          <div className="overflow-hidden rounded-2xl border border-[#DCE3E1]">
            <div className="grid grid-cols-2">
              {/* CHECK-IN */}
              <div className="border-r border-[#DCE3E1] p-4">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                  <CalendarDays className="h-4 w-4 text-[#397A69]" />
                  Check in
                </label>

                <input
                  type="date"
                  value={checkInDate}
                  onChange={(event) => setCheckInDate(event.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="mt-2 w-full bg-transparent text-sm font-semibold text-[#172322] outline-none"
                  required
                />
              </div>

              {/* CHECK-OUT */}
              <div className="p-4">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                  <CalendarDays className="h-4 w-4 text-[#397A69]" />
                  Check out
                </label>

                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(event) => setCheckOutDate(event.target.value)}
                  min={
                    checkInDate ||
                    new Date().toISOString().slice(0, 10)
                  }
                  className="mt-2 w-full bg-transparent text-sm font-semibold text-[#172322] outline-none"
                  required
                />
              </div>
            </div>

            {/* GUESTS */}
            <div className="border-t border-[#DCE3E1] p-4">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                <Users className="h-4 w-4 text-[#397A69]" />
                Guests
              </label>

              <select
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                className="mt-2 w-full bg-transparent text-sm font-semibold text-[#172322] outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                  <option key={number} value={number}>
                    {number} {number === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#DCE3E1] px-5 py-3 text-sm font-semibold text-[#173C37] transition hover:bg-[#F7F8F4]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#173C37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#23584E]"
            >
              Continue to payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookStayModal;

