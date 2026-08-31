"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CircleCheck,
  Loader2,
  Save,
  User,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ProtectedRoute from "../../../component/ProtectedRoute";
import API from "@/axios/index";

export default function OwnerProfilePage() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  /*
   * GET PROFILE
   */
  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["owner-profile"],
    queryFn: async () => {
      const response = await API.get("/users/profile");
      return response.data;
    },
  });

  /*
   * Populate form when profile loads
   */
  useEffect(() => {
    if (profileData?.user) {
      setFormData({
        firstName: profileData.user.firstName || "",
        lastName: profileData.user.lastName || "",
        phone: profileData.user.phone || "",
      });
    }
  }, [profileData]);

  /*
   * UPDATE PROFILE
   */
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await API.put("/profile", data);
      return response.data;
    },

    onSuccess: (data) => {
      setSuccessMessage(
        data.message || "Profile updated successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["owner-profile"],
      });

      // Automatically remove the message after a few seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    },

    onError: (error) => {
      console.error("Update profile error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update your profile. Please try again."
      );
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccessMessage("");

    updateProfileMutation.mutate({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRole="owner">
        <div className="flex min-h-screen items-center justify-center bg-[#F7F7F2]">
          <div className="flex items-center gap-3 text-sm text-[#7A8581]">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading your profile...
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (isError || !profileData?.user) {
    return (
      <ProtectedRoute allowedRole="owner">
        <div className="flex min-h-screen items-center justify-center bg-[#F7F7F2] px-5">
          <div className="text-center">
            <p className="text-sm font-medium text-red-600">
              Unable to load your profile.
            </p>

            <p className="mt-2 text-xs text-[#7A8581]">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const user = profileData.user;

  return (
    <ProtectedRoute allowedRole="owner">
      <main className="min-h-screen bg-[#F7F7F2] text-[#172322]">
        {/* HEADER */}
        <section className="border-b border-[#E4E3DC] bg-white">
          <div className="mx-auto max-w-4xl px-5 py-8 lg:px-8">
            <Link
              href="/owner"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#397A69] transition hover:text-[#173C37]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
              Owner settings
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your profile
            </h1>

            <p className="mt-2 text-sm text-[#75817D]">
              Manage your personal information and account details.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <div className="mx-auto max-w-4xl px-5 py-8 lg:px-8">
          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#BFE7D8] bg-[#E1F5ED] px-4 py-3 text-sm font-medium text-[#277765]">
              <CircleCheck className="h-5 w-5 shrink-0" />
              {successMessage}
            </div>
          )}

          {/* PROFILE CARD */}
          <section className="rounded-[26px] border border-[#E3E3DC] bg-white">
            {/* CARD HEADER */}
            <div className="border-b border-[#ECEBE5] px-6 py-5 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E1F5ED]">
                  <User className="h-6 w-6 text-[#277765]" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-[#173C37]">
                    Personal information
                  </h2>

                  <p className="mt-1 text-sm text-[#7A8581]">
                    Keep your account information up to date.
                  </p>
                </div>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 p-6 sm:p-8">
                {/* FIRST + LAST NAME */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* FIRST NAME */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-[#596661]"
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
                      className="w-full rounded-xl border border-[#DCE2DF] bg-white px-4 py-3 text-sm text-[#173C37] outline-none transition placeholder:text-[#A7B0AC] focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                      placeholder="Enter your first name"
                    />
                  </div>

                  {/* LAST NAME */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-[#596661]"
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
                      className="w-full rounded-xl border border-[#DCE2DF] bg-white px-4 py-3 text-sm text-[#173C37] outline-none transition placeholder:text-[#A7B0AC] focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#596661]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA29F]" />

                    <input
                      id="email"
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-[#E3E6E4] bg-[#F4F5F2] py-3 pl-11 pr-4 text-sm text-[#7A8581]"
                    />
                  </div>

                  <p className="mt-2 text-xs text-[#8A9390]">
                    Your email address cannot be changed here.
                  </p>
                </div>

                {/* PHONE */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-[#596661]"
                  >
                    Phone number
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA29F]" />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#DCE2DF] bg-white py-3 pl-11 pr-4 text-sm text-[#173C37] outline-none transition placeholder:text-[#A7B0AC] focus:border-[#397A69] focus:ring-2 focus:ring-[#397A69]/10"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* ACCOUNT STATUS */}
                <div className="rounded-2xl border border-[#DCE6E2] bg-[#F0F7F4] p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#397A69]" />

                    <div>
                      <p className="text-sm font-semibold text-[#173C37]">
                        Account status
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#75817D]">
                        Your email is{" "}
                        {user.isVerified
                          ? "verified"
                          : "not verified"}{" "}
                        and your account is{" "}
                        {user.isActive
                          ? "active"
                          : "inactive"}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#ECEBE5] px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
                <Link
                  href="/owner"
                  className="rounded-xl border border-[#DCE2DF] px-5 py-3 text-center text-sm font-semibold text-[#173C37] transition hover:bg-[#F7F8F4]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#23584E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* PAYMENT ACCOUNT LINK */}
          <section className="mt-6 rounded-[26px] border border-[#DCE6E2] bg-[#F0F7F4] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
                  Payments
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#173C37]">
                  Payment account
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-[#75817D]">
                  Add your bank account so you can receive payments from
                  bookings made for your properties.
                </p>
              </div>

              <Link
                href="/owner/account"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#23584E]"
              >
                Manage payment account
              </Link>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}

