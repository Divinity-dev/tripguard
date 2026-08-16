"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import {clearAuthError, } from "@/redux/slices/authSlice";
import { registerUser } from "@/redux/actions/authActions";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [success, setSuccess] = useState("");

  const dispatch = useDispatch();
const router = useRouter();

const { loading, error } = useSelector(
  (state) => state.auth
);

 const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  dispatch(clearAuthError());
  setSuccess("");
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  setSuccess("");

  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    role,
  } = formData;

  if (!firstName || !lastName || !email || !password) {
    return;
  }

  if (password.length < 6) {
    return;
  }

  if (password !== confirmPassword) {
    return;
  }

  try {
    const result = await dispatch(
      registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role,
      })
    ).unwrap();

    const user = result.user;

    if (user?.role === "admin") {
      router.push("/admin");
    } else if (user?.role === "owner") {
      router.push("/owner/dashboard");
    } else {
      router.push("/dashboard");
    }
  } catch (error) {
    console.error("Registration error:", error);
  }
};

  return (
    <main className="min-h-screen bg-[#0b0f0e] text-white">
      <div className="min-h-screen grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="hidden lg:flex relative overflow-hidden bg-[#111715]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,230,190,0.14),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(99,230,190,0.08),transparent_30%)]" />

          <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">

            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight"
            >
              Trip<span className="text-[#63E6BE]">Guard</span>
            </Link>

            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#63E6BE]/10 border border-[#63E6BE]/20">
                  <ShieldCheck
                    size={23}
                    className="text-[#63E6BE]"
                  />
                </div>

                <span className="text-sm font-medium text-[#63E6BE]">
                  Travel with confidence
                </span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                Your journey deserves
                <span className="text-[#63E6BE]">
                  {" "}peace of mind.
                </span>
              </h1>

              <p className="mt-6 text-base xl:text-lg leading-8 text-gray-400">
                Create your TripGuard account and enjoy a
                safer, more secure way to book accommodation
                wherever your journey takes you.
              </p>

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
                      Stay protected
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
                      Book with confidence
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Discover accommodation designed around
                      your comfort and safety.
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
          <div className="w-full max-w-xl">

            {/* Mobile logo */}
            <div className="lg:hidden mb-10">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight"
              >
                Trip<span className="text-[#63E6BE]">Guard</span>
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Create your account
              </h2>

              <p className="mt-3 text-gray-400">
                Join TripGuard and start travelling with
                greater peace of mind.
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

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* First + Last name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-300"
                  >
                    First name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    autoComplete="given-name"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-300"
                  >
                    Last name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    autoComplete="family-name"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06]"
                  />
                </div>
              </div>

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

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  Phone number
                  <span className="ml-2 text-xs text-gray-600">
                    Optional
                  </span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08012345678"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06]"
                />
              </div>

              {/* Account type */}
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-300">
                  Account type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "user",
                      }))
                    }
                    className={`rounded-xl border px-4 py-4 text-left transition ${
                      formData.role === "user"
                        ? "border-[#63E6BE]/50 bg-[#63E6BE]/10"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    <p
                      className={`font-semibold ${
                        formData.role === "user"
                          ? "text-[#63E6BE]"
                          : "text-white"
                      }`}
                    >
                      Traveller
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Find and book accommodation
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "owner",
                      }))
                    }
                    className={`rounded-xl border px-4 py-4 text-left transition ${
                      formData.role === "owner"
                        ? "border-[#63E6BE]/50 bg-[#63E6BE]/10"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    <p
                      className={`font-semibold ${
                        formData.role === "owner"
                          ? "text-[#63E6BE]"
                          : "text-white"
                      }`}
                    >
                      Property owner
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      List and manage properties
                    </p>
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  Password
                </label>

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
                    placeholder="Create a password"
                    autoComplete="new-password"
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
                  Confirm password
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
                    placeholder="Confirm your password"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#63E6BE] px-5 py-3.5 text-sm font-semibold text-[#08100d] transition hover:bg-[#52d9af] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}
              </button>

              {/* Login */}
              <p className="pt-2 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-[#63E6BE] transition hover:text-[#8af0d0]"
                >
                  Log in
                </Link>
              </p>
            </form>

            <p className="mt-8 text-center text-xs leading-5 text-gray-600">
              By creating an account, you agree to TripGuard's{" "}
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

export default RegisterPage;