"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const resetEmail = sessionStorage.getItem(
      "tripguard_reset_email"
    );

    if (!resetEmail) {
      window.location.href = "/forgot-password";
      return;
    }

    setEmail(resetEmail);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const {
      newPassword,
      confirmPassword,
    } = formData;

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Your new password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email) {
      setError(
        "Your password reset session is invalid. Please start again."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset your password."
        );
      }

      /*
       * Remove the reset email once the password
       * has been successfully changed.
       */
      sessionStorage.removeItem("tripguard_reset_email");

      setSuccess(
        data.message ||
          "Your password has been reset successfully."
      );

      /*
       * Give the user a moment to see the success
       * message before returning to login.
       */
      setTimeout(() => {
        window.location.href = "/login";
      }, 1800);
    } catch (error) {
      console.error("Reset password error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
                  Secure account recovery
                </span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                Create a new
                <span className="text-[#63E6BE]">
                  {" "}password.
                </span>
              </h1>

              <p className="mt-6 text-base xl:text-lg leading-8 text-gray-400">
                You're almost back in your TripGuard
                account. Choose a strong new password to
                keep your account secure.
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
                      Secure recovery
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Your password can only be changed
                      after successful email verification.
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
                      Keep your account protected
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Choose a password that you don't use
                      on other websites.
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

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-[#63E6BE]/10 border border-[#63E6BE]/20">
                <ShieldCheck
                  size={27}
                  className="text-[#63E6BE]"
                />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Create new password
              </h2>

              <p className="mt-3 text-gray-400 leading-6">
                Enter a new password for your TripGuard
                account.
              </p>

              {email && (
                <p className="mt-2 text-sm text-gray-600 break-all">
                  {email}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#63E6BE]/20 bg-[#63E6BE]/10 px-4 py-3 text-sm text-[#63E6BE]">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 flex-shrink-0"
                />

                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* New password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  New password
                </label>

                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Create a new password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-600">
                  Password must be at least 6 characters.
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Password requirements */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="mb-3 text-xs font-medium text-gray-400">
                  Password requirements
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className={
                        formData.newPassword.length >= 6
                          ? "text-[#63E6BE]"
                          : "text-gray-700"
                      }
                    />

                    <span
                      className={`text-xs ${
                        formData.newPassword.length >= 6
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      At least 6 characters
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className={
                        formData.newPassword &&
                        formData.confirmPassword &&
                        formData.newPassword ===
                          formData.confirmPassword
                          ? "text-[#63E6BE]"
                          : "text-gray-700"
                      }
                    />

                    <span
                      className={`text-xs ${
                        formData.newPassword &&
                        formData.confirmPassword &&
                        formData.newPassword ===
                          formData.confirmPassword
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      Passwords match
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full rounded-xl bg-[#63E6BE] px-5 py-3.5 text-sm font-semibold text-[#08100d] transition hover:bg-[#52d9af] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Updating password..."
                  : "Reset password"}
              </button>

            </form>

            {/* Back to login */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-[#63E6BE] transition hover:text-[#8af0d0]"
              >
                Log in
              </Link>
            </p>

            {/* Security message */}
            <div className="mt-10 flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 flex-shrink-0 text-[#63E6BE]"
              />

              <p className="text-xs leading-5 text-gray-600">
                Your password reset session is temporary.
                Once your password has been changed, the
                recovery information is cleared.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ResetPasswordPage;