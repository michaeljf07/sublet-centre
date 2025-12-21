"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { authClient } from "@/lib/auth-client";
import { Send } from "lucide-react";

interface Message {
    id: number;
    senderId: string;
    recipientId: string;
    content: string;
    createdAt: string;
}

export default function MessagesPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const session = await authClient.getSession();
                if (!session?.data?.user) {
                    router.push("/auth");
                    return;
                }
                setUser(session.data.user);

                // Fetch messages
                const response = await fetch("/api/messages");
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to load messages:", error);
                router.push("/auth");
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            Loading messages...
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Get unique conversations
    const conversations = new Map<string, Message>();
    messages.forEach((msg) => {
        const otherId =
            msg.senderId === user.id ? msg.recipientId : msg.senderId;
        if (
            !conversations.has(otherId) ||
            conversations.get(otherId)!.id < msg.id
        ) {
            conversations.set(otherId, msg);
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Messages
                </h1>

                {messages.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-900 mb-4">
                            You don't have any messages yet
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer">
                            Browse Listings
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {Array.from(conversations.entries()).map(
                            ([otherId, lastMsg]) => {
                                const isUserSender =
                                    lastMsg.senderId === user.id;
                                return (
                                    <div
                                        key={otherId}
                                        className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {isUserSender
                                                        ? "Message to "
                                                        : "Message from "}
                                                    {otherId}
                                                </h3>
                                                <p className="text-gray-600 mt-1">
                                                    {lastMsg.content.substring(
                                                        0,
                                                        100
                                                    )}
                                                    {lastMsg.content.length >
                                                    100
                                                        ? "..."
                                                        : ""}
                                                </p>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(
                                                    lastMsg.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
