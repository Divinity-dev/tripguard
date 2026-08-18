"use client";

import Link from "next/link";
import { useEffect, useState,  useRef,} from "react";
import {
  ArrowLeft,
  CalendarDays,
  LockKeyhole,
  Loader2,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Info,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";

import PaymentSuccessModal from "../../component/PaymentSuccessModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const accommodationId =
    searchParams.get("accommodationId");

  const checkInDate =
    searchParams.get("checkInDate");

  const checkOutDate =
    searchParams.get("checkOutDate");

  const guests =
    Number(searchParams.get("guests")) || 1;

  const [booking, setBooking] = useState(null);

  const [loadingBooking, setLoadingBooking] =
    useState(true);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [
    isPaymentSuccessModalOpen,
    setIsPaymentSuccessModalOpen,
  ] = useState(false);

  const [paymentError, setPaymentError] =
    useState("");

const bookingCreationStarted = useRef(false);

  /*
   * --------------------------------------------------
   * CREATE BOOKING
   * --------------------------------------------------
   *
   * BookStayModal only collects:
   *
   * - accommodationId
   * - checkInDate
   * - checkOutDate
   * - guests
   *
   * We now send those details to the backend.
   *
   * The backend is responsible for:
   *
   * - validating the accommodation
   * - validating availability
   * - validating dates
   * - validating guests
   * - calculating nights
   * - calculating accommodation amount
   * - calculating service fee
   * - calculating total amount
   * - creating the real booking
   */

 useEffect(() => {
  if (bookingCreationStarted.current) {
    return;
  }

  bookingCreationStarted.current = true;

  const createBooking = async () => {
    setPaymentError("");
    setLoadingBooking(true);

    if (!API_URL) {
      setPaymentError(
        "API URL has not been configured."
      );

      setLoadingBooking(false);
      return;
    }

    if (
      !accommodationId ||
      !checkInDate ||
      !checkOutDate
    ) {
      setPaymentError(
        "Your booking information is incomplete."
      );

      setLoadingBooking(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/bookings`,
        {
          method: "POST",
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            accommodation: accommodationId,
            checkInDate,
            checkOutDate,
            guests,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to create your booking."
        );
      }

      if (!data.booking) {
        throw new Error(
          "Booking information was not returned."
        );
      }

      setBooking(data.booking);
    } catch (error) {
      console.error(
        "Unable to create booking:",
        error
      );

      setPaymentError(
        error?.message ||
          "Unable to create your booking."
      );
    } finally {
      setLoadingBooking(false);
    }
  };

  createBooking();
}, [
  accommodationId,
  checkInDate,
  checkOutDate,
  guests,
]);



  /*
   * --------------------------------------------------
   * INITIALIZE PAYMENT
   * --------------------------------------------------
   *
   * ONLY the real booking ID is sent.
   *
   * The backend remains the source of truth for:
   *
   * - amount
   * - commission
   * - owner amount
   * - payment record
   * - Paystack configuration
   */

  const initializePayment = async () => {

    if (!booking?._id && !booking?.id) {
      throw new Error(
        "A valid booking is required before making payment."
      );
    }

    if (!API_URL) {
      throw new Error(
        "API URL has not been configured."
      );
    }

    const bookingId =
      booking?._id || booking?.id;

   const response = await fetch(
  `${API_URL}/payments/initialize`,
  {
    method: "POST",

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      bookingId,
    }),
  }
);

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Unable to initialize payment."
      );
    }

    if (!data.payment) {
      throw new Error(
        "Payment information was not returned."
      );
    }

    return data.payment;
  };

  /*
   * --------------------------------------------------
   * VERIFY PAYMENT
   * --------------------------------------------------
   */

  const verifyPayment = async (reference) => {
   
   if (!reference) {
      throw new Error(
        "Payment reference was not provided."
      );
    }

    if (!API_URL) {
      throw new Error(
        "API URL has not been configured."
      );
    }

  const response = await fetch(
  `${API_URL}/payments/verify/${encodeURIComponent(
    reference
  )}`,
  {
    method: "GET",

    credentials: "include",
  }
);

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Unable to verify payment."
      );
    }

    return data;
  };

  /*
   * --------------------------------------------------
   * HANDLE PAYMENT
   * --------------------------------------------------
   */

const handlePayment = async () => {
  setPaymentError("");

  if (!booking?._id && !booking?.id) {
    setPaymentError(
      "A valid booking is required before making payment."
    );

    return;
  }

  setIsProcessing(true);

  try {
    /*
     * --------------------------------------------------
     * STEP 1
     * INITIALIZE PAYMENT ON BACKEND
     * --------------------------------------------------
     *
     * The backend is the source of truth for:
     *
     * - booking amount
     * - TripGuard fee
     * - owner amount
     * - transaction charge
     * - Paystack reference
     * - Paystack authorization URL
     */

    const payment =
      await initializePayment();

    /*
     * --------------------------------------------------
     * STEP 2
     * VALIDATE AUTHORIZATION URL
     * --------------------------------------------------
     */

    if (!payment?.authorizationUrl) {
      throw new Error(
        "Paystack authorization URL was not returned."
      );
    }

    /*
     * --------------------------------------------------
     * STEP 3
     * REDIRECT TO PAYSTACK
     * --------------------------------------------------
     *
     * Do not initialize Paystack again here.
     *
     * The transaction has already been created
     * by our backend.
     */

    window.location.href =
      payment.authorizationUrl;
  } catch (error) {
    console.error(
      "Unable to start payment:",
      error
    );

    setIsProcessing(false);

    setPaymentError(
      error?.message ||
        "Unable to initialize payment. Please try again."
    );
  }
};

  /*
   * --------------------------------------------------
   * LOADING BOOKING
   * --------------------------------------------------
   */

  if (loadingBooking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F2]">
        <div className="flex items-center gap-3 text-[#173C37]">

          <Loader2 className="h-5 w-5 animate-spin" />

          <span className="text-sm font-medium">
            Preparing your booking...
          </span>

        </div>
      </main>
    );
  }

  /*
   * --------------------------------------------------
   * BOOKING ERROR
   * --------------------------------------------------
   */

  if (!booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F2] px-5">

        <div className="w-full max-w-md rounded-[28px] border border-[#E1E0D9] bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">

            <Info className="h-5 w-5 text-red-600" />

          </div>

          <h1 className="mt-5 text-xl font-semibold text-[#173C37]">
            Unable to load booking
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#75817D]">
            {paymentError ||
              "We couldn't create the booking you're trying to pay for."}
          </p>

          <Link
            href="/accommodations"
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#173C37] px-5 py-4 font-semibold text-white transition hover:bg-[#23584E]"
          >
            Explore stays
          </Link>

        </div>

      </main>
    );
  }

  /*
   * --------------------------------------------------
   * DISPLAY VALUES
   * --------------------------------------------------
   *
   * Everything below is presentation only.
   */

  const totalAmount =
    Number(
      booking.totalAmount ??
      booking.amount ??
      booking.paymentAmount ??
      0
    );

  const accommodationAmount =
    Number(
      booking.accommodationAmount ??
      booking.baseAmount ??
      0
    );

  const serviceFee =
    Number(
      booking.serviceFee ?? 0
    );

  const serviceFeeRate =
    Number(
      booking.serviceFeeRate ?? 10
    );

  const propertyName =
    booking.propertyName ||
    booking.accommodation?.name ||
    "Your stay";

  const propertyType =
    booking.propertyType ||
    booking.accommodation?.type ||
    "Accommodation";

  const locationData =
  booking.location ||
  booking.accommodation?.location ||
  {};

const location = [
  locationData.address,
  locationData.city,
  locationData.state,
].filter(Boolean).join(", ");

  const rating =
    booking.rating ||
    booking.accommodation?.rating ||
    "";

  const numberOfGuests =
    booking.guests ??
    booking.numberOfGuests ??
    guests;

  const nights =
    booking.nights ?? 0;

  const displayCheckIn =
    booking.checkIn ||
    booking.checkInDate ||
    checkInDate;

  const displayCheckOut =
    booking.checkOut ||
    booking.checkOutDate ||
    checkOutDate;

  return (
    <main className="min-h-screen bg-[#F7F7F2] text-[#172322]">

      {/* TOP NAV */}

      <div className="border-b border-[#E4E3DC] bg-white">

        <div className="mx-auto flex max-w-6xl items-center px-5 py-4 lg:px-8">

          <Link
            href="/accommodations"
            className="flex items-center gap-2 text-sm font-semibold text-[#397A69] transition hover:text-[#173C37]"
          >
            <ArrowLeft className="h-4 w-4" />

            Back
          </Link>

          <div className="mx-auto pr-12">

            <p className="text-sm font-semibold text-[#173C37]">
              Secure payment
            </p>

          </div>

        </div>

      </div>

      {/* PAGE */}

      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* PAYMENT */}

          <section>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
                Complete your booking
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Payment
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#75817D]">
                You're one step away from securing your stay.
                Your booking will be confirmed after your payment
                has been successfully verified.
              </p>

            </div>

            {/* PAYMENT CARD */}

            <div className="mt-8 rounded-[28px] border border-[#E1E0D9] bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-center gap-3 border-b border-[#ECEBE5] pb-6">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E1F5ED]">

                  <LockKeyhole className="h-5 w-5 text-[#277765]" />

                </div>

                <div>

                  <h2 className="font-semibold">
                    Secure payment
                  </h2>

                  <p className="mt-1 text-xs text-[#7A8581]">
                    Your payment is securely processed by Paystack.
                  </p>

                </div>

              </div>

              <div className="mt-7 space-y-6">

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Email address
                  </label>

                  <div className="flex h-12 items-center rounded-xl border border-[#DCE3E1] bg-[#F7F8F4] px-4 text-sm text-[#172322]">

                    {booking?.guest?.email ||
                      booking?.user?.email ||
                      "Your account email"}

                  </div>

                  <p className="mt-2 text-xs text-[#7A8581]">
                    Your Paystack receipt and booking confirmation
                    will be sent to this email.
                  </p>

                </div>

                {/* SERVICE FEE */}

                <div className="rounded-2xl border border-[#DDEDE7] bg-[#F0F7F4] p-5">

                  <div className="flex gap-3">

                    <Info className="h-5 w-5 shrink-0 text-[#397A69]" />

                    <div>

                      <p className="text-sm font-semibold text-[#173C37]">
                        TripGuard service fee
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#6E7B76]">
                        A {serviceFeeRate}% TripGuard service fee
                        is included in your booking total. This
                        helps us provide secure payment processing,
                        booking protection and TripGuard safety
                        features.
                      </p>

                    </div>

                  </div>

                </div>

                {/* ERROR */}

                {paymentError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

                    <p className="text-sm leading-6 text-red-700">
                      {paymentError}
                    </p>

                  </div>
                )}

                {/* PAY */}

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={
                    isProcessing ||
                    !booking?._id &&
                    !booking?.id
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-4 font-semibold text-white transition hover:bg-[#23584E] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />

                      Opening secure checkout...
                    </>
                  ) : (
                    <>
                      <LockKeyhole className="h-5 w-5 text-[#63E6BE]" />

                      Pay ₦
                      {totalAmount.toLocaleString(
                        "en-NG"
                      )}
                    </>
                  )}

                </button>

                <p className="text-center text-xs text-[#8A9390]">
                  By completing payment, you agree to TripGuard's
                  booking and cancellation policies.
                </p>

              </div>

            </div>

          </section>

          {/* BOOKING SUMMARY */}

          <aside className="lg:sticky lg:top-6 lg:h-fit">

            <div className="rounded-[28px] border border-[#E1E0D9] bg-white p-6 shadow-xl">

              {/* PROPERTY */}

              <div className="border-b border-[#ECEBE5] pb-6">

                <span className="rounded-full bg-[#E1F5ED] px-3 py-1.5 text-xs font-bold text-[#277765]">
                  {propertyType}
                </span>

                <h2 className="mt-4 text-xl font-semibold">
                  {propertyName}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-sm text-[#75817D]">

                  <MapPin className="h-4 w-4 text-[#397A69]" />

                  {location}

                </div>

                {rating && (
                  <div className="mt-3 flex items-center gap-1 text-sm font-semibold">

                    <Star className="h-4 w-4 fill-[#F3C95D] text-[#F3C95D]" />

                    {rating}

                  </div>
                )}

              </div>

              {/* DATES */}

              <div className="border-b border-[#ECEBE5] py-6">

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <div className="flex items-center gap-2">

                      <CalendarDays className="h-4 w-4 text-[#397A69]" />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                        Check in
                      </span>

                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      {displayCheckIn}
                    </p>

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <CalendarDays className="h-4 w-4 text-[#397A69]" />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8581]">
                        Check out
                      </span>

                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      {displayCheckOut}
                    </p>

                  </div>

                </div>

                <div className="mt-5 flex items-center gap-2 text-sm">

                  <Users className="h-4 w-4 text-[#397A69]" />

                  <span>
                    {numberOfGuests} guests · {nights} nights
                  </span>

                </div>

              </div>

              {/* PRICE */}

              <div className="py-6">

                <h3 className="text-sm font-semibold">
                  Price details
                </h3>

                <div className="mt-5 space-y-4 text-sm">

                  {accommodationAmount > 0 && (
                    <div className="flex justify-between gap-4 text-[#596661]">

                      <span>
                        Accommodation
                      </span>

                      <span>
                        ₦
                        {accommodationAmount.toLocaleString(
                          "en-NG"
                        )}
                      </span>

                    </div>
                  )}

                  {serviceFee > 0 && (
                    <div className="flex justify-between gap-4 text-[#596661]">

                      <div>

                        <span>
                          TripGuard service fee
                        </span>

                        <span className="ml-1 text-xs text-[#397A69]">
                          ({serviceFeeRate}%)
                        </span>

                      </div>

                      <span>
                        ₦
                        {serviceFee.toLocaleString(
                          "en-NG"
                        )}
                      </span>

                    </div>
                  )}

                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#ECEBE5] pt-5">

                  <div>

                    <span className="font-semibold">
                      Total
                    </span>

                    <p className="mt-1 text-xs text-[#7A8581]">
                      Amount you pay
                    </p>

                  </div>

                  <span className="text-xl font-bold text-[#173C37]">

                    ₦
                    {totalAmount.toLocaleString(
                      "en-NG"
                    )}

                  </span>

                </div>

              </div>

              {/* PAYMENT NOTICE */}

              <div className="rounded-2xl bg-[#F7F8F4] p-4">

                <div className="flex gap-3">

                  <LockKeyhole className="h-5 w-5 shrink-0 text-[#397A69]" />

                  <div>

                    <p className="text-sm font-semibold text-[#173C37]">
                      You will pay ₦
                      {totalAmount.toLocaleString(
                        "en-NG"
                      )}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#6E7B76]">
                      Your payment is securely processed
                      through Paystack. TripGuard does not
                      store your card details.
                    </p>

                  </div>

                </div>

              </div>

              {/* SAFETY */}

              <div className="mt-4 rounded-2xl bg-[#F0F7F4] p-4">

                <div className="flex gap-3">

                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#397A69]" />

                  <div>

                    <p className="text-sm font-semibold text-[#173C37]">
                      TripGuard protection
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#6E7B76]">
                      Once your booking is confirmed, you can
                      check in from your dashboard when you arrive.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

      {/* SUCCESS */}

      {isPaymentSuccessModalOpen && (
        <PaymentSuccessModal
          amount={totalAmount}
          propertyName={propertyName}
          onClose={() =>
            setIsPaymentSuccessModalOpen(false)
          }
        />
      )}

    </main>
  );
};

export default PaymentPage;