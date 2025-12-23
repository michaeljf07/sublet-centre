"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";

export default function SignUpPage() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showConfirmationMessage, setShowConfirmationMessage] =
        useState<boolean>(false);
    const router = useRouter();

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            await signUp(email, password, name);
            setShowConfirmationMessage(true);
        } catch (err) {
            setError("Failed to create account. Email may already be in use.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
                    {showConfirmationMessage ? (
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                Check Your Email
                            </h2>
                            <p className="text-gray-600">
                                We've sent a confirmation email to{" "}
                                <span className="font-medium text-gray-900">
                                    {email}
                                </span>
                            </p>
                            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
                                <p className="font-medium">
                                    Please confirm your email address to
                                    activate your account.
                                </p>
                                <p className="mt-2">
                                    Click the link in the email to get started.
                                    If you don't see the email, check your spam
                                    folder.
                                </p>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={() => router.push("/auth")}
                                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700">
                                    Back to Sign In
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                                    Create Your Account
                                </h2>
                                <p className="mt-2 text-center text-sm text-gray-600">
                                    Join SubletCentre to find your next place
                                </p>
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={handleSignUp}>
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700">
                                        Email (use uwaterloo email)
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                        placeholder="you@uwaterloo.com"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 hover:cursor-pointer">
                                    {isLoading
                                        ? "Creating account..."
                                        : "Sign up"}
                                </button>
                            </form>

                            <p className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    href="/auth"
                                    className="text-blue-600 hover:text-blue-700 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
