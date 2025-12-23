"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Bell, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { signOut, getSession, getAuthToken } from "@/lib/auth-client";

export const Header = () => {
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await getSession();
                setIsAuthenticated(!!data?.session?.user);

                if (data?.session?.user) {
                    // Fetch notifications with auth token
                    const token = await getAuthToken();
                    const headers: HeadersInit = {
                        "Content-Type": "application/json",
                    };
                    if (token) {
                        headers["Authorization"] = `Bearer ${token}`;
                    }
                    const response = await fetch("/api/notifications", {
                        headers,
                    });
                    if (response.ok) {
                        const notificationData = await response.json();
                        const unread = notificationData.filter(
                            (notif: any) => !notif.read
                        ).length;
                        setUnreadCount(unread);
                    }
                }
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();

        // Re-check auth when window regains focus
        const handleFocus = () => {
            checkAuth();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await signOut();
            setIsAuthenticated(false);
            router.push("/");
        } catch (error) {
            console.error("Sign out failed:", error);
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <Link href="/" className="flex items-center space-x-2">
                            <Home className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">
                                SubletCentre
                            </span>
                        </Link>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 ml-2 mt-1 rounded-full">
                            UWaterloo
                        </span>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        {isAuthenticated && (
                            <>
                                <Link
                                    href="/"
                                    className="text-gray-700 hover:text-blue-600 font-medium hover:cursor-pointer">
                                    Browse
                                </Link>
                                <Link
                                    href="/post-listing"
                                    className="text-gray-700 hover:text-blue-600 font-medium hover:cursor-pointer">
                                    Post Listing
                                </Link>
                                <Link
                                    href="/messages"
                                    className="text-gray-700 hover:text-blue-600 font-medium hover:cursor-pointer">
                                    Messages
                                </Link>
                                <Link
                                    href="/saved"
                                    className="text-gray-700 hover:text-blue-600 font-medium hover:cursor-pointer">
                                    Saved
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-700 hover:text-blue-600 font-medium hover:cursor-pointer">
                                    Dashboard
                                </Link>
                            </>
                        )}
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated && (
                            <Link
                                href="/notifications"
                                className="p-2 hover:bg-gray-100 rounded-full relative hover:cursor-pointer transition">
                                <Bell className="w-5 h-5 text-gray-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        <div className="relative">
                            {!isLoading &&
                                (isAuthenticated ? (
                                    <button
                                        onClick={() =>
                                            setShowProfileMenu(!showProfileMenu)
                                        }
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:cursor-pointer">
                                        <User className="w-5 h-5" />
                                        <span>Profile</span>
                                    </button>
                                ) : (
                                    <Link
                                        href="/auth"
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:cursor-pointer">
                                        <span>Sign In</span>
                                    </Link>
                                ))}
                            {showProfileMenu && isAuthenticated && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition hover:cursor-pointer">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        disabled={isSigningOut}
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition hover:cursor-pointer">
                                        {isSigningOut
                                            ? "Signing out..."
                                            : "Sign out"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="md:hidden p-2">
                        {showMobileMenu ? (
                            <X className="w-6 h-6 text-gray-600" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && isAuthenticated && (
                    <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
                        <Link
                            href="/"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setShowMobileMenu(false)}>
                            Browse
                        </Link>
                        <Link
                            href="/post-listing"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setShowMobileMenu(false)}>
                            Post Listing
                        </Link>
                        <Link
                            href="/messages"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setShowMobileMenu(false)}>
                            Messages
                        </Link>
                        <Link
                            href="/saved"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setShowMobileMenu(false)}>
                            Saved
                        </Link>
                        <Link
                            href="/notifications"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setShowMobileMenu(false)}>
                            Notifications{" "}
                            {unreadCount > 0 && `(${unreadCount})`}
                        </Link>
                        <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => setShowMobileMenu(false)}>
                            Dashboard
                        </Link>
                        <button
                            onClick={() => {
                                handleSignOut();
                                setShowMobileMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
