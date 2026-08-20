"use client";

import {
  Bell,
  CheckCircle2,
  CheckCheck,
  CreditCard,
  Info,
  LogIn,
  LogOut,
  ShieldCheck,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TravellerNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  const [activeFilter, setActiveFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [markingAll, setMarkingAll] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const [processingId, setProcessingId] = useState(null);

  /*
   * ==================================================
   * FETCH NOTIFICATIONS
   * ==================================================
   */

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      if (!API_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured"
        );
      }

      const response = await fetch(
        `${API_URL}/notifications`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log(
        "Notifications response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to retrieve notifications."
        );
      }

      setNotifications(
        data.notifications || []
      );
    } catch (error) {
      console.error(
        "Fetch notifications error:",
        error
      );

      setError(
        error.message ||
          "Unable to retrieve notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /*
   * ==================================================
   * UNREAD COUNT
   * ==================================================
   */

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  /*
   * ==================================================
   * FILTER NOTIFICATIONS
   * ==================================================
   */

  const filteredNotifications =
    notifications.filter((notification) => {
      if (activeFilter === "all") {
        return true;
      }

      return (
        notification.type === activeFilter
      );
    });

  /*
   * ==================================================
   * MARK NOTIFICATION AS READ
   * ==================================================
   */

  const markAsRead = async (id) => {
    try {
      setProcessingId(id);

      const response = await fetch(
        `${API_URL}/notifications/${id}/read`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to mark notification as read."
        );
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error
      );

      alert(
        error.message ||
          "Unable to mark notification as read."
      );
    } finally {
      setProcessingId(null);
    }
  };

  /*
   * ==================================================
   * MARK ALL AS READ
   * ==================================================
   */

  const markAllAsRead = async () => {
    try {
      setMarkingAll(true);

      const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to mark notifications as read."
        );
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );

      alert(
        error.message ||
          "Unable to mark notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  /*
   * ==================================================
   * DELETE NOTIFICATION
   * ==================================================
   */

  const deleteNotification = async (id) => {
    try {
      setProcessingId(id);

      const response = await fetch(
        `${API_URL}/notifications/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete notification."
        );
      }

      setNotifications((current) =>
        current.filter(
          (notification) =>
            notification._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete notification."
      );
    } finally {
      setProcessingId(null);
    }
  };

  /*
   * ==================================================
   * DELETE ALL NOTIFICATIONS
   * ==================================================
   */

  const clearAllNotifications = async () => {
    try {
      setDeletingAll(true);

      const response = await fetch(
        `${API_URL}/notifications/clear-all`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to clear notifications."
        );
      }

      setNotifications([]);
    } catch (error) {
      console.error(
        "Clear notifications error:",
        error
      );

      alert(
        error.message ||
          "Unable to clear notifications."
      );
    } finally {
      setDeletingAll(false);
    }
  };

  /*
   * ==================================================
   * LOADING STATE
   * ==================================================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
                <Bell size={22} />
              </div>

              <div>
                <p className="text-sm font-medium text-[#16a765]">
                  Traveller Dashboard
                </p>

                <h1 className="mt-0.5 text-2xl font-bold tracking-tight sm:text-3xl">
                  Notifications
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Stay updated about your bookings,
              payments and TripGuard safety
              protection.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#16a765]/10">
              <Loader2
                size={22}
                className="animate-spin text-[#16a765]"
              />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Loading your notifications...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ==================================================
   * ERROR STATE
   * ==================================================
   */

  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-[#16a765]">
              Traveller Dashboard
            </p>

            <h1 className="mt-0.5 text-2xl font-bold tracking-tight sm:text-3xl">
              Notifications
            </h1>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchNotifications}
              className="mt-5 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ==================================================
   * MAIN UI
   * ==================================================
   */

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-gray-900">
      {/* Header */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#16a765]/10 text-[#16a765]">
                  <Bell size={22} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-[#16a765]">
                    Traveller Dashboard
                  </p>

                  <h1 className="mt-0.5 text-2xl font-bold tracking-tight sm:text-3xl">
                    Notifications
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Stay updated about your bookings,
                payments and TripGuard safety
                protection.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={markingAll}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {markingAll ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCheck size={17} />
                )}

                {markingAll
                  ? "Marking..."
                  : "Mark all as read"}
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}

        <div className="overflow-x-auto">
          <div className="flex min-w-max items-center gap-2 rounded-xl border border-gray-200 bg-white p-1.5">
            <FilterButton
              label="All"
              value="all"
              activeFilter={activeFilter}
              onClick={setActiveFilter}
              count={notifications.length}
            />

            <FilterButton
              label="Trips"
              value="trip"
              activeFilter={activeFilter}
              onClick={setActiveFilter}
              count={
                notifications.filter(
                  (notification) =>
                    notification.type === "trip"
                ).length
              }
            />

            <FilterButton
              label="Safety"
              value="safety"
              activeFilter={activeFilter}
              onClick={setActiveFilter}
              count={
                notifications.filter(
                  (notification) =>
                    notification.type === "safety"
                ).length
              }
            />

            <FilterButton
              label="Payments"
              value="payment"
              activeFilter={activeFilter}
              onClick={setActiveFilter}
              count={
                notifications.filter(
                  (notification) =>
                    notification.type === "payment"
                ).length
              }
            />
          </div>
        </div>

        {/* Summary */}

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">
              {activeFilter === "all"
                ? "All notifications"
                : activeFilter === "trip"
                ? "Trip notifications"
                : activeFilter === "safety"
                ? "Safety notifications"
                : "Payment notifications"}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {filteredNotifications.length}{" "}
              {filteredNotifications.length === 1
                ? "notification"
                : "notifications"}
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAllNotifications}
              disabled={deletingAll}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletingAll ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={14} />
              )}

              {deletingAll
                ? "Clearing..."
                : "Clear all"}
            </button>
          )}
        </div>

        {/* Notifications */}

        {filteredNotifications.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {filteredNotifications.map(
              (notification, index) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  isLast={
                    index ===
                    filteredNotifications.length - 1
                  }
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                  processingId={processingId}
                />
              )
            )}
          </div>
        ) : (
          <EmptyNotifications
            hasNotifications={
              notifications.length > 0
            }
            onReset={() =>
              setActiveFilter("all")
            }
          />
        )}

        {/* Safety Reminder */}

        <section className="mt-8 rounded-2xl border border-[#16a765]/20 bg-[#16a765]/5 p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16a765]/10 text-[#16a765]">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="text-sm font-bold">
                Your safety matters
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">
                TripGuard notifications help you
                keep track of your booking and safety
                status. Always remember to check in
                when you arrive and check out when you
                leave.
              </p>

              <Link
                href="/dashboard/traveller/profile"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#16a765] hover:underline"
              >
                Manage safety settings
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

/*
 * ==================================================
 * FILTER BUTTON
 * ==================================================
 */

const FilterButton = ({
  label,
  value,
  activeFilter,
  onClick,
  count,
}) => {
  const isActive =
    activeFilter === value;

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
        isActive
          ? "bg-[#16a765] text-white"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {label}

      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
          isActive
            ? "bg-white/20 text-white"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
};

/*
 * ==================================================
 * NOTIFICATION ITEM
 * ==================================================
 */

const NotificationItem = ({
  notification,
  isLast,
  onRead,
  onDelete,
  processingId,
}) => {
  const getIcon = () => {
    if (notification.type === "safety") {
      return <ShieldCheck size={19} />;
    }

    if (notification.type === "payment") {
      return <CreditCard size={19} />;
    }

    if (
      notification.type === "check-in"
    ) {
      return <LogIn size={19} />;
    }

    if (
      notification.type === "check-out"
    ) {
      return <LogOut size={19} />;
    }

    return <CheckCircle2 size={19} />;
  };

  const getIconBackground = () => {
    if (notification.type === "safety") {
      return "bg-[#16a765]/10 text-[#16a765]";
    }

    if (notification.type === "payment") {
      return "bg-blue-50 text-blue-600";
    }

    return "bg-purple-50 text-purple-600";
  };

  const isProcessing =
    processingId === notification._id;

  return (
    <div
      className={`group relative flex gap-4 p-5 transition sm:p-6 ${
        !notification.isRead
          ? "bg-[#16a765]/[0.025]"
          : "bg-white"
      } ${
        !isLast
          ? "border-b border-gray-100"
          : ""
      }`}
    >
      {/* Unread Indicator */}

      {!notification.isRead && (
        <span className="absolute left-2 top-7 h-2 w-2 rounded-full bg-[#16a765]" />
      )}

      {/* Icon */}

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getIconBackground()}`}
      >
        {getIcon()}
      </div>

      {/* Content */}

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3
              className={`text-sm ${
                notification.isRead
                  ? "font-semibold text-gray-800"
                  : "font-bold text-gray-900"
              }`}
            >
              {notification.title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              {notification.message}
            </p>
          </div>

          <span className="shrink-0 text-[11px] text-gray-400">
            {formatNotificationTime(
              notification.createdAt
            )}
          </span>
        </div>

        {/* Actions */}

        <div className="mt-4 flex items-center gap-4">
          {!notification.isRead && (
            <button
              type="button"
              onClick={() =>
                onRead(notification._id)
              }
              disabled={isProcessing}
              className="text-xs font-semibold text-[#16a765] hover:underline disabled:opacity-50"
            >
              {isProcessing
                ? "Updating..."
                : "Mark as read"}
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              onDelete(notification._id)
            }
            disabled={isProcessing}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 transition hover:text-red-500 disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2
                size={13}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={13} />
            )}

            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

/*
 * ==================================================
 * EMPTY STATE
 * ==================================================
 */

const EmptyNotifications = ({
  hasNotifications,
  onReset,
}) => {
  return (
    <section className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        {hasNotifications ? (
          <Info size={26} />
        ) : (
          <Bell size={26} />
        )}
      </div>

      <h2 className="mt-5 text-lg font-bold">
        {hasNotifications
          ? "No notifications in this category"
          : "You're all caught up"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasNotifications
          ? "There are no notifications matching this filter."
          : "You don't have any notifications right now. We'll let you know when something important happens."}
      </p>

      {hasNotifications && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a765] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#128c55]"
        >
          View all notifications
        </button>
      )}
    </section>
  );
};

/*
 * ==================================================
 * FORMAT NOTIFICATION TIME
 * ==================================================
 */

function formatNotificationTime(date) {
  if (!date) {
    return "";
  }

  const notificationDate =
    new Date(date);

  const now = new Date();

  const difference =
    now.getTime() -
    notificationDate.getTime();

  const seconds = Math.floor(
    difference / 1000
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days} ${
      days === 1 ? "day" : "days"
    } ago`;
  }

  return notificationDate.toLocaleDateString(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

export default TravellerNotificationsPage;