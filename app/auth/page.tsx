"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";

export default function AuthPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const router = useRouter();

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await signIn(email, password);
            if (response.error) {
                setError("Incorrect email or password");
                return;
            }
            // Wait a moment for session to be established, then refresh
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        } catch (err: any) {
            setError("Incorrect email or password");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-6 md:space-y-8 bg-white p-6 md:p-8 rounded-xl shadow-md">
                    <div>
                        <h2 className="mt-2 md:mt-6 text-center text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                            Sign in to SubletSync
                        </h2>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSignIn}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 hover:cursor-pointer">
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            href="/auth/signup"
                            className="text-blue-600 hover:text-blue-700">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
