
"use client";

import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  Edit3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Lock,
  Heart,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const TravellerProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: "Divine",
    lastName: "Asiriuwa",
    email: "divine@example.com",
    phone: "+234 801 234 5678",
    location: "Lagos, Nigeria",
  });

  const [safetyContact, setSafetyContact] = useState({
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+234 809 876 5432",
    relationship: "Sister",
  });

  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    safetyUpdates: true,
    paymentUpdates: true,
    promotional: false,
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSafety, setIsEditingSafety] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleProfileChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSafetyChange = (field, value) => {
    setSafetyContact((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field) => {
    setNotifications((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

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
            Manage your personal information, safety contact and
            TripGuard notification preferences.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
                  DA
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    {profile.firstName} {profile.lastName}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Traveller account
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsEditingProfile((current) => !current)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Edit3 size={16} />

                {isEditingProfile ? "Cancel" : "Edit profile"}
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
                  handleProfileChange("firstName", value)
                }
              />

              <ProfileField
                icon={<User size={17} />}
                label="Last name"
                value={profile.lastName}
                editing={isEditingProfile}
                onChange={(value) =>
                  handleProfileChange("lastName", value)
                }
              />

              <ProfileField
                icon={<Mail size={17} />}
                label="Email address"
                value={profile.email}
                editing={isEditingProfile}
                type="email"
                onChange={(value) =>
                  handleProfileChange("email", value)
                }
              />

              <ProfileField
                icon={<Phone size={17} />}
                label="Phone number"
                value={profile.phone}
                editing={isEditingProfile}
                onChange={(value) =>
                  handleProfileChange("phone", value)
                }
              />

              <ProfileField
                icon={<MapPin size={17} />}
                label="Location"
                value={profile.location}
                editing={isEditingProfile}
                onChange={(value) =>
                  handleProfileChange("location", value)
                }
              />
            </div>

            {isEditingProfile && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingProfile(false);
                    handleSave();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
                >
                  <Save size={16} />
                  Save profile
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Safety Section */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    TripGuard Safety Contact
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    This person receives important updates about your
                    trip.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full bg-[#16a765]/10 px-3 py-1.5 text-xs font-semibold text-[#128c55]">
                <span className="h-2 w-2 rounded-full bg-[#16a765]" />
                Protection Active
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-2xl border border-[#16a765]/20 bg-[#16a765]/5 p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Current safety contact
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    {safetyContact.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {safetyContact.relationship}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsEditingSafety((current) => !current)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <Edit3 size={16} />

                  {isEditingSafety ? "Cancel" : "Edit contact"}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <ProfileField
                icon={<User size={17} />}
                label="Full name"
                value={safetyContact.name}
                editing={isEditingSafety}
                onChange={(value) =>
                  handleSafetyChange("name", value)
                }
              />

              <ProfileField
                icon={<Heart size={17} />}
                label="Relationship"
                value={safetyContact.relationship}
                editing={isEditingSafety}
                onChange={(value) =>
                  handleSafetyChange("relationship", value)
                }
              />

              <ProfileField
                icon={<Mail size={17} />}
                label="Email address"
                value={safetyContact.email}
                editing={isEditingSafety}
                type="email"
                onChange={(value) =>
                  handleSafetyChange("email", value)
                }
              />

              <ProfileField
                icon={<Phone size={17} />}
                label="Phone number"
                value={safetyContact.phone}
                editing={isEditingSafety}
                onChange={(value) =>
                  handleSafetyChange("phone", value)
                }
              />
            </div>

            {isEditingSafety && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingSafety(false);
                    handleSave();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
                >
                  <Save size={16} />
                  Save safety contact
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
                TripGuard helps keep someone you trust informed while
                you travel.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            <ProtectionStep
              number="01"
              title="Book your stay"
              description="Choose your accommodation and provide your safety contact."
            />

            <ProtectionStep
              number="02"
              title="Check in"
              description="Check in when you arrive to activate your protected stay."
            />

            <ProtectionStep
              number="03"
              title="Check out"
              description="Check out when you leave and your safety contact receives the final update."
            />
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Bell size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Notification Preferences
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Choose the updates you want to receive.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <NotificationSetting
              title="Booking updates"
              description="Receive updates about your reservations and trips."
              checked={notifications.bookingUpdates}
              onChange={() =>
                handleNotificationChange("bookingUpdates")
              }
            />

            <NotificationSetting
              title="Safety updates"
              description="Receive important TripGuard protection notifications."
              checked={notifications.safetyUpdates}
              onChange={() =>
                handleNotificationChange("safetyUpdates")
              }
            />

            <NotificationSetting
              title="Payment updates"
              description="Receive payment confirmations and transaction updates."
              checked={notifications.paymentUpdates}
              onChange={() =>
                handleNotificationChange("paymentUpdates")
              }
            />

            <NotificationSetting
              title="Promotional updates"
              description="Receive offers, recommendations and TripGuard news."
              checked={notifications.promotional}
              onChange={() =>
                handleNotificationChange("promotional")
              }
            />
          </div>

          <div className="flex justify-end border-t border-gray-100 p-5 sm:p-6">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
            >
              <Save size={16} />
              Save preferences
            </button>
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
                  Manage your password and account security.
                </p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-gray-100 rounded-xl border border-gray-200">
              <SecurityRow
                title="Change password"
                description="Update your account password."
              />

              <SecurityRow
                title="Login activity"
                description="Review recent activity on your account."
              />
            </div>
          </div>
        </section>

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
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#16a765] focus:ring-2 focus:ring-[#16a765]/10"
          />
        </div>
      ) : (
        <div className="flex min-h-12 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <span className="text-gray-400">{icon}</span>

          <span className="text-sm font-medium text-gray-800">
            {value}
          </span>
        </div>
      )}
    </div>
  );
};

const NotificationSetting = ({
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-5 p-5 sm:p-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500 sm:text-sm">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#16a765]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
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

      <h3 className="mt-3 text-sm font-bold">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-gray-400">
        {description}
      </p>
    </div>
  );
};

const SecurityRow = ({ title, description }) => {
  return (
    <button
      type="button"
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
