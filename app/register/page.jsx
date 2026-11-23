"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
Eye,
EyeOff,
ShieldCheck,
CheckCircle2,
} from "lucide-react";

import {
clearAuthError,
clearAuthMessage,
} from "@/redux/slices/authSlice";

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
const [showConfirmPassword, setShowConfirmPassword] =
useState(false);

const [registrationSuccess, setRegistrationSuccess] =
useState(false);

const [registeredEmail, setRegisteredEmail] =
useState("");

const [validationError, setValidationError] =
useState("");

const dispatch = useDispatch();

const { loading, error } = useSelector(
(state) => state.auth
);

const handleChange = (e) => {
const { name, value } = e.target;


setFormData((prev) => ({
  ...prev,
  [name]: value,
}));

setValidationError("");

dispatch(clearAuthError());
dispatch(clearAuthMessage());


};

const handleSubmit = async (e) => {
e.preventDefault();


setValidationError("");
dispatch(clearAuthError());
dispatch(clearAuthMessage());

const {
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,
  role,
} = formData;

if (
  !firstName.trim() ||
  !lastName.trim() ||
  !email.trim() ||
  !password
) {
  setValidationError(
    "Please fill in all required fields."
  );
  return;
}

if (password.length < 6) {
  setValidationError(
    "Password must be at least 6 characters."
  );
  return;
}

if (password !== confirmPassword) {
  setValidationError(
    "Passwords do not match."
  );
  return;
}

try {
  const normalizedEmail =
    email.trim().toLowerCase();

  const result = await dispatch(
    registerUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password,
      role,
    })
  );

  /*
   * Registration is NOT authentication.
   *
   * The backend creates the account as unverified
   * and sends the verification email.
   *
   * We do NOT redirect to a verification page.
   */
  setRegisteredEmail(
    result?.email || normalizedEmail
  );

  setRegistrationSuccess(true);

  /*
   * Clear the form after successful registration.
   */
  setFormData({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
} catch (error) {
  console.error(
    "Registration error:",
    error
  );
}


};

const displayedError =
validationError || error;

/*

* =========================
* REGISTRATION SUCCESS
* =========================
*
* This is NOT a verification page.
*
* It simply confirms that the account was created
* and that the verification email was sent.
  */

if (registrationSuccess) {
return ( <main className="min-h-screen bg-[#0b0f0e] text-white"> <div className="min-h-screen grid lg:grid-cols-2">


      {/* LEFT SIDE */}
      <section className="hidden lg:flex relative overflow-hidden bg-[#111715]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,230,190,0.14),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(99,230,190,0.08),transparent_30%)]" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">

          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            Trip<span className="text-[#63E6BE]">
              Guard
            </span>
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
                Welcome to TripGuard
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Your journey deserves
              <span className="text-[#63E6BE]">
                {" "}peace of mind.
              </span>
            </h1>

            <p className="mt-6 text-base xl:text-lg leading-8 text-gray-400">
              Your TripGuard account is almost ready.
              Verify your email to activate your account
              and start travelling with confidence.
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
                    Account created
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Your TripGuard account has been
                    successfully created.
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
                    Verify your email
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Click the verification link we sent
                    to your email address.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} TripGuard.
            All rights reserved.
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
              Trip<span className="text-[#63E6BE]">
                Guard
              </span>
            </Link>
          </div>

          <div className="rounded-[28px] border border-[#63E6BE]/20 bg-[#111715] p-8 sm:p-10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#63E6BE]/10 border border-[#63E6BE]/20">
              <CheckCircle2
                size={30}
                className="text-[#63E6BE]"
              />
            </div>

            <div className="text-center">

              <h2 className="mt-7 text-3xl sm:text-4xl font-bold tracking-tight">
                Account created
              </h2>

              <p className="mt-4 text-gray-400 leading-7">
                Your TripGuard account has been created
                successfully.
              </p>

              <p className="mt-3 text-gray-400 leading-7">
                We've sent a verification link to:
              </p>

              <div className="mt-5 rounded-xl border border-[#63E6BE]/20 bg-[#63E6BE]/5 px-4 py-3">
                <p className="font-medium text-[#63E6BE] break-all">
                  {registeredEmail}
                </p>
              </div>

            </div>

            <div className="mt-7 rounded-xl bg-white/[0.03] border border-white/5 p-5">

              <p className="text-sm font-semibold text-white">
                What you need to do
              </p>

              <div className="mt-4 space-y-4 text-sm text-gray-500">

                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#63E6BE]/10 text-xs font-semibold text-[#63E6BE]">
                    1
                  </span>

                  <p>
                    Open the verification email from
                    TripGuard.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#63E6BE]/10 text-xs font-semibold text-[#63E6BE]">
                    2
                  </span>

                  <p>
                    Click the verification button.
                    Your account will be verified
                    automatically.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#63E6BE]/10 text-xs font-semibold text-[#63E6BE]">
                    3
                  </span>

                  <p>
                    You will be automatically redirected
                    to the TripGuard login page.
                  </p>
                </div>

              </div>

            </div>

            <div className="mt-7 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <p className="text-xs leading-5 text-gray-500 text-center">
                Didn't receive the email? Check your
                spam or junk folder.
              </p>
            </div>

            <Link
              href="/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              Go to login
            </Link>

          </div>
        </div>
      </section>
    </div>
  </main>
);


}

return ( <main className="min-h-screen bg-[#0b0f0e] text-white"> <div className="min-h-screen grid lg:grid-cols-2">


    {/* LEFT SIDE */}
    <section className="hidden lg:flex relative overflow-hidden bg-[#111715]">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,230,190,0.14),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(99,230,190,0.08),transparent_30%)]" />

      <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">

        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          Trip<span className="text-[#63E6BE]">
            Guard
          </span>
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
          © {new Date().getFullYear()} TripGuard.
          All rights reserved.
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
            Trip<span className="text-[#63E6BE]">
              Guard
            </span>
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
        {displayedError && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {displayedError}
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
                required
                placeholder="First name"
                autoComplete="given-name"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
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
                required
                placeholder="Last name"
                autoComplete="family-name"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
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
              required
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
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
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
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
                disabled={loading}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    role: "user",
                  }))
                }
                className={`rounded-xl border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
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
                disabled={loading}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    role: "owner",
                  }))
                }
                className={`rounded-xl border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
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
                required
                placeholder="Create a password"
                autoComplete="new-password"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
                required
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-[#63E6BE]/50 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
            className="w-full rounded-xl cursor-pointer bg-[#63E6BE] px-5 py-3.5 text-sm font-semibold text-[#08100d] transition hover:bg-[#52d9af] disabled:cursor-not-allowed disabled:opacity-60"
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
          By creating an account, you agree to TripGuard&apos;s{" "}

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
          </Link>.
        </p>

      </div>
    </section>
  </div>
</main>

);
};

export default RegisterPage;
