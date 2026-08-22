"use client";

import { useState } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Loader2,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PaymentModal = ({
  isOpen,
  onClose = () => {},
  amount = 0,
  email = "",
  customer = {},
  booking = {},
  token = "",
  onPayment = () => {},
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const formattedAmount = `₦${Number(amount).toLocaleString(
    "en-NG"
  )}`;

  /*
   * --------------------------------------------------
   * INITIALIZE PAYMENT
   * --------------------------------------------------
   *
   * The backend is the source of truth.
   *
   * The frontend sends ONLY the booking ID.
   *
   * The backend handles:
   *
   * - booking validation
   * - traveller validation
   * - owner validation
   * - payment amount
   * - commission calculation
   * - owner amount
   * - Paystack subaccount
   * - transaction charge
   * - local payment creation
   */

  const initializePayment = async () => {
    if (!booking?.id) {
      throw new Error(
        "A valid booking is required before making payment."
      );
    }

    if (!token) {
      throw new Error(
        "Your session has expired. Please log in again."
      );
    }

    if (!API_URL) {
      throw new Error(
        "The payment service has not been configured."
      );
    }

    const response = await fetch(
      `${API_URL}/payments/initialize`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          bookingId: booking.id,
        }),
      }
    );

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "The payment server returned an invalid response."
      );
    }

    if (!response.ok || !data?.success) {
      throw new Error(
        data?.message ||
          "Unable to initialize payment."
      );
    }

    if (!data?.payment) {
      throw new Error(
        "Payment information was not returned by the server."
      );
    }

    if (!data.payment?.paystackReference) {
      throw new Error(
        "Paystack payment reference was not returned."
      );
    }

    if (
      !data.payment?.amount ||
      Number(data.payment.amount) <= 0
    ) {
      throw new Error(
        "The payment amount returned by the server is invalid."
      );
    }

    return data.payment;
  };

  /*
   * --------------------------------------------------
   * VERIFY PAYMENT
   * --------------------------------------------------
   *
   * Paystack's frontend callback is NOT trusted as
   * final proof of payment.
   *
   * The backend verifies the transaction directly
   * with Paystack.
   */

  const verifyPayment = async (reference) => {
    if (!reference) {
      throw new Error(
        "Payment reference was not provided."
      );
    }

    if (!token) {
      throw new Error(
        "Your session has expired. Please log in again."
      );
    }

    if (!API_URL) {
      throw new Error(
        "The payment service has not been configured."
      );
    }

    const response = await fetch(
      `${API_URL}/payments/verify/${encodeURIComponent(
        reference
      )}`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "The payment verification server returned an invalid response."
      );
    }

    if (!response.ok || !data?.success) {
      throw new Error(
        data?.message ||
          "Unable to verify payment."
      );
    }

    if (!data?.payment) {
      throw new Error(
        "Verified payment information was not returned."
      );
    }

    return data.payment;
  };

  /*
   * --------------------------------------------------
   * HANDLE PAYMENT
   * --------------------------------------------------
   */

  const handlePayment = async () => {
    /*
     * Prevent duplicate payment initialization.
     */

    if (loading) {
      return;
    }

    if (!booking?.id) {
      alert(
        "A valid booking is required before making payment."
      );
      return;
    }

    if (!email) {
      alert(
        "Please provide your email address before making payment."
      );
      return;
    }

    if (!token) {
      alert(
        "Your session has expired. Please log in again."
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * ------------------------------------------------
       * STEP 1
       * Initialize payment through our backend.
       * ------------------------------------------------
       */

      const payment =
        await initializePayment();

      /*
       * IMPORTANT:
       *
       * Use the amount returned by the backend.
       *
       * Do NOT use the amount prop for the actual
       * Paystack transaction.
       */

      const paymentAmount =
        Number(payment.amount);

      /*
       * ------------------------------------------------
       * STEP 2
       * Load Paystack.
       * ------------------------------------------------
       */

      const { default: PaystackPop } =
        await import(
          "@paystack/inline-js"
        );

      const publicKey =
        process.env
          .NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error(
          "Paystack public key has not been configured."
        );
      }

      const paystack =
        new PaystackPop();

      /*
       * ------------------------------------------------
       * STEP 3
       * Open Paystack checkout.
       * ------------------------------------------------
       *
       * The backend has already configured:
       *
       * - subaccount
       * - transaction_charge
       * - bearer
       * - commission
       * - owner amount
       *
       * The frontend does not configure any of those.
       */

      paystack.newTransaction({
        key: publicKey,

        /*
         * Use the customer email supplied by the
         * authenticated booking flow.
         *
         * The backend has already validated this
         * customer during initialization.
         */

        email,

        /*
         * Use the reference generated by our backend.
         */

        reference:
          payment.paystackReference,

        /*
         * Use the amount returned by our backend.
         *
         * This is important because the backend is
         * the authoritative source for the booking amount.
         */

        amount:
          Math.round(
            paymentAmount * 100
          ),

        currency: "NGN",

        firstName:
          customer?.firstName || "",

        lastName:
          customer?.lastName || "",

        phone:
          customer?.phone || "",

        channels: [
          "card",
          "bank",
          "ussd",
          "qr",
          "eft",
          "bank_transfer",
        ],

        /*
         * ------------------------------------------------
         * PAYSTACK CHECKOUT LOADED
         * ------------------------------------------------
         *
         * Keep loading=true while checkout is open.
         *
         * This prevents the user from clicking the
         * payment button again while the Paystack
         * interface is active.
         */

        onLoad: (response) => {
          console.log(
            "Paystack checkout loaded:",
            response
          );
        },

        /*
         * ------------------------------------------------
         * PAYMENT SUCCESS
         * ------------------------------------------------
         *
         * Paystack says the transaction succeeded.
         *
         * We STILL verify through our backend.
         */

        onSuccess: async (
          transaction
        ) => {
          try {
            const reference =
              transaction?.reference ||
              payment.paystackReference ||
              payment.reference;

            if (!reference) {
              throw new Error(
                "Payment reference was not returned."
              );
            }

            const verifiedPayment =
              await verifyPayment(
                reference
              );

            /*
             * Only now do we tell the parent
             * that payment is genuinely successful.
             */

            setLoading(false);

            onPayment(
              verifiedPayment
            );
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setLoading(false);

            alert(
              error?.message ||
                "Payment was completed but could not be verified. Please check your booking status."
            );
          }
        },

        /*
         * ------------------------------------------------
         * PAYMENT CANCELLED
         * ------------------------------------------------
         */

        onCancel: () => {
          console.log(
            "Paystack payment cancelled."
          );

          setLoading(false);

          /*
           * Keep the modal open.
           *
           * This allows the traveller to try again
           * without having to reopen the payment modal.
           */
        },

        /*
         * ------------------------------------------------
         * PAYSTACK ERROR
         * ------------------------------------------------
         */

        onError: (error) => {
          console.error(
            "Paystack payment error:",
            error
          );

          setLoading(false);

          alert(
            "Unable to complete the payment. Please try again."
          );
        },
      });
    } catch (error) {
      console.error(
        "Unable to start payment:",
        error
      );

      setLoading(false);

      alert(
        error?.message ||
          "Unable to initialize payment."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        onClick={() => {
          if (!loading) {
            onClose();
          }
        }}
        disabled={loading}
        className="absolute inset-0 bg-[#07110F]/70 backdrop-blur-sm disabled:cursor-not-allowed"
        aria-label="Close payment modal"
      />

      <div className="relative w-full max-w-xl rounded-[28px] border border-[#DDE6E3] bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F5F1] text-[#173C37] transition hover:bg-[#173C37] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
                    Your payment is securely processed by
                    Paystack. TripGuard does not store your
                    card details.
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
              You'll be redirected to Paystack's secure
              payment interface to complete your payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;