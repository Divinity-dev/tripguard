"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to log in."
        );
      }

      setSuccess(data.message || "Login successful.");

      /*
       * Redirect based on the user's role.
       */
      if (data.user?.role === "admin") {
        window.location.href = "/admin";
      } else if (data.user?.role === "owner") {
        window.location.href = "/owner/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);

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
              Trip<span className="text-[#63E6BE]">Guard</span>
            </Link>

            {/* Main message */}
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#63E6BE]/10 border border-[#63E6BE]/20">
                  <ShieldCheck
                    size={23}
                    className="text-[#63E6BE]"
                  />
                </div>

                <span className="text-sm font-medium text-[#63E6BE]">
                  Welcome back
                </span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                Travel smarter.
                <br />
                Stay
                <span className="text-[#63E6BE]">
                  {" "}protected.
                </span>
              </h1>

              <p className="mt-6 text-base xl:text-lg leading-8 text-gray-400">
                Sign in to your TripGuard account and continue
                managing your stays, bookings, and travel
                safety.
              </p>

              {/* Benefits */}
              <div className="mt-10 space-y-5">
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#63E6BE]/10 flex items-center justify-center">
                    <ShieldCheck
                      size={15}
                      className="text-[#63E6BE]"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Your safety matters
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Keep your loved ones informed about
                      your accommodation stays.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#63E6BE]/10 flex items-center justify-center">
                    <ShieldCheck
                      size={15}
                      className="text-[#63E6BE]"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Everything in one place
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Manage your bookings and accommodation
                      details from your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
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
                Trip<span className="text-[#63E6BE]">Guard</span>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-3 text-gray-400">
                Sign in to continue your TripGuard journey.
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

            {/* Login form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06]"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#63E6BE] transition hover:text-[#8af0d0]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
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
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/10 bg-white/[0.04] accent-[#63E6BE]"
                  />

                  <span className="text-sm text-gray-500">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#63E6BE] px-5 py-3.5 text-sm font-semibold text-[#08100d] transition hover:bg-[#52d9af] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>

              {/* Register */}
              <p className="pt-2 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-[#63E6BE] transition hover:text-[#8af0d0]"
                >
                  Create one
                </Link>
              </p>
            </form>

            {/* Security message */}
            <div className="mt-10 flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 flex-shrink-0 text-[#63E6BE]"
              />

              <p className="text-xs leading-5 text-gray-600">
                Your account and personal information are
                protected by TripGuard's secure authentication
                system.
              </p>
            </div>

            {/* Legal */}
            <p className="mt-6 text-center text-xs leading-5 text-gray-600">
              By continuing, you agree to TripGuard's{" "}
              <Link
                href="/terms"
                className="text-gray-500 hover:text-[#63E6BE]"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-[#63E6BE]"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;