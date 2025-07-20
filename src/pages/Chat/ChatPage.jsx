import React, { useState, useEffect, useRef } from "react";
import { useUserChats, useChatMessages, useSendMessage } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import io from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Send,
    Search,
    Phone,
    Video,
    MoreVertical,
    MessageCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import HeaderJobseeker from "@/components/Header/HeaderJobseeker";
import HeaderCompany from "@/components/Header/HeaderCompany";
import CompanySearchModal from "@/components/Chat/CompanySearchModal";

const SOCKET_URL =
    import.meta.env.VITE_API_SOCKET_URL || "http://localhost:5000";

const ChatPage = () => {
    const { user, token } = useAuth();
    const {
        data: chatsData,
        isLoading: chatsLoading,
        refetch: refetchChats,
    } = useUserChats();

    const sendMessageMutation = useSendMessage();
    const messagesEndRef = useRef(null);

    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [showCompanySearch, setShowCompanySearch] = useState(false);
    const [isTabActive, setIsTabActive] = useState(true);
    const [socket, setSocket] = useState(null);

    const {
        data: messagesData,
        isLoading: messagesLoading,
        refetch: refetchMessages,
    } = useChatMessages(selectedChatId);

    const chats = chatsData?.payload || [];
    const messages = messagesData?.payload?.messages || [];
    const selectedChat = chats.find((chat) => chat._id === selectedChatId);

    // Track tab visibility
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsTabActive(!document.hidden);
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [messages]);

    // Kết nối socket khi có token (dùng auth thay vì query)
    useEffect(() => {
        if (!token) return;
        const newSocket = io(SOCKET_URL, {
            auth: { token },
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    // Lắng nghe tin nhắn mới từ server
    useEffect(() => {
        if (!socket || !selectedChatId) return;

        const handleNewMessage = (message) => {
            // Chỉ update nếu là chat hiện tại
            if (message.chat === selectedChatId) {
                refetchMessages();
            }
        };

        socket.on("newMessage", handleNewMessage);

        // Tham gia phòng chat
        socket.emit("joinChat", selectedChatId);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.emit("leaveChat", selectedChatId);
        };
    }, [socket, selectedChatId, refetchMessages]);

    // Gửi tin nhắn
    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedChatId) return;
        try {
            await sendMessageMutation.mutateAsync({
                chatId: selectedChatId,
                content: messageInput.trim(),
                messageType: "text",
            });
            setMessageInput("");
            // KHÔNG gọi refetchMessages ở đây!
        } catch (error) {
            console.error("❌ Failed to send message:", error);
        }
    };

    // Khi chuyển chat thì refetch messages
    useEffect(() => {
        if (selectedChatId) {
            refetchMessages();
        }
    }, [selectedChatId]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatMessageTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getOtherParticipant = (chat) => {
        if (!chat || !user) return null;
        if (user.role === "JOBSEEKER") {
            const employer = chat.employer || {};
            const company = chat.company || {};
            const displayName = company.companyName
                ? company.companyName
                : `${employer.firstName || "Unknown"} ${
                      employer.lastName || "User"
                  }`;
            return {
                ...employer,
                displayName: displayName,
                role: company.companyName ? "Company" : "Employer",
                company: chat.company,
                imageUrl: company.imageUrl || employer.imageUrl,
            };
        } else {
            const jobseeker = chat.jobseeker || {};
            return {
                ...jobseeker,
                displayName: `${jobseeker.firstName || "Unknown"} ${
                    jobseeker.lastName || "User"
                }`,
                role: "Job Seeker",
            };
        }
    };

    // New message notification
    const [lastMessageCount, setLastMessageCount] = useState(0);
    useEffect(() => {
        if (messages.length > lastMessageCount && lastMessageCount > 0) {
            if (!isTabActive) {
                document.title = `💬 New message - Chat`;
            }
        }
        setLastMessageCount(messages.length);
    }, [messages.length, isTabActive, lastMessageCount]);

    useEffect(() => {
        if (isTabActive) {
            document.title = "Chat";
        }
    }, [isTabActive]);

    if (chatsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            {user?.role === "JOBSEEKER" ? (
                <HeaderJobseeker />
            ) : (
                <HeaderCompany />
            )}

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
                        {/* Chat List Sidebar */}
                        <Card className="lg:col-span-1">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <MessageCircle className="h-5 w-5" />
                                        Messages
                                    </CardTitle>
                                    {user?.role === "JOBSEEKER" && (
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                setShowCompanySearch(true)
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-xs"
                                        >
                                            New Chat
                                        </Button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search conversations..."
                                        className="pl-10"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[calc(100vh-12rem)]">
                                    {chats.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500">
                                            <MessageCircle className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                                            <p>No conversations yet</p>
                                            {user?.role === "JOBSEEKER" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="mt-2"
                                                    onClick={() =>
                                                        setShowCompanySearch(
                                                            true
                                                        )
                                                    }
                                                >
                                                    Start a conversation
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        chats.map((chat) => {
                                            const otherParticipant =
                                                getOtherParticipant(chat);
                                            if (!otherParticipant) return null;

                                            return (
                                                <div
                                                    key={chat._id}
                                                    onClick={() =>
                                                        setSelectedChatId(
                                                            chat._id
                                                        )
                                                    }
                                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                                        selectedChatId ===
                                                        chat._id
                                                            ? "bg-blue-50 border-r-4 border-r-blue-600"
                                                            : ""
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <Avatar className="h-12 w-12">
                                                                <AvatarImage
                                                                    src={
                                                                        otherParticipant.imageUrl
                                                                    }
                                                                    alt={
                                                                        otherParticipant.displayName
                                                                    }
                                                                />
                                                                <AvatarFallback>
                                                                    {otherParticipant.displayName
                                                                        .split(
                                                                            " "
                                                                        )
                                                                        .map(
                                                                            (
                                                                                n
                                                                            ) =>
                                                                                n[0]
                                                                        )
                                                                        .join(
                                                                            ""
                                                                        )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="font-semibold text-sm truncate">
                                                                    {
                                                                        otherParticipant.displayName
                                                                    }
                                                                </h3>
                                                                {chat.unreadCount >
                                                                    0 && (
                                                                    <Badge
                                                                        variant="destructive"
                                                                        className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center"
                                                                    >
                                                                        {
                                                                            chat.unreadCount
                                                                        }
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {
                                                                        otherParticipant.role
                                                                    }
                                                                </Badge>
                                                                {otherParticipant.company && (
                                                                    <span className="text-xs text-gray-500 truncate">
                                                                        at{" "}
                                                                        {
                                                                            otherParticipant
                                                                                .company
                                                                                .companyName
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {chat.lastMessage && (
                                                                <p className="text-xs text-gray-500 truncate mt-1">
                                                                    {
                                                                        chat
                                                                            .lastMessage
                                                                            .content
                                                                    }
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {formatDistanceToNow(
                                                                    new Date(
                                                                        chat.lastActivity
                                                                    ),
                                                                    {
                                                                        addSuffix: true,
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Chat Area */}
                        <Card className="lg:col-span-3 flex flex-col">
                            {selectedChat ? (
                                <>
                                    {/* Chat Header */}
                                    <CardHeader className="pb-3 border-b">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage
                                                        src={
                                                            getOtherParticipant(
                                                                selectedChat
                                                            )?.imageUrl
                                                        }
                                                        alt={
                                                            getOtherParticipant(
                                                                selectedChat
                                                            )?.displayName
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {getOtherParticipant(
                                                            selectedChat
                                                        )
                                                            ?.displayName.split(
                                                                " "
                                                            )
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {
                                                            getOtherParticipant(
                                                                selectedChat
                                                            )?.displayName
                                                        }
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {
                                                                getOtherParticipant(
                                                                    selectedChat
                                                                )?.role
                                                            }
                                                        </Badge>
                                                        {getOtherParticipant(
                                                            selectedChat
                                                        )?.company && (
                                                            <span className="text-sm text-gray-500">
                                                                at{" "}
                                                                {
                                                                    getOtherParticipant(
                                                                        selectedChat
                                                                    ).company
                                                                        .companyName
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-green-600">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                        <span>Online</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Phone className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Video className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {/* Messages Area */}
                                    <CardContent className="flex-1 p-0 flex flex-col">
                                        <ScrollArea className="flex-1 p-4">
                                            {messagesLoading ? (
                                                <div className="flex justify-center items-center h-32">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {messages.map(
                                                        (message, index) => {
                                                            const isSentByMe =
                                                                message.sender
                                                                    ?._id ===
                                                                user?.id;
                                                            const isSystemMessage =
                                                                message.messageType ===
                                                                "system";
                                                            const isTemporary =
                                                                message.isTemporary;

                                                            if (
                                                                isSystemMessage
                                                            ) {
                                                                return (
                                                                    <div
                                                                        key={
                                                                            message._id
                                                                        }
                                                                        className="flex justify-center"
                                                                    >
                                                                        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
                                                                            {
                                                                                message.content
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }

                                                            return (
                                                                <div
                                                                    key={
                                                                        message._id
                                                                    }
                                                                    className={`flex ${
                                                                        isSentByMe
                                                                            ? "justify-end"
                                                                            : "justify-start"
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                                            isSentByMe
                                                                                ? `bg-blue-600 text-white ${
                                                                                      isTemporary
                                                                                          ? "opacity-70"
                                                                                          : ""
                                                                                  }`
                                                                                : "bg-gray-100 text-gray-900"
                                                                        }`}
                                                                    >
                                                                        <p className="text-sm">
                                                                            {
                                                                                message.content
                                                                            }
                                                                        </p>
                                                                        <div className="flex items-center justify-between mt-1">
                                                                            <p
                                                                                className={`text-xs ${
                                                                                    isSentByMe
                                                                                        ? "text-blue-100"
                                                                                        : "text-gray-500"
                                                                                }`}
                                                                            >
                                                                                {formatMessageTime(
                                                                                    message.createdAt
                                                                                )}
                                                                            </p>
                                                                            {isTemporary && (
                                                                                <span className="text-xs text-blue-200 animate-pulse">
                                                                                    Sending...
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                    <div ref={messagesEndRef} />
                                                </div>
                                            )}
                                        </ScrollArea>

                                        <Separator />

                                        {/* Message Input */}
                                        <div className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={messageInput}
                                                    onChange={(e) =>
                                                        setMessageInput(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={handleKeyPress}
                                                    placeholder="Type a message..."
                                                    className="flex-1"
                                                    disabled={
                                                        sendMessageMutation.isLoading
                                                    }
                                                />
                                                <Button
                                                    onClick={handleSendMessage}
                                                    disabled={
                                                        !messageInput.trim() ||
                                                        sendMessageMutation.isLoading
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    {sendMessageMutation.isLoading ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    ) : (
                                                        <Send className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </>
                            ) : (
                                <CardContent className="flex-1 flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <MessageCircle className="mx-auto h-16 w-16 mb-4 text-gray-300" />
                                        <h3 className="text-lg font-semibold mb-2">
                                            Select a conversation
                                        </h3>
                                        <p>
                                            Choose a conversation from the list
                                            to start messaging
                                        </p>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            <CompanySearchModal
                isOpen={showCompanySearch}
                onClose={() => setShowCompanySearch(false)}
                onChatCreated={(chatId) => {
                    setSelectedChatId(chatId);
                    setShowCompanySearch(false);
                    refetchChats();
                }}
            />
        </>
    );
};

export default ChatPage;
