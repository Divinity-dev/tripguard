"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Ban,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileCheck2,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  UserX,
  Wallet,
  Building2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";
import API from "@/axios";

/*
|--------------------------------------------------------------------------
| Admin User Details Page
|--------------------------------------------------------------------------
*/

const AdminUserDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const userId = params?.id;

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch user
  |--------------------------------------------------------------------------
  */

  const fetchUser = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/admin/users/${userId}`
      );

      setUser(response.data.user);
    } catch (error) {
      console.error(
        "Fetch admin user error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to retrieve user"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch bookings
  |--------------------------------------------------------------------------
  |
  | The current backend already exposes GET /admin/bookings.
  | We filter those bookings to the current user.
  |
  */

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);

      const response = await API.get(
        "/admin/bookings"
      );

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error(
        "Fetch admin bookings error:",
        error
      );
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchBookings();
  }, [userId]);

  /*
  |--------------------------------------------------------------------------
  | User bookings
  |--------------------------------------------------------------------------
  */

  const userBookings = useMemo(() => {
    if (!user || !bookings.length) {
      return [];
    }

    return bookings.filter((booking) => {
      const guestId =
        booking?.guest?._id ||
        booking?.guest?.id ||
        booking?.guest;

      return (
        guestId?.toString() ===
        user._id?.toString()
      );
    });
  }, [bookings, user]);

  /*
  |--------------------------------------------------------------------------
  | Booking statistics
  |--------------------------------------------------------------------------
  */

  const bookingStats = useMemo(() => {
    const totalBookings = userBookings.length;

    const completedBookings =
      userBookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "completed" ||
          booking.bookingStatus ===
          "checked-out"
      ).length;

    const activeBookings =
      userBookings.filter((booking) =>
        [
          "confirmed",
          "checked-in",
        ].includes(booking.bookingStatus)
      ).length;

    const cancelledBookings =
      userBookings.filter(
        (booking) =>
          booking.bookingStatus ===
          "cancelled"
      ).length;

    /*
     * A booking with a safety contact is a protected trip.
     */
    const safetyProtected =
      userBookings.filter(
        (booking) =>
          booking?.safetyContact?.email ||
          booking?.safetyContact?.phone
      ).length;

    /*
     * Each booking can potentially generate:
     * - check-in notification
     * - check-out notification
     *
     * We only count notifications where the
     * corresponding protection timestamp exists.
     */
    const safetyNotifications =
      userBookings.reduce(
        (total, booking) => {
          let count = 0;

          if (
            booking?.safetyContact
              ?.protectionCheckInAt
          ) {
            count += 1;
          }

          if (
            booking?.safetyContact
              ?.protectionCheckOutAt
          ) {
            count += 1;
          }

          return total + count;
        },
        0
      );

    /*
     * Only count paid bookings toward total spent.
     *
     * Your booking controller uses paymentStatus
     * as the source of truth for booking payment state.
     */
    const totalSpent =
      userBookings
        .filter(
          (booking) =>
            booking.paymentStatus ===
              "paid" ||
            booking.paymentStatus ===
              "successful"
        )
        .reduce(
          (total, booking) =>
            total +
            Number(
              booking.totalAmount || 0
            ),
          0
        );

    return {
      totalBookings,
      completedBookings,
      activeBookings,
      cancelledBookings,
      safetyProtected,
      safetyNotifications,
      totalSpent,
    };
  }, [userBookings]);

  /*
  |--------------------------------------------------------------------------
  | Safety activity
  |--------------------------------------------------------------------------
  */

  const safetyActivity = useMemo(() => {
    const activities = [];

    userBookings.forEach((booking) => {
      const accommodationName =
        booking?.accommodation?.name ||
        "Accommodation";

      const safetyContact =
        booking?.safetyContact;

      if (
        safetyContact?.protectionCheckInAt
      ) {
        activities.push({
          id: `${booking._id}-checkin`,
          title:
            "Check-in notification delivered",
          description: `Safety details for "${accommodationName}" were delivered to the designated loved one.`,
          date:
            safetyContact.protectionCheckInAt,
          type: "success",
        });
      }

      if (
        safetyContact?.protectionCheckOutAt
      ) {
        activities.push({
          id: `${booking._id}-checkout`,
          title:
            "Check-out notification delivered",
          description: `A check-out notification for "${accommodationName}" was successfully delivered.`,
          date:
            safetyContact.protectionCheckOutAt,
          type: "success",
        });
      }

      if (
        safetyContact?.email ||
        safetyContact?.phone
      ) {
        activities.push({
          id: `${booking._id}-contact`,
          title: "Safety contact added",
          description:
            "A loved-one contact was added to the booking.",
          date:
            booking.createdAt ||
            booking.checkInDate,
          type: "info",
        });
      }
    });

    return activities
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 6);
  }, [userBookings]);

  /*
  |--------------------------------------------------------------------------
  | User status
  |--------------------------------------------------------------------------
  */

  const userStatus = user?.isActive
    ? "active"
    : "inactive";

  /*
  |--------------------------------------------------------------------------
  | Suspend / Activate
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async () => {
    if (!user) return;

    const nextStatus = !user.isActive;

    const confirmed = window.confirm(
      nextStatus
        ? `Are you sure you want to activate ${user.firstName} ${user.lastName}'s account?`
        : `Are you sure you want to suspend ${user.firstName} ${user.lastName}'s account?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingStatus(true);

      const response = await API.patch(
        `/admin/users/${user._id}/status`,
        {
          isActive: nextStatus,
        }
      );

      setUser((currentUser) => ({
        ...currentUser,
        ...response.data.user,
      }));
    } catch (error) {
      console.error(
        "Update user status error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to update user status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading state
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="lg:ml-72">
          <AdminNavbar />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Loader2
                    size={22}
                    className="animate-spin text-[#159669]"
                  />
                </div>

                <p className="mt-4 text-sm font-medium text-gray-600">
                  Loading user details...
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error state
  |--------------------------------------------------------------------------
  */

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="lg:ml-72">
          <AdminNavbar />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-gray-900"
              >
                <ArrowLeft size={15} />
                Back to users
              </Link>

              <div className="mt-6 flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <AlertCircle size={25} />
                </div>

                <h2 className="mt-4 font-semibold text-gray-900">
                  Unable to load user
                </h2>

                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  {error ||
                    "The requested user could not be found."}
                </p>

                <button
                  type="button"
                  onClick={fetchUser}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  <RefreshCw size={14} />
                  Try again
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const totalSpentFormatted =
    formatCurrency(
      bookingStats.totalSpent
    );

  const joinedDate = formatDate(
    user.createdAt
  );

  const lastActive = user.lastLogin
    ? formatRelativeTime(user.lastLogin)
    : "Never";

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="lg:ml-72">
        <AdminNavbar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Back */}
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-gray-900"
            >
              <ArrowLeft size={15} />
              Back to users
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <AdminPageHeader
                title="User details"
                description={`Manage and review ${fullName}'s TripGuard account.`}
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleStatusChange}
                  disabled={updatingStatus}
                  className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    user.isActive
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {updatingStatus ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : user.isActive ? (
                    <Ban size={14} />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}

                  {updatingStatus
                    ? "Updating..."
                    : user.isActive
                    ? "Suspend"
                    : "Activate"}
                </button>
              </div>
            </div>

            {/* Profile overview */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="h-28 bg-gray-900 sm:h-36" />

              <div className="px-5 pb-6 sm:px-6">
                <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#63E6BE]/10 text-2xl font-bold text-[#159669] shadow-sm sm:h-24 sm:w-24">
                      {getInitials(fullName)}
                    </div>

                    <div className="pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-bold text-gray-900">
                          {fullName}
                        </h1>

                        <UserStatus
                          status={userStatus}
                        />
                      </div>

                      <p className="mt-1 text-xs text-gray-400">
                        {user._id}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <UserTypeBadge
                      type={user.role}
                    />

                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-600">
                        <CheckCircle2 size={11} />
                        Verified account
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 text-[10px] font-semibold text-amber-600">
                        <Clock3 size={11} />
                        Verification pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <DetailStat
                icon={CalendarDays}
                label="Total bookings"
                value={
                  bookingStats.totalBookings
                }
                iconClass="bg-blue-50 text-blue-600"
              />

              <DetailStat
                icon={CheckCircle2}
                label="Completed"
                value={
                  bookingStats.completedBookings
                }
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <DetailStat
                icon={ShieldCheck}
                label="Protected trips"
                value={
                  bookingStats.safetyProtected
                }
                iconClass="bg-[#63E6BE]/10 text-[#159669]"
              />

              <DetailStat
                icon={Wallet}
                label="Total spent"
                value={totalSpentFormatted}
                iconClass="bg-violet-50 text-violet-600"
              />
            </div>

            {/* Main content */}
            <div className="grid gap-6 xl:grid-cols-3">
              {/* Left */}
              <div className="space-y-6 xl:col-span-2">
                {/* Account information */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Account information
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Personal and account details.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={UserRound}
                      label="Full name"
                      value={fullName}
                    />

                    <InfoItem
                      icon={Mail}
                      label="Email address"
                      value={user.email}
                    />

                    <InfoItem
                      icon={Phone}
                      label="Phone number"
                      value={
                        user.phone ||
                        "Not provided"
                      }
                    />

                    <InfoItem
                      icon={MapPin}
                      label="Location"
                      value="Not provided"
                    />

                    <InfoItem
                      icon={CalendarDays}
                      label="Joined"
                      value={joinedDate}
                    />

                    <InfoItem
                      icon={Clock3}
                      label="Last active"
                      value={lastActive}
                    />
                  </div>
                </section>

                {/* Booking history */}
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Booking history
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Recent bookings made by this user.
                      </p>
                    </div>

                    <Link
                      href="/admin/bookings"
                      className="text-xs font-semibold text-[#159669] hover:underline"
                    >
                      View all
                    </Link>
                  </div>

                  {bookingsLoading ? (
                    <div className="flex min-h-[220px] items-center justify-center">
                      <Loader2
                        size={20}
                        className="animate-spin text-[#159669]"
                      />
                    </div>
                  ) : userBookings.length === 0 ? (
                    <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                        <CalendarDays size={20} />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-gray-800">
                        No bookings yet
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        This user has not made any bookings.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop */}
                      <div className="hidden overflow-x-auto md:block">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/70">
                              <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                Accommodation
                              </th>

                              <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                Dates
                              </th>

                              <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                Amount
                              </th>

                              <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                Status
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-100">
                            {userBookings.map(
                              (booking) => (
                                <BookingTableRow
                                  key={booking._id}
                                  booking={booking}
                                />
                              )
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile */}
                      <div className="divide-y divide-gray-100 md:hidden">
                        {userBookings.map(
                          (booking) => (
                            <BookingMobileCard
                              key={booking._id}
                              booking={booking}
                            />
                          )
                        )}
                      </div>
                    </>
                  )}
                </section>

                {/* Safety activity */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Safety activity
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Recent TripGuard protection activity.
                      </p>
                    </div>

                    <Link
                      href="/admin/notifications"
                      className="text-xs font-semibold text-[#159669] hover:underline"
                    >
                      Notifications
                    </Link>
                  </div>

                  {safetyActivity.length === 0 ? (
                    <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center">
                      <ShieldCheck
                        size={22}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-2 text-xs font-semibold text-gray-600">
                        No safety activity
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        No TripGuard protection activity has been recorded for this user.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-5">
                      {safetyActivity.map(
                        (activity) => (
                          <div
                            key={activity.id}
                            className="flex gap-3"
                          >
                            <div
                              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                activity.type ===
                                "success"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              {activity.type ===
                              "success" ? (
                                <ShieldCheck
                                  size={15}
                                />
                              ) : (
                                <ShieldAlert
                                  size={15}
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-gray-800">
                                {activity.title}
                              </p>

                              <p className="mt-1 text-[11px] leading-5 text-gray-400">
                                {
                                  activity.description
                                }
                              </p>

                              <p className="mt-1.5 text-[10px] text-gray-400">
                                {formatDateTime(
                                  activity.date
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </section>
              </div>

              {/* Right */}
              <div className="space-y-6">
                {/* Account status */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="font-semibold text-gray-900">
                    Account status
                  </h2>

                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            user.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {user.isActive ? (
                            <CheckCircle2
                              size={16}
                            />
                          ) : (
                            <UserX size={16} />
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-800">
                            {user.isActive
                              ? "Active"
                              : "Inactive"}
                          </p>

                          <p className="mt-0.5 text-[10px] text-gray-400">
                            Account status
                          </p>
                        </div>
                      </div>

                      <UserStatus
                        status={userStatus}
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <StatusRow
                      label="Email verification"
                      value={
                        user.isVerified
                          ? "Verified"
                          : "Pending"
                      }
                      success={
                        user.isVerified
                      }
                    />

                    <StatusRow
                      label="Safety protection"
                      value={`${bookingStats.safetyProtected} trips`}
                      success={
                        bookingStats.safetyProtected >
                        0
                      }
                    />

                    <StatusRow
                      label="Safety notifications"
                      value={`${bookingStats.safetyNotifications}`}
                      success={
                        bookingStats.safetyNotifications >
                        0
                      }
                    />
                  </div>
                </section>

                {/* Verification */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <FileCheck2 size={18} />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        Identity verification
                      </h2>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Account verification status.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-5 rounded-xl p-4 ${
                      user.isVerified
                        ? "bg-emerald-50"
                        : "bg-amber-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      {user.isVerified ? (
                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />
                      ) : (
                        <Clock3
                          size={17}
                          className="mt-0.5 shrink-0 text-amber-600"
                        />
                      )}

                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            user.isVerified
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {user.isVerified
                            ? "Identity verified"
                            : "Verification pending"}
                        </p>

                        <p
                          className={`mt-1 text-[10px] leading-5 ${
                            user.isVerified
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }`}
                        >
                          {user.isVerified
                            ? "This user's account has passed the required verification checks."
                            : "This user has not completed the required verification process."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    <Eye size={14} />
                    Review verification
                  </button>
                </section>

                {/* Admin actions */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="font-semibold text-gray-900">
                    Admin actions
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Actions available for this account.
                  </p>

                  <div className="mt-5 space-y-2">
                    <AdminAction
                      icon={Mail}
                      label="Send email"
                      href={`mailto:${user.email}`}
                    />

                    <AdminAction
                      icon={Eye}
                      label="View public profile"
                    />

                    <AdminAction
                      icon={ShieldCheck}
                      label="View safety activity"
                      href="/admin/notifications"
                    />

                    <button
                      type="button"
                      onClick={handleStatusChange}
                      disabled={updatingStatus}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        user.isActive
                          ? "border-red-100 text-red-600 hover:bg-red-50"
                          : "border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {updatingStatus ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : user.isActive ? (
                        <Ban size={15} />
                      ) : (
                        <CheckCircle2 size={15} />
                      )}

                      {user.isActive
                        ? "Suspend account"
                        : "Reactivate account"}
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Booking table row
|--------------------------------------------------------------------------
*/

const BookingTableRow = ({
  booking,
}) => {
  const accommodation =
    booking?.accommodation;

  return (
    <tr className="transition hover:bg-gray-50">
      <td className="px-6 py-4">
        <p className="text-xs font-semibold text-gray-800">
          {accommodation?.name ||
            "Accommodation unavailable"}
        </p>

        <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
          <MapPin size={10} />

          {formatLocation(
            accommodation?.location
          )}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          {booking.bookingReference ||
            booking._id}
        </p>
      </td>

      <td className="px-6 py-4">
        <p className="text-xs font-medium text-gray-600">
          {formatDate(
            booking.checkInDate
          )}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          to{" "}
          {formatDate(
            booking.checkOutDate
          )}
        </p>
      </td>

      <td className="px-6 py-4 text-xs font-semibold text-gray-700">
        {formatCurrency(
          booking.totalAmount
        )}
      </td>

      <td className="px-6 py-4">
        <BookingStatus
          status={
            booking.bookingStatus
          }
        />
      </td>
    </tr>
  );
};

/*
|--------------------------------------------------------------------------
| Mobile booking card
|--------------------------------------------------------------------------
*/

const BookingMobileCard = ({
  booking,
}) => {
  const accommodation =
    booking?.accommodation;

  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-800">
            {accommodation?.name ||
              "Accommodation unavailable"}
          </p>

          <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
            <MapPin size={10} />

            {formatLocation(
              accommodation?.location
            )}
          </p>

          <p className="mt-1 text-[10px] text-gray-400">
            {booking.bookingReference ||
              booking._id}
          </p>
        </div>

        <BookingStatus
          status={booking.bookingStatus}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400">
            Dates
          </p>

          <p className="mt-1 text-xs font-medium text-gray-600">
            {formatDate(
              booking.checkInDate
            )}
          </p>

          <p className="text-[10px] text-gray-400">
            to{" "}
            {formatDate(
              booking.checkOutDate
            )}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400">
            Amount
          </p>

          <p className="mt-1 text-sm font-bold text-gray-800">
            {formatCurrency(
              booking.totalAmount
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Detail statistic
|--------------------------------------------------------------------------
*/

const DetailStat = ({
  icon: Icon,
  label,
  value,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={18} />
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 truncate text-xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Information item
|--------------------------------------------------------------------------
*/

const InfoItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
        <Icon size={15} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-semibold text-gray-700">
          {value}
        </p>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Status row
|--------------------------------------------------------------------------
*/

const StatusRow = ({
  label,
  value,
  success,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-gray-500">
        {label}
      </span>

      <span
        className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
          success
            ? "text-emerald-600"
            : "text-amber-600"
        }`}
      >
        {success && (
          <CheckCircle2 size={11} />
        )}

        {value}
      </span>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Admin action
|--------------------------------------------------------------------------
*/

const AdminAction = ({
  icon: Icon,
  label,
  href,
}) => {
  if (href) {
    return (
      <a
        href={href}
        className="flex w-full items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
      >
        <Icon size={15} />
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-left text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
    >
      <Icon size={15} />
      {label}
    </button>
  );
};

/*
|--------------------------------------------------------------------------
| User type badge
|--------------------------------------------------------------------------
*/

const UserTypeBadge = ({
  type,
}) => {
  const isOwner = type === "owner";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
        isOwner
          ? "bg-orange-50 text-orange-600"
          : "bg-blue-50 text-blue-600"
      }`}
    >
      {isOwner ? (
        <Building2 size={11} />
      ) : (
        <UserRound size={11} />
      )}

      {isOwner
        ? "Accommodation owner"
        : "Traveller"}
    </span>
  );
};

/*
|--------------------------------------------------------------------------
| User status
|--------------------------------------------------------------------------
*/

const UserStatus = ({
  status,
}) => {
  const config = {
    active: {
      label: "Active",
      className:
        "bg-emerald-50 text-emerald-600",
      icon: CheckCircle2,
    },

    inactive: {
      label: "Inactive",
      className:
        "bg-gray-100 text-gray-500",
      icon: Clock3,
    },
  };

  const current =
    config[status] ||
    config.inactive;

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${current.className}`}
    >
      <Icon size={11} />

      {current.label}
    </span>
  );
};

/*
|--------------------------------------------------------------------------
| Booking status
|--------------------------------------------------------------------------
*/

const BookingStatus = ({
  status,
}) => {
  const config = {
    pending: {
      label: "Pending",
      className:
        "bg-amber-50 text-amber-600",
      icon: Clock3,
    },

    confirmed: {
      label: "Confirmed",
      className:
        "bg-blue-50 text-blue-600",
      icon: CheckCircle2,
    },

    "checked-in": {
      label: "Checked in",
      className:
        "bg-[#63E6BE]/10 text-[#159669]",
      icon: ShieldCheck,
    },

    "checked-out": {
      label: "Checked out",
      className:
        "bg-violet-50 text-violet-600",
      icon: CheckCircle2,
    },

    completed: {
      label: "Completed",
      className:
        "bg-emerald-50 text-emerald-600",
      icon: CheckCircle2,
    },

    cancelled: {
      label: "Cancelled",
      className:
        "bg-red-50 text-red-600",
      icon: ShieldAlert,
    },
  };

  const current =
    config[status] ||
    config.pending;

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${current.className}`}
    >
      <Icon size={11} />

      {current.label}
    </span>
  );
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const getInitials = (name) => {
  if (!name) return "U";

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const capitalize = (value) => {
  if (!value) return "";

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }
  ).format(amount);
};

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(date);
};

const formatDateTime = (value) => {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date);
};

const formatRelativeTime = (value) => {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  const diff =
    Date.now() - date.getTime();

  const minutes = Math.floor(
    diff / (1000 * 60)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 30) {
    return `${days} ${
      days === 1
        ? "day"
        : "days"
    } ago`;
  }

  return formatDate(value);
};

const formatLocation = (
  location
) => {
  if (!location) {
    return "Location not provided";
  }

  if (typeof location === "string") {
    return location;
  }

  return [
    location.city,
    location.state,
  ]
    .filter(Boolean)
    .join(", ") ||
    location.address ||
    "Location not provided";
};

export default AdminUserDetailsPage;