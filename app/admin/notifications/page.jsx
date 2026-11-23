"use client";

import { useEffect, useMemo, useState } from "react";
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
    Home,
    X,
} from "lucide-react";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
        value: "accommodation",
        label: "Accommodations",
    },
    {
        value: "account",
        label: "Account",
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

    accommodation: {
        icon: Home,
        className: "bg-orange-50 text-orange-600",
    },

    account: {
        icon: Bell,
        className: "bg-amber-50 text-amber-600",
    },

    system: {
        icon: Info,
        className: "bg-gray-100 text-gray-600",
    },
};

const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

const formatTimeAgo = (date) => {
    if (!date) return "";

    const now = new Date();
    const notificationDate = new Date(date);

    const difference =
        Math.floor(
            (now.getTime() - notificationDate.getTime()) / 1000
        );

    if (difference < 60) {
        return "Just now";
    }

    const minutes = Math.floor(difference / 60);

    if (minutes < 60) {
        return `${minutes} ${
            minutes === 1 ? "minute" : "minutes"
        } ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} ${
            hours === 1 ? "hour" : "hours"
        } ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days} ${
            days === 1 ? "day" : "days"
        } ago`;
    }

    return notificationDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const NotificationsPage = () => {
    const [activeType, setActiveType] = useState("all");
    const [showUnreadOnly, setShowUnreadOnly] =
        useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const [notificationList, setNotificationList] = useState(
        []
    );

    const [unreadCount, setUnreadCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState(null);

    // ============================================================
    // FETCH ADMIN NOTIFICATIONS
    // ============================================================

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/admin/notifications`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Unable to retrieve notifications"
                );
            }

            setNotificationList(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error(
                "Fetch admin notifications error:",
                error
            );

            setError(
                error.message ||
                    "Unable to retrieve notifications"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // ============================================================
    // DERIVED COUNTS
    // ============================================================

    const safetyCount = notificationList.filter(
        (notification) =>
            notification.type === "safety"
    ).length;

    const attentionCount = notificationList.filter(
        (notification) =>
            notification.priority === "high" &&
            !notification.isRead
    ).length;

    // ============================================================
    // FILTERING
    // ============================================================

    const filteredNotifications = useMemo(() => {
        return notificationList.filter((notification) => {
            const matchesType =
                activeType === "all" ||
                notification.type === activeType;

            const matchesRead =
                !showUnreadOnly ||
                !notification.isRead;

            return matchesType && matchesRead;
        });
    }, [
        activeType,
        showUnreadOnly,
        notificationList,
    ]);

    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredNotifications.length /
                ITEMS_PER_PAGE
        )
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages
    );

    const paginatedNotifications =
        filteredNotifications.slice(
            (safeCurrentPage - 1) *
                ITEMS_PER_PAGE,

            safeCurrentPage *
                ITEMS_PER_PAGE
        );

    // ============================================================
    // MARK SINGLE NOTIFICATION AS READ
    // ============================================================

    const markAsRead = async (id) => {
        try {
            setActionLoading(`read-${id}`);

            const response = await fetch(
                `${API_URL}/admin/notifications/${id}/read`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Unable to mark notification as read"
                );
            }

            setNotificationList((current) =>
                current.map((notification) =>
                    notification._id === id
                        ? {
                              ...notification,
                              isRead: true,
                              readAt: new Date().toISOString(),
                          }
                        : notification
                )
            );

            setUnreadCount((current) =>
                Math.max(0, current - 1)
            );
        } catch (error) {
            console.error(
                "Mark notification as read error:",
                error
            );

            setError(
                error.message ||
                    "Unable to mark notification as read"
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ============================================================
    // MARK ALL AS READ
    // ============================================================

    const markAllAsRead = async () => {
        try {
            setActionLoading("read-all");

            const response = await fetch(
                `${API_URL}/admin/notifications/read-all`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Unable to mark notifications as read"
                );
            }

            setNotificationList((current) =>
                current.map((notification) => ({
                    ...notification,
                    isRead: true,
                    readAt:
                        notification.readAt ||
                        new Date().toISOString(),
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error(
                "Mark all notifications as read error:",
                error
            );

            setError(
                error.message ||
                    "Unable to mark notifications as read"
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ============================================================
    // DELETE NOTIFICATION
    // ============================================================

    const removeNotification = async (id) => {
        try {
            setActionLoading(`delete-${id}`);

            const notification =
                notificationList.find(
                    (item) => item._id === id
                );

            const response = await fetch(
                `${API_URL}/admin/notifications/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Unable to delete notification"
                );
            }

            setNotificationList((current) =>
                current.filter(
                    (item) => item._id !== id
                )
            );

            if (
                notification &&
                !notification.isRead
            ) {
                setUnreadCount((current) =>
                    Math.max(0, current - 1)
                );
            }
        } catch (error) {
            console.error(
                "Delete notification error:",
                error
            );

            setError(
                error.message ||
                    "Unable to delete notification"
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ============================================================
    // FILTER HANDLERS
    // ============================================================

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

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="lg:ml-72">
                <AdminNavbar />

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl space-y-6">
                        {/* Page header */}

                        <AdminPageHeader
                            title="Notifications"
                            description="Monitor important events and activity across TripGuard."
                        />

                        {/* Error */}

                        {error && (
                            <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                <span>{error}</span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setError("")
                                    }
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        {/* Stats */}

                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <NotificationStat
                                icon={BellRing}
                                label="Total"
                                value={
                                    notificationList.length
                                }
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
                                    onClick={
                                        handleUnreadChange
                                    }
                                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                                        showUnreadOnly
                                            ? "border-[#63E6BE] bg-[#63E6BE]/10 text-[#159669]"
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <Mail size={16} />

                                    Unread only
                                </button>
                            </div>

                            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                                {notificationTypes.map(
                                    (type) => {
                                        const count =
                                            type.value ===
                                            "all"
                                                ? notificationList.length
                                                : notificationList.filter(
                                                      (
                                                          notification
                                                      ) =>
                                                          notification.type ===
                                                          type.value
                                                  ).length;

                                        return (
                                            <button
                                                key={
                                                    type.value
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleTypeChange(
                                                        type.value
                                                    )
                                                }
                                                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition ${
                                                    activeType ===
                                                    type.value
                                                        ? "bg-gray-900 text-white"
                                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                }`}
                                            >
                                                {
                                                    type.label
                                                }

                                                <span
                                                    className={`ml-1.5 ${
                                                        activeType ===
                                                        type.value
                                                            ? "text-gray-300"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    }
                                )}
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
                                        {
                                            filteredNotifications.length
                                        }{" "}
                                        notifications
                                        matching your
                                        filters
                                    </p>
                                </div>

                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={
                                            markAllAsRead
                                        }
                                        disabled={
                                            actionLoading ===
                                            "read-all"
                                        }
                                        className="inline-flex items-center gap-2 self-start rounded-xl px-3 py-2 text-xs font-semibold text-[#159669] transition hover:bg-[#63E6BE]/10 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                                    >
                                        <CheckCheck
                                            size={15}
                                        />

                                        {actionLoading ===
                                        "read-all"
                                            ? "Marking..."
                                            : "Mark all as read"}
                                    </button>
                                )}
                            </div>

                            {loading ? (
                                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                        <Bell
                                            size={25}
                                            className="animate-pulse"
                                        />
                                    </div>

                                    <h3 className="mt-4 font-semibold text-gray-900">
                                        Loading notifications
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Please wait while we
                                        retrieve your
                                        notifications.
                                    </p>
                                </div>
                            ) : paginatedNotifications.length >
                              0 ? (
                                <div className="divide-y divide-gray-100">
                                    {paginatedNotifications.map(
                                        (
                                            notification
                                        ) => {
                                            const config =
                                                iconConfig[
                                                    notification.type
                                                ] ||
                                                iconConfig.system;

                                            const Icon =
                                                config.icon;

                                            const isRead =
                                                notification.isRead;

                                            const isReadLoading =
                                                actionLoading ===
                                                `read-${notification._id}`;

                                            const isDeleteLoading =
                                                actionLoading ===
                                                `delete-${notification._id}`;

                                            return (
                                                <div
                                                    key={
                                                        notification._id
                                                    }
                                                    className={`group relative flex gap-4 px-5 py-5 transition hover:bg-gray-50 sm:px-6 ${
                                                        !isRead
                                                            ? "bg-[#63E6BE]/[0.025]"
                                                            : ""
                                                    }`}
                                                >
                                                    {!isRead && (
                                                        <span className="absolute left-0 top-0 h-full w-1 bg-[#63E6BE]" />
                                                    )}

                                                    <div
                                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                                                    >
                                                        <Icon
                                                            size={
                                                                19
                                                            }
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                            <div className="min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <h3
                                                                        className={`text-sm ${
                                                                            isRead
                                                                                ? "font-medium text-gray-700"
                                                                                : "font-semibold text-gray-900"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </h3>

                                                                    {notification.priority ===
                                                                        "high" && (
                                                                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                                                                            Attention
                                                                        </span>
                                                                    )}

                                                                    {notification.priority ===
                                                                        "urgent" && (
                                                                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                                                                            Urgent
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <p className="mt-1.5 max-w-3xl text-sm leading-6 text-gray-500">
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </p>
                                                            </div>

                                                            <span className="shrink-0 text-xs text-gray-400">
                                                                {formatTimeAgo(
                                                                    notification.createdAt
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                                            {notification.booking?.bookingReference && (
                                                                <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                                                                    {
                                                                        notification
                                                                            .booking
                                                                            .bookingReference
                                                                    }
                                                                </span>
                                                            )}

                                                            {notification.accommodation?.name && (
                                                                <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                                                                    {
                                                                        notification
                                                                            .accommodation
                                                                            .name
                                                                    }
                                                                </span>
                                                            )}

                                                            <span className="text-[11px] text-gray-400">
                                                                {formatDate(
                                                                    notification.createdAt
                                                                )}
                                                            </span>

                                                            <div className="ml-auto flex items-center gap-1">
                                                                {!isRead && (
                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            isReadLoading
                                                                        }
                                                                        onClick={() =>
                                                                            markAsRead(
                                                                                notification._id
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                                    >
                                                                        <Check
                                                                            size={
                                                                                13
                                                                            }
                                                                        />

                                                                        {isReadLoading
                                                                            ? "..."
                                                                            : "Mark as read"}
                                                                    </button>
                                                                )}

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isDeleteLoading
                                                                    }
                                                                    onClick={() =>
                                                                        removeNotification(
                                                                            notification._id
                                                                        )
                                                                    }
                                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                                    aria-label="Remove notification"
                                                                >
                                                                    <X
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
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
                                        <Bell
                                            size={25}
                                        />
                                    </div>

                                    <h3 className="mt-4 font-semibold text-gray-900">
                                        No notifications
                                        found
                                    </h3>

                                    <p className="mt-1 max-w-sm text-sm text-gray-500">
                                        There are no
                                        notifications
                                        matching your current
                                        filters.
                                    </p>

                                    {(activeType !==
                                        "all" ||
                                        showUnreadOnly) && (
                                        <button
                                            type="button"
                                            onClick={
                                                clearFilters
                                            }
                                            className="mt-4 text-sm font-semibold text-[#159669] hover:underline"
                                        >
                                            Clear filters
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}

                            {!loading &&
                                filteredNotifications.length >
                                    0 && (
                                    <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                        <p className="text-xs text-gray-400">
                                            Showing{" "}
                                            <span className="font-semibold text-gray-600">
                                                {(safeCurrentPage -
                                                    1) *
                                                    ITEMS_PER_PAGE +
                                                    1}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-semibold text-gray-600">
                                                {Math.min(
                                                    safeCurrentPage *
                                                        ITEMS_PER_PAGE,
                                                    filteredNotifications.length
                                                )}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-semibold text-gray-600">
                                                {
                                                    filteredNotifications.length
                                                }
                                            </span>
                                        </p>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                disabled={
                                                    safeCurrentPage ===
                                                    1
                                                }
                                                onClick={() =>
                                                    setCurrentPage(
                                                        (
                                                            page
                                                        ) =>
                                                            Math.max(
                                                                1,
                                                                page -
                                                                    1
                                                            )
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                aria-label="Previous page"
                                            >
                                                <ChevronLeft
                                                    size={
                                                        15
                                                    }
                                                />
                                            </button>

                                            <span className="px-3 text-xs font-medium text-gray-500">
                                                Page{" "}
                                                {
                                                    safeCurrentPage
                                                }{" "}
                                                of{" "}
                                                {
                                                    totalPages
                                                }
                                            </span>

                                            <button
                                                type="button"
                                                disabled={
                                                    safeCurrentPage ===
                                                    totalPages
                                                }
                                                onClick={() =>
                                                    setCurrentPage(
                                                        (
                                                            page
                                                        ) =>
                                                            Math.min(
                                                                totalPages,
                                                                page +
                                                                    1
                                                            )
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                aria-label="Next page"
                                            >
                                                <ChevronRight
                                                    size={
                                                        15
                                                    }
                                                />
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
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
            >
                <Icon size={19} />
            </div>

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