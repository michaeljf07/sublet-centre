"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSession, getAuthToken } from "@/lib/auth-client";
import { Send } from "lucide-react";

interface Message {
    id: number;
    sender_id: string;
    sender_name: string;
    recipient_id: string;
    content: string;
    created_at: string;
}

export default function MessagesPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const { data } = await getSession();
                if (!data?.session?.user) {
                    router.push("/auth");
                    return;
                }
                setUser(data.session.user);

                // Fetch messages
                const token = await getAuthToken();
                const response = await fetch("/api/messages", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center py-12">
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
            msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        if (
            !conversations.has(otherId) ||
            conversations.get(otherId)!.id < msg.id
        ) {
            conversations.set(otherId, msg);
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                <div className="max-w-4xl mx-auto">
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
                                        lastMsg.sender_id === user.id;
                                    return (
                                        <div
                                            key={otherId}
                                            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {isUserSender
                                                            ? "Message to "
                                                            : "Message from "}
                                                        {lastMsg.sender_name}
                                                    </h3>
                                                    <p className="text-base text-gray-600 mt-1">
                                                        {lastMsg.content.substring(
                                                            0,
                                                            100
                                                        )}
                                                        {lastMsg.content
                                                            .length > 100
                                                            ? "..."
                                                            : ""}
                                                    </p>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(
                                                        lastMsg.created_at
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
            </div>
            <Footer />
        </div>
    );
}
