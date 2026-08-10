"use client";

import { useState } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Loader2,
  X,
} from "lucide-react";

const PaymentModal = ({
  isOpen,
  onClose = () => {},
  amount = 0,
  email = "",
  customer = {},
  booking = {},
  onPayment = () => {},
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const formattedAmount = `₦${Number(amount).toLocaleString("en-NG")}`;

  const handlePayment = async () => {
    if (!email) {
      alert("Please provide your email address before making payment.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Invalid payment amount.");
      return;
    }

    setLoading(true);

    try {
      const { default: PaystackPop } = await import(
        "@paystack/inline-js"
      );

      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error(
          "Paystack public key has not been configured yet."
        );
      }

      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: publicKey,
        email,
        amount: Math.round(Number(amount) * 100),
        currency: "NGN",
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
        phone: customer?.phone || "",
        channels: [
          "card",
          "bank",
          "ussd",
          "qr",
          "eft",
          "bank_transfer",
        ],
        metadata: {
          bookingId: booking?.id || "",
          accommodationId: booking?.accommodationId || "",
          accommodationName: booking?.accommodationName || "",
          checkInDate: booking?.checkInDate || "",
          checkOutDate: booking?.checkOutDate || "",
          guests: booking?.guests || 1,
        },
        onLoad: (response) => {
          console.log("Paystack checkout loaded:", response);
        },
        onSuccess: (transaction) => {
          console.log("Payment completed:", transaction);
          setLoading(false);
          onPayment(transaction);
        },
        onCancel: () => {
          console.log("Payment cancelled.");
          setLoading(false);
          onClose();
        },
        onError: (error) => {
          console.error("Paystack payment error:", error);
          setLoading(false);
          onClose();
        },
      });
    } catch (error) {
      console.error("Unable to start payment:", error);
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#07110F]/70 backdrop-blur-sm"
        aria-label="Close payment modal"
      />

      <div className="relative w-full max-w-xl rounded-[28px] border border-[#DDE6E3] bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F5F1] text-[#173C37] transition hover:bg-[#173C37] hover:text-white"
          aria-label="Close payment modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-[#ECEBE5] pb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E1F5ED]">
            <LockKeyhole className="h-5 w-5 text-[#277765]" />
          </div>

          <div>
            <h2 className="font-semibold text-[#173C37]">
              Secure payment
            </h2>

            <p className="mt-1 text-xs text-[#7A8581]">
              Your payment is securely processed.
            </p>
          </div>
        </div>

        <div className="mt-7">
          <div className="rounded-[24px] border border-[#E1E0D9] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#7A8581]">
                  Amount to pay
                </p>

                <p className="mt-2 text-2xl font-bold text-[#173C37]">
                  {formattedAmount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E1F5ED]">
                <ShieldCheck className="h-6 w-6 text-[#277765]" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#F0F7F4] p-4">
              <div className="flex gap-3">
                <LockKeyhole className="h-5 w-5 shrink-0 text-[#397A69]" />

                <div>
                  <p className="text-sm font-semibold text-[#173C37]">
                    Secure payment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#6E7B76]">
                    Your payment is securely processed by Paystack.
                    TripGuard does not store your card details.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-4 font-semibold text-white transition hover:bg-[#23584E] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Opening secure checkout...
                </>
              ) : (
                <>
                  <LockKeyhole className="h-5 w-5 text-[#63E6BE]" />
                  Pay {formattedAmount}
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[11px] leading-5 text-[#8A9390]">
              You'll be redirected to Paystack's secure payment
              interface to complete your payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
