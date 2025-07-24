import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications, useMarkAllAsRead } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";

const NotificationItem = ({ notification, onNotificationClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (notification.link) {
            navigate(notification.link);
        }
        onNotificationClick(); // Close popover
    };

    return (
        <div
            onClick={handleClick}
            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                !notification.readStatus ? "bg-blue-50" : ""
            }`}
        >
            <p className="text-sm text-gray-800">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
            </p>
        </div>
    );
};

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: notificationsData, isLoading } = useNotifications(1, 7);
    const markAsReadMutation = useMarkAllAsRead();

    const unreadCount = notificationsData?.payload?.unreadCount || 0;
    const notifications = notificationsData?.payload?.notifications || [];

    const handleMarkAllRead = () => {
        markAsReadMutation.mutate();
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="p-3 border-b flex justify-between items-center">
                    <h4 className="font-medium text-gray-800">Notifications</h4>
                    {notifications.length > 0 && (
                        <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={handleMarkAllRead}
                            disabled={markAsReadMutation.isLoading}
                        >
                            <CheckCheck className="w-4 h-4 mr-1" />
                            Mark all as read
                        </Button>
                    )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <p className="p-4 text-center text-sm text-gray-500">
                            Loading...
                        </p>
                    ) : notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-gray-500">
                            No new notifications.
                        </p>
                    ) : (
                        notifications.map((notif) => (
                            <NotificationItem
                                key={notif._id}
                                notification={notif}
                                onNotificationClick={() => setIsOpen(false)}
                            />
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
