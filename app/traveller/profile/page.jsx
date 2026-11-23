"use client";

import {
  ArrowLeft,
  Check,
  ChevronRight,
  Edit3,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Lock,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import API from "@/axios/index";

const TravellerProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [isEditingProfile, setIsEditingProfile] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [isChangingPassword, setIsChangingPassword] =
  useState(false);

const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const [showCurrentPassword, setShowCurrentPassword] =
  useState(false);

const [showNewPassword, setShowNewPassword] =
  useState(false);

const [showConfirmPassword, setShowConfirmPassword] =
  useState(false);

const [passwordLoading, setPasswordLoading] =
  useState(false);

const [passwordError, setPasswordError] =
  useState("");

const [passwordSuccess, setPasswordSuccess] =
  useState(false);

  const handlePasswordChange = (field, value) => {
  setPasswordData((current) => ({
    ...current,
    [field]: value,
  }));
};

const handleChangePassword = async () => {
  setPasswordError("");
  setPasswordSuccess(false);

  const {
    currentPassword,
    newPassword,
    confirmPassword,
  } = passwordData;

  if (!currentPassword || !newPassword || !confirmPassword) {
    setPasswordError(
      "Please fill in all password fields."
    );

    return;
  }

  if (newPassword.length < 6) {
    setPasswordError(
      "New password must be at least 6 characters."
    );

    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError(
      "New passwords do not match."
    );

    return;
  }

  if (currentPassword === newPassword) {
    setPasswordError(
      "Your new password must be different from your current password."
    );

    return;
  }

  try {
    setPasswordLoading(true);

    const response = await API.put(
      "/users/change-password",
      {
        currentPassword,
        newPassword,
      }
    );

    if (response.data?.success) {
      setPasswordSuccess(true);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordSuccess(false);
      }, 2000);
    }
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    setPasswordError(
      error.response?.data?.message ||
        "Unable to change your password."
    );
  } finally {
    setPasswordLoading(false);
  }
};

  /*
   * ------------------------------------------
   * FETCH LOGGED-IN USER
   * ------------------------------------------
   */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/users/profile");

        if (response.data?.success) {
          const user = response.data.user;

          setProfile({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
          });
        }
      } catch (error) {
        console.error(
          "Fetch profile error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /*
   * ------------------------------------------
   * PROFILE CHANGE
   * ------------------------------------------
   */

  const handleProfileChange = (
    field,
    value
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /*
   * ------------------------------------------
   * SAVE PROFILE
   * ------------------------------------------
   */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const response = await API.put(
        "/users/profile",
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
        }
      );

      if (response.data?.success) {
        const user = response.data.user;

        /*
         * Replace local state with the exact
         * data returned by the backend.
         */
        setProfile({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        setIsEditingProfile(false);
        setSaved(true);

        setTimeout(() => {
          setSaved(false);
        }, 2500);
      }
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ------------------------------------------
   * LOADING STATE
   * ------------------------------------------
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/traveller"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={18} />
              </Link>

              <div>
                <p className="text-sm font-medium text-[#16a765]">
                  Traveller Dashboard
                </p>

                <h1 className="mt-0.5 text-2xl font-bold tracking-tight sm:text-3xl">
                  Profile & Safety
                </h1>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#16a765]" />

            <p className="mt-4 text-sm text-gray-500">
              Loading your profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ------------------------------------------
   * PAGE
   * ------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/traveller"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <p className="text-sm font-medium text-[#16a765]">
                Traveller Dashboard
              </p>

              <h1 className="mt-0.5 text-2xl font-bold tracking-tight sm:text-3xl">
                Profile & Safety
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Manage your personal information and account
            security.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Save Notification */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#16a765]/20 bg-[#16a765]/5 px-4 py-3 text-sm font-medium text-[#128c55]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16a765] text-white">
              <Check size={15} />
            </div>

            Your changes have been saved successfully.
          </div>
        )}

        {/* Profile Card */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#16a765] text-xl font-bold text-white">
                  {profile.firstName?.charAt(0)}
                  {profile.lastName?.charAt(0)}
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    {profile.firstName}{" "}
                    {profile.lastName}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Traveller account
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsEditingProfile(
                    (current) => !current
                  )
                }
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Edit3 size={16} />

                {isEditingProfile
                  ? "Cancel"
                  : "Edit profile"}
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <ProfileField
                icon={<User size={17} />}
                label="First name"
                value={profile.firstName}
                editing={isEditingProfile}
                onChange={(value) =>
                  handleProfileChange(
                    "firstName",
                    value
                  )
                }
              />

              <ProfileField
                icon={<User size={17} />}
                label="Last name"
                value={profile.lastName}
                editing={isEditingProfile}
                onChange={(value) =>
                  handleProfileChange(
                    "lastName",
                    value
                  )
                }
              />

              <ProfileField
                icon={<Mail size={17} />}
                label="Email address"
                value={profile.email}
                editing={false}
              />

              <ProfileField
                icon={<Phone size={17} />}
                label="Phone number"
                value={profile.phone}
                editing={isEditingProfile}
                onChange={(value) =>
                  handleProfileChange(
                    "phone",
                    value
                  )
                }
              />
            </div>

            {isEditingProfile && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save profile
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* How Protection Works */}
        <section className="mt-8 rounded-2xl bg-gray-900 p-6 text-white sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#16a765]">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                How TripGuard Protection Works
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                TripGuard helps keep someone you trust informed
                while you travel.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            <ProtectionStep
              number="01"
              title="Book your stay"
              description="Choose your accommodation and provide the email address of someone you trust."
            />

            <ProtectionStep
              number="02"
              title="Check in"
              description="Check in when you arrive and TripGuard sends your safety contact the check-in information."
            />

            <ProtectionStep
              number="03"
              title="Check out"
              description="Check out when you leave and TripGuard sends your safety contact the final update."
            />
          </div>
        </section>

        {/* Account Security */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <Lock size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Account Security
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your account password and security.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-gray-200">
              <SecurityRow
  title="Change password"
  description="Update your account password."
  onClick={() => {
    setPasswordError("");
    setPasswordSuccess(false);
    setIsChangingPassword(true);
  }}
/>
            </div>
          </div>
        </section>

        {isChangingPassword && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Change password
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose a new password for your account.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!passwordLoading) {
              setIsChangingPassword(false);
              setPasswordError("");
            }
          }}
          disabled={passwordLoading}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close"
        >
          <X size={19} />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-5 sm:p-6">
        {passwordError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#16a765]/20 bg-[#16a765]/5 px-4 py-3 text-sm font-medium text-[#128c55]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16a765] text-white">
              <Check size={15} />
            </div>

            Password changed successfully.
          </div>
        )}

        <div className="space-y-5">
          <PasswordField
            label="Current password"
            value={passwordData.currentPassword}
            onChange={(value) =>
              handlePasswordChange(
                "currentPassword",
                value
              )
            }
            visible={showCurrentPassword}
            onToggle={() =>
              setShowCurrentPassword(
                (current) => !current
              )
            }
            disabled={passwordLoading}
          />

          <PasswordField
            label="New password"
            value={passwordData.newPassword}
            onChange={(value) =>
              handlePasswordChange(
                "newPassword",
                value
              )
            }
            visible={showNewPassword}
            onToggle={() =>
              setShowNewPassword(
                (current) => !current
              )
            }
            disabled={passwordLoading}
          />

          <PasswordField
            label="Confirm new password"
            value={passwordData.confirmPassword}
            onChange={(value) =>
              handlePasswordChange(
                "confirmPassword",
                value
              )
            }
            visible={showConfirmPassword}
            onToggle={() =>
              setShowConfirmPassword(
                (current) => !current
              )
            }
            disabled={passwordLoading}
          />
        </div>

        <p className="mt-4 text-xs leading-5 text-gray-500">
          Your password must be at least 6 characters long.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              if (!passwordLoading) {
                setIsChangingPassword(false);
                setPasswordError("");
              }
            }}
            disabled={passwordLoading}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleChangePassword}
            disabled={passwordLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {passwordLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Updating...
              </>
            ) : (
              <>
                <Save size={16} />
                Change password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Back to Dashboard */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard/traveller"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#16a765] hover:underline"
          >
            Back to traveller dashboard
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
};

const ProfileField = ({
  icon,
  label,
  value,
  editing,
  onChange,
  type = "text",
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>

      {editing ? (
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>

          <input
            type={type}
            value={value}
            onChange={(event) =>
              onChange(event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#16a765] focus:ring-2 focus:ring-[#16a765]/10"
          />
        </div>
      ) : (
        <div className="flex min-h-12 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <span className="text-gray-400">
            {icon}
          </span>

          <span className="text-sm font-medium text-gray-800">
            {value || "Not provided"}
          </span>
        </div>
      )}
    </div>
  );
};

const PasswordField = ({
  label,
  value,
  onChange,
  visible,
  onToggle,
  disabled,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          disabled={disabled}
          autoComplete="off"
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-11 text-sm outline-none transition focus:border-[#16a765] focus:ring-2 focus:ring-[#16a765]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed"
          aria-label={
            visible
              ? `Hide ${label}`
              : `Show ${label}`
          }
        >
          {visible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

const ProtectionStep = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <span className="text-xs font-bold tracking-widest text-[#63E6BE]">
        {number}
      </span>

      <h3 className="mt-3 text-sm font-bold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-gray-400">
        {description}
      </p>
    </div>
  );
};

const SecurityRow = ({
  title,
  description,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-gray-50"
    >
      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <ChevronRight
        size={17}
        className="shrink-0 text-gray-400"
      />
    </button>
  );
};

export default TravellerProfilePage;