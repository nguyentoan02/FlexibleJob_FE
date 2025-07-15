import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Toast({ message, type = "success", duration = 4000 }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg text-white",
                type === "success" ? "bg-green-500" : "bg-red-500"
            )}
        >
            {message}
        </div>
    );
}
