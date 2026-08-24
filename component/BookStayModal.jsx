"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const BookStayModal = ({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  accommodation = null,
}) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const [activeCalendar, setActiveCalendar] = useState(null);

  const router = useRouter();

  if (!isOpen) {
    return null;
  }

  const accommodationId =
    accommodation?._id || accommodation?.id;

  const maxGuests =
    Number(accommodation?.maxGuests) || 8;

  /*
   * ==================================================
   * HELPERS
   * ==================================================
   */

  /*
   * Convert a Date into YYYY-MM-DD.
   *
   * We deliberately use the local date components instead
   * of toISOString() so that Nigeria timezone does not
   * shift the selected date backwards by one day.
   */
  const formatDate = (date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /*
   * Return today's date at local midnight.
   */
  const today = useMemo(() => {
    const date = new Date();

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }, []);

  /*
   * ==================================================
   * UNAVAILABLE DATES
   * ==================================================
   *
   * Convert the accommodation's unavailable date
   * ranges into react-day-picker disabled ranges.
   */

  const unavailableDateRanges = useMemo(() => {
    if (
      !Array.isArray(
        accommodation?.unavailableDates
      )
    ) {
      return [];
    }

    return accommodation.unavailableDates
      .filter(
        (range) =>
          range?.startDate &&
          range?.endDate
      )
      .map((range) => ({
        from: new Date(range.startDate),
        to: new Date(range.endDate),
      }));
  }, [
    accommodation?.unavailableDates,
  ]);

  /*
   * ==================================================
   * CHECK-IN DISABLED DATES
   * ==================================================
   *
   * Before today + owner-blocked dates.
   */

  const checkInDisabled = useMemo(() => {
    return [
      {
        before: today,
      },
      ...unavailableDateRanges,
    ];
  }, [
    today,
    unavailableDateRanges,
  ]);

  /*
   * ==================================================
   * CHECK-OUT DISABLED DATES
   * ==================================================
   *
   * Before check-in + owner-blocked dates.
   */

  const checkOutDisabled = useMemo(() => {
    const disabled = [
      ...unavailableDateRanges,
    ];

    if (checkInDate) {
      disabled.push({
        before: checkInDate,
      });
    } else {
      disabled.push({
        before: today,
      });
    }

    return disabled;
  }, [
    checkInDate,
    today,
    unavailableDateRanges,
  ]);

  /*
   * ==================================================
   * HANDLE CHECK-IN
   * ==================================================
   */

  const handleCheckInSelect = (date) => {
    if (!date) {
      return;
    }

    setCheckInDate(date);

    /*
     * If the existing checkout is now before
     * or equal to the new check-in date,
     * clear it.
     */
    if (
      checkOutDate &&
      checkOutDate <= date
    ) {
      setCheckOutDate(null);
    }

    setError("");

    /*
     * Move the traveller directly to
     * checkout selection.
     */
    setActiveCalendar("checkout");
  };

  /*
   * ==================================================
   * HANDLE CHECK-OUT
   * ==================================================
   */

  const handleCheckOutSelect = (date) => {
    if (!date) {
      return;
    }

    if (
      checkInDate &&
      date <= checkInDate
    ) {
      setError(
        "Check-out date must be after the check-in date."
      );

      return;
    }

    setCheckOutDate(date);
    setError("");
  };

  /*
   * ==================================================
   * SUBMIT
   * ==================================================
   */

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!accommodationId) {
      setError(
        "This accommodation could not be identified. Please try again."
      );
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError(
        "Please select your check-in and check-out dates."
      );
      return;
    }

    if (checkOutDate <= checkInDate) {
      setError(
        "Check-out date must be after the check-in date."
      );
      return;
    }

    if (
      guests < 1 ||
      guests > maxGuests
    ) {
      setError(
        `This accommodation allows up to ${maxGuests} ${
          maxGuests === 1
            ? "guest"
            : "guests"
        }.`
      );
      return;
    }

    /*
     * Convert selected dates back into the
     * YYYY-MM-DD format expected by the
     * existing booking/payment flow.
     */
    const formattedCheckIn =
      formatDate(checkInDate);

    const formattedCheckOut =
      formatDate(checkOutDate);

    const bookingDetails = {
      accommodationId,
      checkInDate: formattedCheckIn,
      checkOutDate: formattedCheckOut,
      guests,
    };

    /*
     * Let the accommodation page know what
     * the traveller selected.
     */
    onSubmit(bookingDetails);

    /*
     * We do NOT create the booking here.
     *
     * PaymentPage will create the booking.
     * The backend remains the source of truth
     * for price and availability.
     */
    const params = new URLSearchParams({
      accommodationId,
      checkInDate: formattedCheckIn,
      checkOutDate: formattedCheckOut,
      guests: String(guests),
    });

    onClose();

    router.push(
      `/payment?${params.toString()}`
    );
  };

  /*
   * ==================================================
   * DISPLAY DATE
   * ==================================================
   */

  const checkInLabel = checkInDate
    ? checkInDate.toLocaleDateString(
        "en-NG",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "Select date";

  const checkOutLabel = checkOutDate
    ? checkOutDate.toLocaleDateString(
        "en-NG",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "Select date";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#07110F]/60 backdrop-blur-sm"
        aria-label="Close booking form"
      />

      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[28px] border border-[#DDE6E3] bg-white p-7 shadow-2xl">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="mb-6 flex items-center justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
              TripGuard booking
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#172322]">
              Book your stay
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#75817D]">
              Choose your dates and the number
              of guests for your stay.
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

        {/* =========================================
            FORM
        ========================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="overflow-hidden rounded-2xl border border-[#DCE3E1]">

            {/* =====================================
                CHECK-IN / CHECK-OUT BUTTONS
            ===================================== */}

            <div className="grid grid-cols-2">

              {/* CHECK-IN */}

              <div className="border-r border-[#DCE3E1] p-4">

                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                  <CalendarDays className="h-4 w-4 text-[#397A69]" />
                  Check in
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCalendar(
                      activeCalendar ===
                        "checkin"
                        ? null
                        : "checkin"
                    );

                    setError("");
                  }}
                  className={`mt-2 w-full text-left text-sm font-semibold outline-none ${
                    checkInDate
                      ? "text-[#172322]"
                      : "text-[#8A9390]"
                  }`}
                >
                  {checkInLabel}
                </button>

              </div>

              {/* CHECK-OUT */}

              <div className="p-4">

                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                  <CalendarDays className="h-4 w-4 text-[#397A69]" />
                  Check out
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (!checkInDate) {
                      setError(
                        "Please select your check-in date first."
                      );

                      setActiveCalendar(
                        "checkin"
                      );

                      return;
                    }

                    setActiveCalendar(
                      activeCalendar ===
                        "checkout"
                        ? null
                        : "checkout"
                    );

                    setError("");
                  }}
                  className={`mt-2 w-full text-left text-sm font-semibold outline-none ${
                    checkOutDate
                      ? "text-[#172322]"
                      : "text-[#8A9390]"
                  }`}
                >
                  {checkOutLabel}
                </button>

              </div>

            </div>

            {/* =====================================
                CALENDAR
            ===================================== */}

            {activeCalendar ===
              "checkin" && (
              <div className="border-t border-[#DCE3E1] p-3">

                <DayPicker
                  mode="single"
                  selected={checkInDate}
                  onSelect={
                    handleCheckInSelect
                  }
                  disabled={
                    checkInDisabled
                  }
                  defaultMonth={
                    checkInDate ||
                    today
                  }
                  showOutsideDays
                  className="mx-auto"
                />

                <p className="px-2 pb-2 text-xs text-[#8A9390]">
                  Dates unavailable for
                  booking are disabled.
                </p>

              </div>
            )}

            {activeCalendar ===
              "checkout" && (
              <div className="border-t border-[#DCE3E1] p-3">

                <DayPicker
                  mode="single"
                  selected={checkOutDate}
                  onSelect={
                    handleCheckOutSelect
                  }
                  disabled={
                    checkOutDisabled
                  }
                  defaultMonth={
                    checkOutDate ||
                    checkInDate ||
                    today
                  }
                  showOutsideDays
                  className="mx-auto"
                />

                <p className="px-2 pb-2 text-xs text-[#8A9390]">
                  Select a date after your
                  check-in date.
                </p>

              </div>
            )}

            {/* =====================================
                GUESTS
            ===================================== */}

            <div className="border-t border-[#DCE3E1] p-4">

              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                <Users className="h-4 w-4 text-[#397A69]" />
                Guests
              </label>

              <select
                value={guests}
                onChange={(event) => {
                  setGuests(
                    Number(
                      event.target.value
                    )
                  );

                  setError("");
                }}
                className="mt-2 w-full bg-transparent text-sm font-semibold text-[#172322] outline-none"
              >
                {Array.from(
                  {
                    length: maxGuests,
                  },
                  (_, index) =>
                    index + 1
                ).map((number) => (
                  <option
                    key={number}
                    value={number}
                  >
                    {number}{" "}
                    {number === 1
                      ? "guest"
                      : "guests"}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-[#8A9390]">
                Maximum {maxGuests}{" "}
                {maxGuests === 1
                  ? "guest"
                  : "guests"}
              </p>

            </div>

          </div>

          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
              {error}
            </div>
          )}

          {/* =========================================
              ACTIONS
          ========================================= */}

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