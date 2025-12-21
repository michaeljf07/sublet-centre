"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Listing } from "@/types";
import { Heart, MapPin, Bed, Bath, Send } from "lucide-react";
import { useFavorites } from "@/lib/favorites-context";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

function formatDate(date: string | Date): string {
    let dateObj: Date;
    if (typeof date === "string") {
        dateObj = new Date(date);
    } else {
        dateObj = date;
    }
    return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { isFavorite, toggleFavorite } = useFavorites();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [messageContent, setMessageContent] = useState("");
    const [sending, setSending] = useState(false);
    const [user, setUser] = useState<any>(null);
    const isLiked = listing ? isFavorite(listing.id) : false;

    useEffect(() => {
        async function checkAuth() {
            try {
                const session = await authClient.getSession();
                setUser(session?.data?.user || null);
            } catch (error) {
                console.error("Auth check failed:", error);
            }
        }
        checkAuth();
    }, []);

    useEffect(() => {
        async function fetchListing() {
            try {
                setLoading(true);
                const response = await fetch(`/api/listings/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch listing");
                }
                const data = await response.json();

                const transformedListing: Listing = {
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    price: parseFloat(data.price),
                    address: data.address,
                    moveIn: data.moveIn,
                    moveOut: data.moveOut,
                    bedrooms: data.bedrooms,
                    bathrooms: data.bathrooms,
                    image: data.image,
                    amenities: data.amenities || [],
                    distance: "TBD",
                    poster: data.posterName || "User",
                };

                setListing(transformedListing);
            } catch (error) {
                console.error("Error fetching listing:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchListing();
    }, [id]);

    async function handleSendMessage() {
        if (!messageContent.trim() || !user) {
            alert("Please log in and enter a message");
            return;
        }

        try {
            setSending(true);
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipientId: listing?.id,
                    content: messageContent,
                    listingId: id,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            setMessageContent("");
            alert("Message sent successfully!");
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        } finally {
            setSending(false);
        }
    }

    async function handleFavoriteClick() {
        if (!user) {
            router.push("/auth");
            return;
        }
        if (listing) {
            toggleFavorite(listing.id);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-900">Loading listing...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Listing not found
                        </h2>
                        <Link
                            href="/"
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                            Back to listings
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/"
                    className="my-4 px-6 py-4 text-blue-600 rounded-lg cursor-pointer">
                    ← Back to listings
                </Link>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8">
                        <div>
                            {listing.image && (
                                <img
                                    src={listing.image}
                                    alt={listing.title}
                                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                                />
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between items-start mb-4 gap-4">
                                <div className="min-w-0">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 wrap-break-word">
                                        {listing.title}
                                    </h1>
                                    <div className="flex items-start text-gray-600 mb-4 gap-2">
                                        <MapPin className="w-5 h-5 mr-1 shrink-0 mt-0.5" />
                                        <span className="wrap-break-word">
                                            {listing.address}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleFavoriteClick}
                                    className="p-2 hover:bg-gray-100 rounded-full">
                                    <Heart
                                        className={`w-8 h-8 ${
                                            isLiked
                                                ? "fill-red-500 text-red-500"
                                                : "text-gray-600"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-blue-600">
                                    ${listing.price}
                                </span>
                                <span className="text-gray-900 ml-2">
                                    /month
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center">
                                    <Bed className="w-5 h-5 mr-2 text-gray-900" />
                                    <span className="text-gray-900">
                                        {listing.bedrooms} Bedroom(s)
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Bath className="w-5 h-5 mr-2 text-gray-900" />
                                    <span className="text-gray-900">
                                        {listing.bathrooms} Bathroom(s)
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-600 pt-6 mb-6">
                                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                                    Available Dates
                                </h3>
                                <div className="space-y-2 text-gray-900">
                                    <p>
                                        <strong>Move-in:</strong>{" "}
                                        {formatDate(listing.moveIn)}
                                    </p>
                                    <p>
                                        <strong>Move-out:</strong>{" "}
                                        {formatDate(listing.moveOut)}
                                    </p>
                                </div>
                            </div>

                            {listing.amenities.length > 0 && (
                                <div className="border-t border-gray-600 pt-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900">
                                        Amenities
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {listing.amenities.map(
                                            (amenity, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                    {amenity}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 p-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">
                            About
                        </h2>
                        <p className="text-gray-900 leading-relaxed">
                            {listing.description}
                        </p>
                    </div>

                    <div className="border-t border-gray-200 p-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">
                            Contact Poster
                        </h2>
                        <div className="mb-6">
                            <p className="text-gray-900">
                                Interested in this listing? Send a message to{" "}
                                <strong>{listing.poster}</strong>
                            </p>
                        </div>

                        {user ? (
                            <div className="space-y-4">
                                <textarea
                                    value={messageContent}
                                    onChange={(e) =>
                                        setMessageContent(e.target.value)
                                    }
                                    placeholder="Type your message..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-600"
                                    rows={4}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={sending}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 font-medium">
                                    <Send className="w-5 h-5" />
                                    {sending ? "Sending..." : "Send Message"}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => router.push("/auth")}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
                                Sign in to message
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
