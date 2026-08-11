"use client";

import { useMemo, useState } from "react";
import {
    Bell,
    BellRing,
    CalendarCheck,
    Check,
    CheckCheck,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    CreditCard,
    Filter,
    Info,
    Mail,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";

const notifications = [
    {
        id: 1,
        type: "booking",
        title: "New booking received",
        message:
            "A new booking has been made for The Meridian House by Daniel Okafor.",
        time: "5 minutes ago",
        date: "August 11, 2026",
        read: false,
        priority: "normal",
        bookingId: "TG-10284",
    },
    {
        id: 2,
        type: "safety",
        title: "Safety notification sent",
        message:
            "The booking confirmation and safety details have been sent to Sarah Okafor.",
        time: "18 minutes ago",
        date: "August 11, 2026",
        read: false,
        priority: "high",
        bookingId: "TG-10284",
    },
    {
        id: 3,
        type: "payment",
        title: "Payment received",
        message:
            "A payment of ₦185,000 was successfully received for booking TG-10284.",
        time: "25 minutes ago",
        date: "August 11, 2026",
        read: true,
        priority: "normal",
        bookingId: "TG-10284",
    },
    {
        id: 4,
        type: "user",
        title: "New user registration",
        message:
            "A new traveller account has been created on TripGuard.",
        time: "42 minutes ago",
        date: "August 11, 2026",
        read: true,
        priority: "normal",
    },
    {
        id: 5,
        type: "booking",
        title: "Booking requires attention",
        message:
            "Booking TG-10283 is still awaiting confirmation from the accommodation.",
        time: "1 hour ago",
        date: "August 11, 2026",
        read: false,
        priority: "high",
        bookingId: "TG-10283",
    },
    {
        id: 6,
        type: "system",
        title: "System update completed",
        message:
            "TripGuard's scheduled system maintenance was completed successfully.",
        time: "3 hours ago",
        date: "August 11, 2026",
        read: true,
        priority: "normal",
    },
    {
        id: 7,
        type: "safety",
        title: "Check-in notification scheduled",
        message:
            "A safety notification has been scheduled for Daniel Okafor's check-in.",
        time: "4 hours ago",
        date: "August 11, 2026",
        read: true,
        priority: "normal",
        bookingId: "TG-10284",
    },
    {
        id: 8,
        type: "payment",
        title: "Payment verification required",
        message:
            "A payment transaction requires manual verification before the booking can be confirmed.",
        time: "Yesterday",
        date: "August 10, 2026",
        read: false,
        priority: "high",
        bookingId: "TG-10280",
    },
    {
        id: 9,
        type: "user",
        title: "New accommodation owner",
        message:
            "A new accommodation owner has registered and submitted a property for review.",
        time: "Yesterday",
        date: "August 10, 2026",
        read: true,
        priority: "normal",
    },
    {
        id: 10,
        type: "booking",
        title: "Booking cancelled",
        message:
            "Booking TG-10281 has been cancelled by the guest.",
        time: "Yesterday",
        date: "August 10, 2026",
        read: true,
        priority: "normal",
        bookingId: "TG-10281",
    },
    {
        id: 11,
        type: "safety",
        title: "Check-out notification delivered",
        message:
            "The scheduled check-out safety notification was successfully delivered.",
        time: "2 days ago",
        date: "August 9, 2026",
        read: true,
        priority: "normal",
        bookingId: "TG-10280",
    },
    {
        id: 12,
        type: "system",
        title: "Email delivery issue",
        message:
            "One notification email could not be delivered to the intended recipient.",
        time: "2 days ago",
        date: "August 9, 2026",
        read: false,
        priority: "high",
    },
];

const ITEMS_PER_PAGE = 7;

const notificationTypes = [
    {
        value: "all",
        label: "All notifications",
    },
    {
        value: "booking",
        label: "Bookings",
    },
    {
        value: "safety",
        label: "Safety",
    },
    {
        value: "payment",
        label: "Payments",
    },
    {
        value: "user",
        label: "Users",
    },
    {
        value: "system",
        label: "System",
    },
];

const iconConfig = {
    booking: {
        icon: CalendarCheck,
        className: "bg-blue-50 text-blue-600",
    },
    safety: {
        icon: ShieldCheck,
        className: "bg-emerald-50 text-emerald-600",
    },
    payment: {
        icon: CreditCard,
        className: "bg-violet-50 text-violet-600",
    },
    user: {
        icon: UserRound,
        className: "bg-orange-50 text-orange-600",
    },
    system: {
        icon: Info,
        className: "bg-gray-100 text-gray-600",
    },
};

const NotificationsPage = () => {
    const [activeType, setActiveType] = useState("all");
    const [showUnreadOnly, setShowUnreadOnly] =
        useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [notificationList, setNotificationList] =
        useState(notifications);

    const unreadCount = notificationList.filter(
        (notification) => !notification.read
    ).length;

    const safetyCount = notificationList.filter(
        (notification) => notification.type === "safety"
    ).length;

    const attentionCount = notificationList.filter(
        (notification) =>
            notification.priority === "high" &&
            !notification.read
    ).length;

    const filteredNotifications = useMemo(() => {
        return notificationList.filter((notification) => {
            const matchesType =
                activeType === "all" ||
                notification.type === activeType;

            const matchesRead =
                !showUnreadOnly || !notification.read;

            return matchesType && matchesRead;
        });


    }, [
        activeType,
        showUnreadOnly,
        notificationList,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredNotifications.length / ITEMS_PER_PAGE
        )
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages
    );

    const paginatedNotifications =
        filteredNotifications.slice(
            (safeCurrentPage - 1) * ITEMS_PER_PAGE,
            safeCurrentPage * ITEMS_PER_PAGE
        );

    const markAsRead = (id) => {
        setNotificationList((current) =>
            current.map((notification) =>
                notification.id === id
                    ? {
                        ...notification,
                        read: true,
                    }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotificationList((current) =>
            current.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    const removeNotification = (id) => {
        setNotificationList((current) =>
            current.filter(
                (notification) => notification.id !== id
            )
        );
    };

    const handleTypeChange = (type) => {
        setActiveType(type);
        setCurrentPage(1);
    };

    const handleUnreadChange = () => {
        setShowUnreadOnly((current) => !current);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setActiveType("all");
        setShowUnreadOnly(false);
        setCurrentPage(1);
    };

    return (<div className="min-h-screen bg-gray-50"> <AdminSidebar />

        ```
        <div className="lg:ml-72">
            <AdminNavbar />

            <main className="px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    {/* Page header */}
                    <AdminPageHeader
                        title="Notifications"
                        description="Monitor important events and activity across TripGuard."
                    />

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <NotificationStat
                            icon={BellRing}
                            label="Total"
                            value={notificationList.length}
                            iconClass="bg-blue-50 text-blue-600"
                        />

                        <NotificationStat
                            icon={Bell}
                            label="Unread"
                            value={unreadCount}
                            iconClass="bg-amber-50 text-amber-600"
                        />

                        <NotificationStat
                            icon={ShieldCheck}
                            label="Safety"
                            value={safetyCount}
                            iconClass="bg-emerald-50 text-emerald-600"
                        />

                        <NotificationStat
                            icon={CircleAlert}
                            label="Needs attention"
                            value={attentionCount}
                            iconClass="bg-red-50 text-red-600"
                        />
                    </div>

                    {/* Filters */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-2">
                                <Filter
                                    size={17}
                                    className="text-gray-400"
                                />

                                <span className="text-sm font-semibold text-gray-800">
                                    Filter notifications
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleUnreadChange}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${showUnreadOnly
                                        ? "border-[#63E6BE] bg-[#63E6BE]/10 text-[#159669]"
                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <Mail size={16} />
                                Unread only
                            </button>
                        </div>

                        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                            {notificationTypes.map((type) => {
                                const count =
                                    type.value === "all"
                                        ? notificationList.length
                                        : notificationList.filter(
                                            (notification) =>
                                                notification.type ===
                                                type.value
                                        ).length;

                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() =>
                                            handleTypeChange(type.value)
                                        }
                                        className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition ${activeType === type.value
                                                ? "bg-gray-900 text-white"
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                            }`}
                                    >
                                        {type.label}

                                        <span
                                            className={`ml-1.5 ${activeType === type.value
                                                    ? "text-gray-300"
                                                    : "text-gray-400"
                                                }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notification list */}
                    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Recent notifications
                                </h2>

                                <p className="mt-1 text-xs text-gray-400">
                                    {filteredNotifications.length} notifications
                                    matching your filters
                                </p>
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    className="inline-flex items-center gap-2 self-start rounded-xl px-3 py-2 text-xs font-semibold text-[#159669] transition hover:bg-[#63E6BE]/10 sm:self-auto"
                                >
                                    <CheckCheck size={15} />
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {paginatedNotifications.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {paginatedNotifications.map(
                                    (notification) => {
                                        const config =
                                            iconConfig[notification.type];

                                        const Icon = config.icon;

                                        return (
                                            <div
                                                key={notification.id}
                                                className={`group relative flex gap-4 px-5 py-5 transition hover:bg-gray-50 sm:px-6 ${!notification.read
                                                        ? "bg-[#63E6BE]/[0.025]"
                                                        : ""
                                                    }`}
                                            >
                                                {!notification.read && (
                                                    <span className="absolute left-0 top-0 h-full w-1 bg-[#63E6BE]" />
                                                )}

                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                                                >
                                                    <Icon size={19} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3
                                                                    className={`text-sm ${notification.read
                                                                            ? "font-medium text-gray-700"
                                                                            : "font-semibold text-gray-900"
                                                                        }`}
                                                                >
                                                                    {notification.title}
                                                                </h3>

                                                                {notification.priority ===
                                                                    "high" && (
                                                                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                                                                            Attention
                                                                        </span>
                                                                    )}
                                                            </div>

                                                            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-gray-500">
                                                                {notification.message}
                                                            </p>
                                                        </div>

                                                        <span className="shrink-0 text-xs text-gray-400">
                                                            {notification.time}
                                                        </span>
                                                    </div>

                                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                                        {notification.bookingId && (
                                                            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                                                                {notification.bookingId}
                                                            </span>
                                                        )}

                                                        <span className="text-[11px] text-gray-400">
                                                            {notification.date}
                                                        </span>

                                                        <div className="ml-auto flex items-center gap-1">
                                                            {!notification.read && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        markAsRead(
                                                                            notification.id
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                                                                >
                                                                    <Check size={13} />
                                                                    Mark as read
                                                                </button>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeNotification(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                                                aria-label="Remove notification"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                    <Bell size={25} />
                                </div>

                                <h3 className="mt-4 font-semibold text-gray-900">
                                    No notifications found
                                </h3>

                                <p className="mt-1 max-w-sm text-sm text-gray-500">
                                    There are no notifications matching your
                                    current filters.
                                </p>

                                {(activeType !== "all" ||
                                    showUnreadOnly) && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="mt-4 text-sm font-semibold text-[#159669] hover:underline"
                                        >
                                            Clear filters
                                        </button>
                                    )}
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredNotifications.length > 0 && (
                            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <p className="text-xs text-gray-400">
                                    Showing{" "}
                                    <span className="font-semibold text-gray-600">
                                        {(safeCurrentPage - 1) *
                                            ITEMS_PER_PAGE +
                                            1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-semibold text-gray-600">
                                        {Math.min(
                                            safeCurrentPage * ITEMS_PER_PAGE,
                                            filteredNotifications.length
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-gray-600">
                                        {filteredNotifications.length}
                                    </span>
                                </p>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        disabled={safeCurrentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                Math.max(1, page - 1)
                                            )
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft size={15} />
                                    </button>

                                    <span className="px-3 text-xs font-medium text-gray-500">
                                        Page {safeCurrentPage} of{" "}
                                        {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={
                                            safeCurrentPage === totalPages
                                        }
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                Math.min(
                                                    totalPages,
                                                    page + 1
                                                )
                                            )
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Next page"
                                    >
                                        <ChevronRight size={15} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    </div>


    );
};

const NotificationStat = ({
    icon: Icon,
    label,
    value,
    iconClass,
}) => {
    return (<div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        > <Icon size={19} /> </div>

        <p className="mt-4 text-xs text-gray-500">
            {label}
        </p>

        <p className="mt-1 text-xl font-bold text-gray-900">
            {value}
        </p>
    </div>

    );
};

export default NotificationsPage;
