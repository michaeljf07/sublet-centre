"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSession, getAuthToken } from "@/lib/auth-client";
import { Bell, Trash2 } from "lucide-react";

interface Notification {
    id: number;
    userId: string;
    type: string;
    title: string;
    description?: string;
    relatedId?: number;
    read: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
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

                // Fetch notifications
                const token = await getAuthToken();
                const response = await fetch("/api/notifications", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error("Failed to load notifications:", error);
                router.push("/auth");
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [router]);

    async function handleDelete(id: number) {
        try {
            const token = await getAuthToken();
            const response = await fetch(`/api/notifications/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setNotifications(notifications.filter((n) => n.id !== id));
            } else {
                console.error("Failed to delete notification");
            }
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            Loading notifications...
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

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                        <Bell className="w-8 h-8 text-blue-600" />
                        Notifications
                    </h1>
                </div>

                {notifications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">
                            You don't have any notifications yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-xl shadow-sm border transition p-6 ${
                                    !notification.read
                                        ? "border-l-4 border-blue-600"
                                        : "border-gray-100"
                                }`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {notification.title}
                                            </h3>
                                            {!notification.read && (
                                                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                                            )}
                                        </div>
                                        {notification.description && (
                                            <p className="text-gray-600 mt-2">
                                                {notification.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 mt-4">
                                            <span className="text-sm text-gray-500">
                                                {notification.type}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleDelete(notification.id)
                                        }
                                        className="ml-4 p-2 hover:bg-red-50 rounded-lg transition text-gray-500 hover:text-red-600">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
