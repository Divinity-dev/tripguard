"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, X } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
  ]);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [success, setSuccess] = useState("");

  const [timeLeft, setTimeLeft] = useState(600);

  const inputRefs = useRef([]);

  /*
   * Countdown timer
   */
  useEffect(() => {
    if (!showOtpModal || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showOtpModal, timeLeft]);

  /*
   * Format countdown
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  /*
   * Handle email input
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
    setSuccess("");
  };

  /*
   * Send OTP
   */
  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to send password reset OTP."
        );
      }

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setTimeLeft(600);
      setShowOtpModal(true);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      console.error("Forgot password error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Handle OTP input
   */
  const handleOtpChange = (index, value) => {
    setOtpError("");

    /*
     * Allow only numbers
     */
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) {
      setOtp((prev) => {
        const updated = [...prev];
        updated[index] = "";
        return updated;
      });

      return;
    }

    /*
     * Handle pasted/multiple digits
     */
    if (numericValue.length > 1) {
      const digits = numericValue.slice(0, 6).split("");

      setOtp((prev) => {
        const updated = [...prev];

        digits.forEach((digit, digitIndex) => {
          if (index + digitIndex < 6) {
            updated[index + digitIndex] = digit;
          }
        });

        return updated;
      });

      const nextIndex = Math.min(
        index + digits.length,
        5
      );

      inputRefs.current[nextIndex]?.focus();

      return;
    }

    setOtp((prev) => {
      const updated = [...prev];
      updated[index] = numericValue;
      return updated;
    });

    /*
     * Move to next box
     */
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /*
   * Handle OTP keyboard navigation
   */
  const handleOtpKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      e.key === "ArrowRight" &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /*
   * Verify OTP
   */
  const handleVerifyOtp = async () => {
    setOtpError("");

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }

    if (timeLeft <= 0) {
      setOtpError(
        "This OTP has expired. Please request a new one."
      );
      return;
    }

    try {
      setVerifying(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: otpValue,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid OTP."
        );
      }

      /*
       * Keep the email in sessionStorage so the
       * reset-password page can use it.
       */
      sessionStorage.setItem(
        "tripguard_reset_email",
        email.trim().toLowerCase()
      );

      setShowOtpModal(false);

      /*
       * Move to reset-password page
       */
      window.location.href = "/reset-password";
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      setOtpError(
        error.message ||
          "Unable to verify OTP. Please try again."
      );
    } finally {
      setVerifying(false);
    }
  };

  /*
   * Resend OTP
   */
  const handleResendOtp = async () => {
    setOtpError("");
    setResending(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to resend OTP."
        );
      }

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setTimeLeft(600);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      console.error(
        "Resend OTP error:",
        error
      );

      setOtpError(
        error.message ||
          "Unable to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  /*
   * Close OTP modal
   */
  const closeOtpModal = () => {
    if (verifying) {
      return;
    }

    setShowOtpModal(false);
    setOtpError("");
  };

  return (
    <main className="min-h-screen bg-[#0b0f0e] text-white">
      <div className="min-h-screen grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="hidden lg:flex relative overflow-hidden bg-[#111715]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,230,190,0.14),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(99,230,190,0.08),transparent_30%)]" />

          <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">

            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight"
            >
              Trip<span className="text-[#63E6BE]">
                Guard
              </span>
            </Link>

            {/* Main content */}
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#63E6BE]/10 border border-[#63E6BE]/20">
                  <ShieldCheck
                    size={23}
                    className="text-[#63E6BE]"
                  />
                </div>

                <span className="text-sm font-medium text-[#63E6BE]">
                  Account security
                </span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                Get back to your
                <span className="text-[#63E6BE]">
                  {" "}journey.
                </span>
              </h1>

              <p className="mt-6 text-base xl:text-lg leading-8 text-gray-400">
                Forgot your password? Don't worry. We'll
                help you securely regain access to your
                TripGuard account.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#63E6BE]/10 flex items-center justify-center">
                    <CheckCircle2
                      size={15}
                      className="text-[#63E6BE]"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Secure verification
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      We'll send a one-time verification
                      code to your registered email.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#63E6BE]/10 flex items-center justify-center">
                    <CheckCircle2
                      size={15}
                      className="text-[#63E6BE]"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Quick recovery
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Verify your identity and create a new
                      password in just a few steps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} TripGuard. All
              rights reserved.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="lg:hidden mb-12">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight"
              >
                Trip<span className="text-[#63E6BE]">
                  Guard
                </span>
              </Link>
            </div>

            {/* Back */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 mb-8 text-sm text-gray-500 transition hover:text-[#63E6BE]"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-[#63E6BE]/10 border border-[#63E6BE]/20">
                <ShieldCheck
                  size={27}
                  className="text-[#63E6BE]"
                />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Forgot your password?
              </h2>

              <p className="mt-3 text-gray-400 leading-6">
                Enter the email address associated with
                your account and we'll send you a verification
                code.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-6 rounded-xl border border-[#63E6BE]/20 bg-[#63E6BE]/10 px-4 py-3 text-sm text-[#63E6BE]">
                {success}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSendOtp}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#63E6BE] px-5 py-3.5 text-sm font-semibold text-[#08100d] transition hover:bg-[#52d9af] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Sending OTP..."
                  : "Send verification code"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-[#63E6BE] transition hover:text-[#8af0d0]"
              >
                Log in
              </Link>
            </p>

            {/* Security note */}
            <div className="mt-10 flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 flex-shrink-0 text-[#63E6BE]"
              />

              <p className="text-xs leading-5 text-gray-600">
                Your verification code is temporary and
                expires after 10 minutes. Never share your
                code with anyone.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={closeOtpModal}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111715] shadow-2xl">

            {/* Top accent */}
            <div className="h-1 w-full bg-[#63E6BE]" />

            <div className="p-6 sm:p-8">

              {/* Close */}
              <button
                type="button"
                onClick={closeOtpModal}
                disabled={verifying}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close OTP modal"
              >
                <X size={19} />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#63E6BE]/10 border border-[#63E6BE]/20">
                  <ShieldCheck
                    size={30}
                    className="text-[#63E6BE]"
                  />
                </div>
              </div>

              {/* Heading */}
              <div className="text-center">
                <h3 className="text-2xl font-bold">
                  Verify your email
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  We've sent a 6-digit verification code to
                </p>

                <p className="mt-1 break-all text-sm font-medium text-[#63E6BE]">
                  {email}
                </p>
              </div>

              {/* OTP */}
              <div className="mt-8">
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] =
                          element;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleOtpKeyDown(index, e)
                      }
                      className="h-12 w-11 rounded-xl border border-white/10 bg-white/[0.04] text-center text-lg font-semibold text-white outline-none transition focus:border-[#63E6BE]/60 focus:bg-[#63E6BE]/5 sm:h-14 sm:w-12"
                      aria-label={`OTP digit ${
                        index + 1
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div className="mt-6 text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm text-gray-500">
                    Code expires in{" "}
                    <span className="font-semibold text-[#63E6BE]">
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-red-400">
                    This code has expired.
                  </p>
                )}
              </div>

              {/* OTP error */}
              {otpError && (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
                  {otpError}
                </div>
              )}

              {/* Verify */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={
                  verifying || timeLeft <= 0
                }
                className="mt-6 w-full rounded-xl bg-[#63E6BE] px-5 py-3.5 text-sm font-semibold text-[#08100d] transition hover:bg-[#52d9af] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {verifying
                  ? "Verifying..."
                  : "Verify code"}
              </button>

              {/* Resend */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="mt-2 text-sm font-medium text-[#63E6BE] transition hover:text-[#8af0d0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resending
                    ? "Sending new code..."
                    : "Resend OTP"}
                </button>
              </div>

              {/* Security */}
              <div className="mt-7 flex items-start gap-3 border-t border-white/5 pt-5">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-gray-600"
                />

                <p className="text-xs leading-5 text-gray-600">
                  For your security, never share this
                  verification code with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ForgotPasswordPage;