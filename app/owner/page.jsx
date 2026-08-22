"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock3,
  DollarSign,
  Plus,
  Star,
  TrendingUp,
  Users,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import ProtectedRoute from "../../component/ProtectedRoute";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import API from "@/axios/index";
import { useState } from "react";

export default function OwnerPage() {

  const queryClient = useQueryClient();

  const [propertyToDelete, setPropertyToDelete] =
    useState(null);

  const [bookingToDelete, setBookingToDelete] =
  useState(null);

  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    isError: propertiesError,
  } = useQuery({
    queryKey: ["owner-properties"],
    queryFn: async () => {
      const response = await API.get(
        "/accommodations/owner/my-accommodations"
      );

      return response.data;
    },
  });

  const properties = propertiesData?.accommodations || [];

  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    isError: bookingsError,
  } = useQuery({
    queryKey: ["owner-bookings"],
    queryFn: async () => {
      const response = await API.get(
        "/bookings/owner/my-bookings"
      );

      return response.data;
    },
  });

  const bookings = bookingsData?.bookings || [];

  const activeProperties = properties.filter(
    (property) =>
      property.status === "approved" &&
      property.isAvailable
  ).length;

  const totalBookings = bookings.length;

  const now = new Date();

  const bookingsThisMonth = bookings.filter((booking) => {
    const date = new Date(booking.createdAt);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  const uniqueGuests = new Set(
    bookings
      .map((booking) => booking.guest?._id)
      .filter(Boolean)
  );

  const totalGuests = uniqueGuests.size;

  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["owner-dashboard"],
    queryFn: async () => {
      const response = await API.get("/owner/dashboard");
      return response.data;
    },
  });

  const statsData = dashboardData?.stats || {};
  const recentBookings = dashboardData?.recentBookings || [];

  const completedOrConfirmedBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed" ||
      booking.status === "completed"
  );



  const stats = [
    {
      title: "Properties",
      value: statsData.totalProperties ?? 0,
      description: `${activeProperties} currently active`,
      icon: Building2,
    },
    {
      title: "Total bookings",
      value: statsData.totalBookings ?? 0,
      description: `${statsData.pendingBookings ?? 0} pending`,
      icon: CalendarDays,
    },
    {
      title: "Confirmed bookings",
      value: statsData.confirmedBookings ?? 0,
      description: `${statsData.completedBookings ?? 0} completed`,
      icon: CircleCheck,
    },
    {
      title: "Total earnings",
      value: `₦${Number(
        statsData.totalEarnings ?? 0
      ).toLocaleString()}`,
      description: "From paid bookings",
      icon: DollarSign,
    },
  ];

  const formatBooking = (booking) => {
    const guestName = booking.guest
      ? `${booking.guest.firstName || ""} ${booking.guest.lastName || ""}`.trim()
      : "Guest";

    const initials = booking.guest
      ? `${booking.guest.firstName?.[0] || ""}${booking.guest.lastName?.[0] || ""}`.toUpperCase()
      : "G";

    const propertyName =
      booking.accommodation?.name || "Accommodation";

    const checkIn = new Date(
      booking.checkInDate
    ).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
    });

    const checkOut = new Date(
      booking.checkOutDate
    ).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
    });

    const amount = `₦${Number(
      booking.accommodationAmount || 0
    ).toLocaleString()}`;

    let status = "Pending";

    if (booking.bookingStatus === "confirmed") {
      status = "Confirmed";
    } else if (booking.bookingStatus === "completed") {
      status = "Completed";
    } else if (booking.bookingStatus === "cancelled") {
      status = "Cancelled";
    } else if (booking.bookingStatus === "checked-in") {
      status = "Checked in";
    } else if (booking.bookingStatus === "checked-out") {
      status = "Checked out";
    }

    return {
      ...booking,
      guestName,
      initials,
      propertyName,
      dates: `${checkIn} – ${checkOut}`,
      amount,
      status,
    };
  };

  const formattedRecentBookings = recentBookings.map(
    formatBooking
  );

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId) => {
      const response = await API.delete(
        `/accommodations/${propertyId}`
      );

      return response.data;
    },

    onSuccess: () => {
      // Refresh properties
      queryClient.invalidateQueries({
        queryKey: ["owner-properties"],
      });

      // Refresh dashboard statistics
      queryClient.invalidateQueries({
        queryKey: ["owner-dashboard"],
      });

      // Close confirmation modal
      setPropertyToDelete(null);
    },

    onError: (error) => {
      console.error(
        "Delete property error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to delete property. Please try again."
      );
    },
  });

  const handleDeleteProperty = () => {
    if (!propertyToDelete?._id) {
      return;
    }

    deletePropertyMutation.mutate(
      propertyToDelete._id
    );
  };

  const cancelBookingMutation = useMutation({
  mutationFn: async (bookingId) => {
    const response = await API.put(
      `/bookings/${bookingId}/cancel`,
      {
        cancellationReason:
          "Booking cancelled by the property owner",
      }
    );

    return response.data;
  },

  onSuccess: () => {
    // Refresh owner bookings
    queryClient.invalidateQueries({
      queryKey: ["owner-bookings"],
    });

    // Refresh dashboard statistics
    queryClient.invalidateQueries({
      queryKey: ["owner-dashboard"],
    });

    // Close modal
    setBookingToDelete(null);
  },

  onError: (error) => {
    console.error(
      "Cancel booking error:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Unable to cancel booking. Please try again."
    );
  },
});

