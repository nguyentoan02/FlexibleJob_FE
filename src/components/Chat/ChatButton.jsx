import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useCreateChatWithCompany } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Toast from "@/components/Toast/Toast";
import { useState } from "react";

const ChatButton = ({ company }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const createChatMutation = useCreateChatWithCompany();
    const [toast, setToast] = useState({ message: "", type: "" });

    const handleStartChat = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "JOBSEEKER") {
            setToast({
                message: "Only jobseekers can start chats with companies",
                type: "error",
            });
            return;
        }

        try {
            await createChatMutation.mutateAsync(company._id);
            setToast({
                message: "Chat started successfully!",
                type: "success",
            });

            // Navigate to chat page after a brief delay
            setTimeout(() => {
                navigate("/user/dashboard/chat");
            }, 1500);
        } catch (error) {
            setToast({
                message:
                    error.response?.data?.message || "Failed to start chat",
                type: "error",
            });
        }
    };

    return (
        <>
            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}
            <Button
                onClick={handleStartChat}
                disabled={createChatMutation.isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
                <MessageCircle className="h-5 w-5" />
                {createChatMutation.isLoading
                    ? "Starting..."
                    : "Chat with Company"}
            </Button>
        </>
    );
};

export default ChatButton;
