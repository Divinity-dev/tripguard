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
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    type: "trip",
    title: "Booking confirmed",
    message:
      "Your booking at The Meridian House has been confirmed.",
    time: "2 days ago",
    read: false,
    icon: <CheckCircle2 size={19} />,
  },
  {
    id: 2,
    type: "safety",
    title: "TripGuard Protection is active",
    message:
      "Your safety contact, Sarah Johnson, will receive updates about your trip.",
    time: "2 days ago",
    read: false,
    icon: <ShieldCheck size={19} />,
  },
  {
    id: 3,
    type: "payment",
    title: "Payment successful",
    message:
      "Your payment of ₦185,000 for The Meridian House was successful.",
    time: "2 days ago",
    read: false,
    icon: <CreditCard size={19} />,
  },
  {
    id: 4,
    type: "trip",
    title: "Your trip is coming up",
    message:
      "Your stay at The Meridian House starts on August 15, 2026.",
    time: "1 day ago",
    read: true,
    icon: <LogIn size={19} />,
  },
  {
    id: 5,
    type: "safety",
    title: "Remember to check in",
    message:
      "Check in when you arrive at your accommodation to activate your TripGuard stay status.",
    time: "12 hours ago",
    read: true,
    icon: <ShieldCheck size={19} />,
  },
  {
    id: 6,
    type: "trip",
    title: "Booking reminder",
    message:
      "Your check-in time at The Meridian House is 2:00 PM.",
    time: "8 hours ago",
    read: true,
    icon: <Bell size={19} />,
  },
  {
    id: 7,
    type: "payment",
    title: "Receipt available",
    message:
      "Your receipt for booking TG-2026-00124 is now available.",
    time: "5 hours ago",
    read: true,
    icon: <CreditCard size={19} />,
  },
  {
    id: 8,
    type: "safety",
    title: "TripGuard keeps your loved ones informed",
    message:
      "Remember to check out when your stay ends so your safety contact receives your final trip update.",
    time: "3 hours ago",
    read: true,
    icon: <LogOut size={19} />,
  },
];

const TravellerNotificationsPage = () => {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const [activeFilter, setActiveFilter] = useState("all");

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = notifications.filter(
    (notification) => {
      if (activeFilter === "all") return true;

      return notification.type === activeFilter;
    }
  );

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

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
                Stay updated about your bookings, payments and
                TripGuard safety protection.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <CheckCheck size={17} />
                Mark all as read
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
                  (notification) => notification.type === "trip"
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

        {/* Notification Summary */}
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-red-500"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          )}
        </div>

        {/* Notifications */}
        {filteredNotifications.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {filteredNotifications.map((notification, index) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                isLast={
                  index === filteredNotifications.length - 1
                }
                onRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        ) : (
          <EmptyNotifications
            hasNotifications={notifications.length > 0}
            onReset={() => setActiveFilter("all")}
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
                TripGuard notifications help you keep track of your
                booking and safety status. Always remember to check
                in when you arrive and check out when you leave.
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

const FilterButton = ({
  label,
  value,
  activeFilter,
  onClick,
  count,
}) => {
  const isActive = activeFilter === value;

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

const NotificationItem = ({
  notification,
  isLast,
  onRead,
  onDelete,
}) => {
  const getIconBackground = () => {
    if (notification.type === "safety") {
      return "bg-[#16a765]/10 text-[#16a765]";
    }

    if (notification.type === "payment") {
      return "bg-blue-50 text-blue-600";
    }

    return "bg-purple-50 text-purple-600";
  };

  return (
    <div
      className={`group relative flex gap-4 p-5 transition sm:p-6 ${
        !notification.read ? "bg-[#16a765]/[0.025]" : "bg-white"
      } ${!isLast ? "border-b border-gray-100" : ""}`}
    >
      {/* Unread Indicator */}
      {!notification.read && (
        <span className="absolute left-2 top-7 h-2 w-2 rounded-full bg-[#16a765]" />
      )}

      {/* Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getIconBackground()}`}
      >
        {notification.icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3
              className={`text-sm ${
                notification.read
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
            {notification.time}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-4">
          {!notification.read && (
            <button
              type="button"
              onClick={() => onRead(notification.id)}
              className="text-xs font-semibold text-[#16a765] hover:underline"
            >
              Mark as read
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(notification.id)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 transition hover:text-red-500"
          >
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

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

export default TravellerNotificationsPage;