const handleCancelBooking = () => {
  if (!bookingToDelete?._id) {
    return;
  }

  cancelBookingMutation.mutate(
    bookingToDelete._id
  );
};



  return (

    <ProtectedRoute allowedRole="owner">
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center bg-[#F7F7F2]">
          <p className="text-sm text-[#7A8581]">
            Loading your dashboard...
          </p>
        </div>
      ) : isError ? (
        <div className="flex min-h-screen items-center justify-center bg-[#F7F7F2]">
          <div className="text-center">
            <p className="text-sm text-red-600">
              Unable to load your dashboard.
            </p>

            <p className="mt-2 text-xs text-[#7A8581]">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      ) : (
        <main>
          {/* your existing dashboard */}
        </main>
      )}
      <main className="min-h-screen bg-[#F7F7F2] text-[#172322]">
        {/* PAGE HEADER */}
        <section className="border-b border-[#E4E3DC] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397A69]">
                  Owner dashboard
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Welcome back
                </h1>

                <p className="mt-2 text-sm text-[#75817D]">
                  Here's what's happening with your properties.
                </p>
              </div>

              <Link
                href="/owner/properties/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173C37] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#23584E]"
              >
                <Plus className="h-4 w-4" />
                Add property
              </Link>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          {/* STAT CARDS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-[22px] border border-[#E3E3DC] bg-white p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#75817D]">
                        {stat.title}
                      </p>

                      <p className="mt-2 text-2xl font-bold text-[#173C37]">
                        {stat.value}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E1F5ED]">
                      <Icon className="h-5 w-5 text-[#277765]" />
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-[#7A8581]">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* OVERVIEW GRID */}
          <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              {/* MY PROPERTIES */}
              <div className="rounded-[26px] border border-[#E3E3DC] bg-white">
                <div className="flex items-center justify-between border-b border-[#ECEBE5] px-6 py-5">
                  <div>
                    <h2 className="text-xl font-semibold">
                      My properties
                    </h2>

                    <p className="mt-1 text-sm text-[#7A8581]">
                      Manage your accommodation listings.
                    </p>
                  </div>

                  <Link
                    href="/owner/properties"
                    className="hidden items-center gap-1 text-sm font-semibold text-[#397A69] transition hover:text-[#173C37] sm:flex"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="divide-y divide-[#ECEBE5]">
                  {properties.map((property) => (
                    <div
                      key={property._id}
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-[#E8ECE9]">
                          <img
                            src={property.images?.[0]}
                            alt={property.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold">
                              {property.name}
                            </h3>

                            {property.status === "approved" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#E1F5ED] px-2.5 py-1 text-[10px] font-bold text-[#277765]">
                                <CircleCheck className="h-3 w-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4D6] px-2.5 py-1 text-[10px] font-bold text-[#967126]">
                                <Clock3 className="h-3 w-3" />
                                Pending
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-[#7A8581]">
                            {[
                              property.location?.city,
                              property.location?.state,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>

                          <div className="mt-2 flex items-center gap-4 text-xs text-[#7A8581]">
                            <span>
                              {
                                bookings.filter(
                                  (booking) =>
                                    booking.accommodation?._id === property._id
                                ).length
                              }{" "}
                              bookings
                            </span>

                            {property.averageRating !== "—" && (
                              <span className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-[#F3C95D] text-[#F3C95D]" />
                                {property.averageRating}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">

  <Link
    href="/owner/properties"
    className="flex items-center justify-center gap-1 rounded-xl border border-[#DCE2DF] px-4 py-2.5 text-xs font-semibold text-[#173C37] transition hover:border-[#173C37] hover:bg-[#F7F8F4]"
  >
    Manage
    <ChevronRight className="h-4 w-4" />
  </Link>

  <button
    type="button"
    onClick={() => setPropertyToDelete(property)}
    className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:border-red-300 hover:bg-red-50"
    title={`Delete ${property.name}`}
    aria-label={`Delete ${property.name}`}
  >
    <Trash2 className="h-4 w-4" />
  </button>

</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#ECEBE5] p-4 sm:hidden">
                  <Link
                    href="/owner/properties"
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#DCE2DF] py-3 text-sm font-semibold text-[#173C37]"
                  >
                    View all properties
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* RECENT BOOKINGS */}
              <div className="rounded-[26px] border border-[#E3E3DC] bg-white">
                <div className="flex items-center justify-between border-b border-[#ECEBE5] px-6 py-5">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Recent bookings
                    </h2>

                    <p className="mt-1 text-sm text-[#7A8581]">
                      Your latest reservations.
                    </p>
                  </div>

                  <Link
                    href="/owner/bookings"
                    className="hidden items-center gap-1 text-sm font-semibold text-[#397A69] transition hover:text-[#173C37] sm:flex"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="divide-y divide-[#ECEBE5]">
                  {formattedRecentBookings.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <CalendarDays className="mx-auto h-8 w-8 text-[#A7B0AC]" />

                      <p className="mt-3 text-sm font-medium text-[#596661]">
                        No bookings yet
                      </p>

                      <p className="mt-1 text-xs text-[#8A9390]">
                        Your latest reservations will appear here.
                      </p>
                    </div>
                  ) : (
                    formattedRecentBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#173C37] text-xs font-bold text-[#63E6BE]">
                            {booking.initials}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {booking.guestName}
                            </p>

                            <p className="mt-1 truncate text-xs text-[#7A8581]">
                              {booking.propertyName}
                            </p>
                          </div>
                        </div>

                       <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:flex sm:items-center">
  <div>
    <p className="text-[#9AA29F]">
      Stay
    </p>

    <p className="mt-1 font-medium text-[#596661]">
      {booking.dates}
    </p>
  </div>

  <div>
    <p className="text-[#9AA29F]">
      Amount
    </p>

    <p className="mt-1 font-semibold text-[#173C37]">
      {booking.amount}
    </p>
  </div>

  <span
    className={`col-span-2 inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold sm:col-span-1 ${
      booking.bookingStatus === "confirmed" ||
      booking.bookingStatus === "completed" ||
      booking.bookingStatus === "checked-in" ||
      booking.bookingStatus === "checked-out"
        ? "bg-[#E1F5ED] text-[#277765]"
        : booking.bookingStatus === "cancelled"
          ? "bg-red-50 text-red-600"
          : "bg-[#FFF4D6] text-[#967126]"
    }`}
  >
    {booking.status}
  </span>

  {/* CANCEL PENDING BOOKING */}
  {booking.bookingStatus === "pending" && (
    <button
      type="button"
      onClick={() =>
        setBookingToDelete(booking)
      }
      className="col-span-2 inline-flex w-fit items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-[10px] font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50 sm:col-span-1"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Cancel booking
    </button>
  )}
</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <aside className="space-y-8">
              {/* PERFORMANCE */}
              <div className="rounded-[26px] bg-[#173C37] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#63E6BE]">
                      Performance
                    </p>

                    <h2 className="mt-2 text-xl font-semibold">
                      This month
                    </h2>
                  </div>

                  <TrendingUp className="h-5 w-5 text-[#63E6BE]" />
                </div>

                <div className="mt-7">
                  <p className="text-3xl font-bold">
                    ₦{Number(
                      statsData.totalEarnings ?? 0
                    ).toLocaleString()}
                  </p>

                  <p className="mt-1 text-sm text-white/55">
                    Total earnings
                  </p>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-[#63E6BE]" />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-white/55">
                    Compared to last month
                  </span>

                  <span className="font-semibold text-[#63E6BE]">
                    +18.4%
                  </span>
                </div>

                <Link
                  href="/owner/bookings"
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  View earnings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* SUBSCRIPTION */}
              {/* <div className="rounded-[26px] border border-[#DCE6E2] bg-[#F0F7F4] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397A69]">
                  Your plan
                </p>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[#173C37]">
                      Free plan
                    </h2>

                    <p className="mt-1 text-xs text-[#75817D]">
                      Perfect for getting started
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#277765]">
                    ACTIVE
                  </span>
                </div>

                <div className="mt-5 border-t border-[#D9E5E0] pt-5">
                  <div className="flex items-center gap-2 text-sm text-[#596661]">
                    <CircleCheck className="h-4 w-4 text-[#397A69]" />
                    List your properties
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-[#596661]">
                    <CircleCheck className="h-4 w-4 text-[#397A69]" />
                    Receive bookings
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-[#596661]">
                    <CircleCheck className="h-4 w-4 text-[#397A69]" />
                    Manage your listings
                  </div>
                </div>

                <Link
                  href="/owner/subscription"
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#397A69] bg-white py-3 text-sm font-semibold text-[#277765] transition hover:bg-[#173C37] hover:text-white"
                >
                  Manage subscription
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div> */}

              {/* QUICK ACTIONS */}
              <div className="rounded-[26px] border border-[#E3E3DC] bg-white p-6">
                <h2 className="text-lg font-semibold">
                  Quick actions
                </h2>

                <div className="mt-4 space-y-2">
                  <Link
                    href="/owner/properties/new"
                    className="flex items-center justify-between rounded-xl bg-[#F4F6F2] px-4 py-3.5 text-sm font-medium text-[#173C37] transition hover:bg-[#E8EEE9]"
                  >
                    <span className="flex items-center gap-3">
                      <Plus className="h-4 w-4 text-[#397A69]" />
                      Add a property
                    </span>

                    <ChevronRight className="h-4 w-4 text-[#8A9390]" />
                  </Link>

                  <Link
                    href="/owner/bookings"
                    className="flex items-center justify-between rounded-xl bg-[#F4F6F2] px-4 py-3.5 text-sm font-medium text-[#173C37] transition hover:bg-[#E8EEE9]"
                  >
                    <span className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-[#397A69]" />
                      View bookings
                    </span>

                    <ChevronRight className="h-4 w-4 text-[#8A9390]" />
                  </Link>

                  <Link
                    href="/owner/reviews"
                    className="flex items-center justify-between rounded-xl bg-[#F4F6F2] px-4 py-3.5 text-sm font-medium text-[#173C37] transition hover:bg-[#E8EEE9]"
                  >
                    <span className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-[#397A69]" />
                      View reviews
                    </span>

                    <ChevronRight className="h-4 w-4 text-[#8A9390]" />
                  </Link>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
            {/* DELETE PROPERTY MODAL */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">

          <div className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-2xl">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>

              <button
                type="button"
                onClick={() => setPropertyToDelete(null)}
                disabled={
                  deletePropertyMutation.isPending
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#7A8581] transition hover:bg-[#F4F5F2] hover:text-[#173C37]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* CONTENT */}
            <div className="mt-5">

              <h2 className="text-xl font-semibold text-[#173C37]">
                Delete property?
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#697570]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#173C37]">
                  {propertyToDelete.name}
                </span>
                ?
              </p>

              <p className="mt-2 text-sm leading-6 text-[#8A9390]">
                This action cannot be undone. The property
                will be removed from your listings.
              </p>

            </div>

            {/* ACTIONS */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setPropertyToDelete(null)
                }
                disabled={
                  deletePropertyMutation.isPending
                }
                className="rounded-xl border border-[#DCE2DF] px-5 py-3 text-sm font-semibold text-[#173C37] transition hover:bg-[#F7F8F4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProperty}
                disabled={
                  deletePropertyMutation.isPending
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {deletePropertyMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete property
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

      {/* CANCEL BOOKING MODAL */}
{bookingToDelete && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
    <div className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-2xl">

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>

        <button
          type="button"
          onClick={() => setBookingToDelete(null)}
          disabled={cancelBookingMutation.isPending}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#7A8581] transition hover:bg-[#F4F5F2] hover:text-[#173C37]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

      </div>

      {/* CONTENT */}
      <div className="mt-5">

        <h2 className="text-xl font-semibold text-[#173C37]">
          Cancel booking?
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#697570]">
          Are you sure you want to cancel the booking for{" "}
          <span className="font-semibold text-[#173C37]">
            {bookingToDelete.guest
              ? `${bookingToDelete.guest.firstName || ""} ${
                  bookingToDelete.guest.lastName || ""
                }`.trim()
              : "this guest"}
          </span>
          ?
        </p>

        <p className="mt-2 text-sm leading-6 text-[#8A9390]">
          This will cancel the reservation for{" "}
          <span className="font-medium">
            {bookingToDelete.accommodation?.name ||
              "this property"}
          </span>
          .
        </p>

        <div className="mt-4 rounded-xl bg-[#F7F8F4] p-4">

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8A9390]">
              Check-in
            </span>

            <span className="font-semibold text-[#596661]">
              {new Date(
                bookingToDelete.checkInDate
              ).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#8A9390]">
              Check-out
            </span>

            <span className="font-semibold text-[#596661]">
              {new Date(
                bookingToDelete.checkOutDate
              ).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

        </div>

        <p className="mt-4 text-xs leading-5 text-[#8A9390]">
          The guest will be notified that the booking has
          been cancelled.
        </p>

      </div>

      {/* ACTIONS */}
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() => setBookingToDelete(null)}
          disabled={cancelBookingMutation.isPending}
          className="rounded-xl border border-[#DCE2DF] px-5 py-3 text-sm font-semibold text-[#173C37] transition hover:bg-[#F7F8F4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Keep booking
        </button>

        <button
          type="button"
          onClick={handleCancelBooking}
          disabled={cancelBookingMutation.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cancelBookingMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Cancel booking
            </>
          )}
        </button>

      </div>

    </div>
  </div>
)}
    </ProtectedRoute>
  );
}


