import { useState } from "react";
import { useNotifications, useMarkAllAsRead } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationItem = ({ notification }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`flex items-start p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                !notification.readStatus ? "bg-blue-50" : "bg-white"
            }`}
        >
            <div className="flex-shrink-0 mr-4">
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        !notification.readStatus ? "bg-blue-100" : "bg-gray-100"
                    }`}
                >
                    <Bell
                        className={`w-5 h-5 ${
                            !notification.readStatus
                                ? "text-blue-600"
                                : "text-gray-500"
                        }`}
                    />
                </div>
            </div>
            <div className="flex-grow">
                <p
                    className={`text-sm text-gray-800 ${
                        !notification.readStatus ? "font-semibold" : ""
                    }`}
                >
                    {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </div>
    );
};

export default function NotificationPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError, error } = useNotifications(page, 10);
    const markAsReadMutation = useMarkAllAsRead();

    const notifications = data?.payload?.notifications || [];
    const totalPages = data?.payload?.totalPages || 1;
    const unreadCount = data?.payload?.unreadCount || 0;

    const handleMarkAllRead = () => {
        if (unreadCount > 0) {
            markAsReadMutation.mutate();
        }
    };

    if (isLoading && page === 1) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-lg">
                Error: {error.message}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Notifications
                </h1>
                {notifications.length > 0 && (
                    <Button
                        onClick={handleMarkAllRead}
                        disabled={
                            markAsReadMutation.isLoading || unreadCount === 0
                        }
                    >
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <NotificationItem
                            key={notif._id}
                            notification={notif}
                        />
                    ))
                ) : (
                    <div className="text-center p-10">
                        <Bell className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No notifications
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            You're all caught up.
                        </p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-4">
                    <Button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        variant="outline"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>
                    <span className="font-medium">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        onClick={() =>
                            setPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={page === totalPages}
                        variant="outline"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );
}
