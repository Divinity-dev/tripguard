"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PaymentSuccessModal from "../../../component/PaymentSuccessModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PaymentCallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reference = searchParams.get("reference");

  const [status, setStatus] = useState("verifying");
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setError("Payment reference was not provided.");
      return;
    }

    const verifyPayment = async () => {
      try {
        setStatus("verifying");

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
            data.message || "Unable to verify payment"
          );
        }

        setPayment(data.payment);
        setStatus("success");
      } catch (error) {
        console.error(
          "Payment verification error:",
          error
        );

        setStatus("error");
        setError(
          error.message ||
            "Unable to verify your payment."
        );
      }
    };

    verifyPayment();
  }, [reference]);

  if (status === "verifying") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F9F8] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#DDE6E3] border-t-[#397A69]" />

          <h1 className="mt-6 text-xl font-semibold text-[#173C37]">
            Verifying your payment
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#75817D]">
            Please wait while we confirm your payment
            with Paystack. Do not close this page.
          </p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F9F8] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>

          <h1 className="mt-6 text-xl font-semibold text-[#173C37]">
            Payment verification failed
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#75817D]">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/traveller/bookings"
              )
            }
            className="mt-6 w-full rounded-xl bg-[#173C37] px-5 py-4 font-semibold text-white transition hover:bg-[#23584E]"
          >
            Back to my bookings
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9F8]">
      <PaymentSuccessModal
        amount={payment?.amount || 0}
        propertyName={
          payment?.property?.name ||
          "your stay"
        }
        bookingReference={
          payment?.booking?.bookingReference ||
          ""
        }
        onClose={() =>
          router.push(
            "/dashboard/traveller/bookings"
          )
        }
      />
    </main>
  );
};

export default PaymentCallbackPage;