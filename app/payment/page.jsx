"use client";

import Link from "next/link";
import { useState } from "react";
import {
ArrowLeft,
CalendarDays,
LockKeyhole,
Loader2,
MapPin,
ShieldCheck,
Star,
Users,
} from "lucide-react";

import PaymentSuccessModal from "../../component/PaymentSuccessModal";

const PaymentPage = () => {
const [isProcessing, setIsProcessing] = useState(false);
const [isPaymentSuccessModalOpen, setIsPaymentSuccessModalOpen] =
useState(false);
const [paymentError, setPaymentError] = useState("");

// Temporary booking data.
// Later this will come from the booking created before payment.
const booking = {
id: "temp-booking-id",

propertyId: "the-meridian-house",

propertyName: "The Meridian House",
propertyType: "Luxury Hotel",
location: "Victoria Island, Lagos",
rating: "4.9",

checkIn: "August 18, 2026",
checkOut: "August 21, 2026",
checkInDate: "2026-08-18",
checkOutDate: "2026-08-21",

guests: 2,
nights: 3,

pricePerNight: 185000,
serviceFee: 15000,


};

const customer = {
email: "[divine_asiriuwa@yahoo.com](mailto:divine_asiriuwa@yahoo.com)",
firstName: "Divine",
lastName: "Asiriuwa",
phone: "",
};

const accommodationTotal =
booking.pricePerNight * booking.nights;

const totalAmount =
accommodationTotal + booking.serviceFee;

const handlePayment = async () => {
setPaymentError("");


if (!customer.email) {
  setPaymentError(
    "We couldn't find your email address. Please sign in again and try again."
  );
  return;
}

if (!totalAmount || totalAmount <= 0) {
  setPaymentError("Invalid payment amount.");
  return;
}

setIsProcessing(true);

try {
  const { default: PaystackPop } = await import(
    "@paystack/inline-js"
  );

  const publicKey =
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error(
      "Paystack public key has not been configured."
    );
  }

  const paystack = new PaystackPop();

  paystack.newTransaction({
    key: publicKey,

    email: customer.email,

    // Paystack expects the amount in kobo.
    amount: Math.round(totalAmount * 100),

    currency: "NGN",

    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,

    channels: [
      "card",
      "bank",
      "ussd",
      "qr",
      "eft",
      "bank_transfer",
    ],

    metadata: {
      bookingId: booking.id,
      accommodationId: booking.propertyId,
      accommodationName: booking.propertyName,

      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,

      guests: booking.guests,
      nights: booking.nights,

      accommodationTotal,
      serviceFee: booking.serviceFee,
      totalAmount,
    },

    onLoad: (response) => {
      console.log(
        "Paystack checkout loaded:",
        response
      );

      setIsProcessing(false);
    },

    onSuccess: (transaction) => {
      console.log(
        "Paystack payment completed:",
        transaction
      );

      /*
       * IMPORTANT:
       *
       * This is temporarily treated as a successful payment
       * for the frontend.
       *
       * Once the backend is ready, we will NOT immediately
       * confirm the booking here.
       *
       * Instead:
       *
       * Paystack reference
       *       ↓
       * Backend verification
       *       ↓
       * Booking confirmed
       *       ↓
       * Success modal
       */

      setIsProcessing(false);

      setIsPaymentSuccessModalOpen(true);
    },

    onCancel: () => {
      console.log("Paystack payment cancelled.");

      setIsProcessing(false);
    },

    onError: (error) => {
      console.error(
        "Paystack payment error:",
        error
      );

      setIsProcessing(false);

      setPaymentError(
        "We couldn't complete the payment. Please try again."
      );
    },
  });
} catch (error) {
  console.error(
    "Unable to initialize Paystack:",
    error
  );

  setIsProcessing(false);

  setPaymentError(
    error?.message ||
      "Unable to open the payment checkout. Please try again."
  );
}


};

return ( <main className="min-h-screen bg-[#F7F7F2] text-[#172322]">
{/* TOP NAV */} <div className="border-b border-[#E4E3DC] bg-white"> <div className="mx-auto flex max-w-6xl items-center px-5 py-4 lg:px-8"> <Link
         href="/accommodations"
         className="flex items-center gap-2 text-sm font-semibold text-[#397A69] transition hover:text-[#173C37]"
       > <ArrowLeft className="h-4 w-4" />
Back </Link>

```
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

            {/* CUSTOMER EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email address
              </label>

              <div className="flex h-12 items-center rounded-xl border border-[#DCE3E1] bg-[#F7F8F4] px-4 text-sm text-[#172322]">
                {customer.email}
              </div>

              <p className="mt-2 text-xs text-[#7A8581]">
                Your Paystack receipt and booking confirmation
                will be sent to this email.
              </p>
            </div>

            {/* SECURITY INFORMATION */}
            <div className="rounded-2xl bg-[#F7F8F4] p-5">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-[#397A69]" />

                <div>
                  <p className="text-sm font-semibold text-[#173C37]">
                    Secure TripGuard payment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#6E7B76]">
                    Your payment will be processed securely
                    through Paystack. TripGuard does not store
                    your card details.
                  </p>
                </div>
              </div>
            </div>

            {/* PAYMENT ERROR */}
            {paymentError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm leading-6 text-red-700">
                  {paymentError}
                </p>
              </div>
            )}

            {/* PAY BUTTON */}
            <button
              type="button"
              onClick={handlePayment}
              disabled={isProcessing}
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
                  Pay ₦{totalAmount.toLocaleString()}
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
              {booking.propertyType}
            </span>

            <h2 className="mt-4 text-xl font-semibold">
              {booking.propertyName}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-sm text-[#75817D]">
              <MapPin className="h-4 w-4 text-[#397A69]" />
              {booking.location}
            </div>

            <div className="mt-3 flex items-center gap-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-[#F3C95D] text-[#F3C95D]" />
              {booking.rating}
            </div>
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
                  {booking.checkIn}
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
                  {booking.checkOut}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-[#397A69]" />

              <span>
                {booking.guests} guests · {booking.nights} nights
              </span>
            </div>
          </div>

          {/* PRICE */}
          <div className="py-6">
            <h3 className="text-sm font-semibold">
              Price details
            </h3>

            <div className="mt-5 space-y-4 text-sm">

              <div className="flex justify-between gap-4 text-[#596661]">
                <span>
                  ₦{booking.pricePerNight.toLocaleString()} ×{" "}
                  {booking.nights} nights
                </span>

                <span>
                  ₦{accommodationTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-[#596661]">
                <span>TripGuard service fee</span>

                <span>
                  ₦{booking.serviceFee.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#ECEBE5] pt-5">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-xl font-bold text-[#173C37]">
                ₦{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* SAFETY */}
          <div className="rounded-2xl bg-[#F0F7F4] p-4">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#397A69]" />

              <div>
                <p className="text-sm font-semibold text-[#173C37]">
                  TripGuard protection
                </p>

                <p className="mt-1 text-xs leading-5 text-[#6E7B76]">
                  Once your booking is confirmed, you can check
                  in from your dashboard when you arrive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>

  {/* PAYMENT SUCCESS */}
  {isPaymentSuccessModalOpen && (
    <PaymentSuccessModal
      amount={totalAmount}
      propertyName={booking.propertyName}
      onClose={() =>
        setIsPaymentSuccessModalOpen(false)
      }
    />
  )}
</main>


);
};

export default PaymentPage;
