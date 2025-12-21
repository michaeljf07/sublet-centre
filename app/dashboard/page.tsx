"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { UserListings } from "@/components/dashboard/UserListings";
import { FavoritedListings } from "@/components/dashboard/FavoritedListings";
import { AccountInformation } from "@/components/dashboard/AccountInformation";
import { authClient } from "@/lib/auth-client";
import { useFavorites } from "@/lib/favorites-context";
import { Listing } from "@/types";

export default function DashboardPage() {
    const router = useRouter();
    const { favorites } = useFavorites();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userListings, setUserListings] = useState<Listing[]>([]);
    const [favoritedListings, setFavoritedListings] = useState<Listing[]>([]);
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [activeTab, setActiveTab] = useState<
        "listings" | "favorites" | "account"
    >("listings");

    useEffect(() => {
        async function checkAuth() {
            try {
                const session = await authClient.getSession();
                if (!session?.data?.user) {
                    router.push("/auth");
                    return;
                }
                setUser(session.data.user);

                // Fetch all listings first
                const allListingsResponse = await fetch("/api/listings");
                if (allListingsResponse.ok) {
                    const data = await allListingsResponse.json();
                    const transformedListings: Listing[] = data.map(
                        (listing: any) => ({
                            id: listing.id,
                            title: listing.title,
                            description: listing.description,
                            price: parseFloat(listing.price),
                            address: listing.address,
                            moveIn: listing.moveIn,
                            moveOut: listing.moveOut,
                            bedrooms: listing.bedrooms,
                            bathrooms: listing.bathrooms,
                            image: listing.image,
                            amenities: listing.amenities || [],
                            distance: "TBD",
                            poster: listing.posterName || "User",
                        })
                    );
                    setAllListings(transformedListings);
                }

                // Fetch user's own listings
                const listingsResponse = await fetch(
                    `/api/listings?userId=${session.data.user.id}`
                );
                if (listingsResponse.ok) {
                    const data = await listingsResponse.json();
                    const transformedListings: Listing[] = data.map(
                        (listing: any) => ({
                            id: listing.id,
                            title: listing.title,
                            description: listing.description,
                            price: parseFloat(listing.price),
                            address: listing.address,
                            moveIn: listing.moveIn,
                            moveOut: listing.moveOut,
                            bedrooms: listing.bedrooms,
                            bathrooms: listing.bathrooms,
                            image: listing.image,
                            amenities: listing.amenities || [],
                            distance: "TBD",
                            poster: listing.posterName || "You",
                        })
                    );
                    setUserListings(transformedListings);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                router.push("/auth");
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [router]);

    // Update favorited listings when favorites change
    useEffect(() => {
        const favorited = allListings.filter((listing) =>
            favorites.has(listing.id)
        );
        setFavoritedListings(favorited);
    }, [favorites, allListings]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
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
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Welcome, {user.name || user.email}!
                    </h1>
                    <p className="mt-2 text-gray-600 text-sm md:text-base">
                        Manage your listings, favorites, and account settings
                    </p>
                </div>

                <div className="mb-6 border-b border-gray-200 overflow-x-auto">
                    <nav
                        className="flex space-x-4 md:space-x-8"
                        aria-label="Tabs">
                        {(["listings", "favorites", "account"] as const).map(
                            (tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-xs md:text-sm capitalize transition hover:cursor-pointer whitespace-nowrap ${
                                        activeTab === tab
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}>
                                    {tab}
                                </button>
                            )
                        )}
                    </nav>
                </div>

                <div className="space-y-6">
                    {activeTab === "listings" && (
                        <UserListings
                            listings={userListings}
                            onDelete={async (id) => {
                                try {
                                    const response = await fetch(
                                        `/api/listings/${id}`,
                                        {
                                            method: "DELETE",
                                        }
                                    );
                                    if (!response.ok) {
                                        throw new Error(
                                            "Failed to delete listing"
                                        );
                                    }
                                    setUserListings(
                                        userListings.filter((l) => l.id !== id)
                                    );
                                } catch (error) {
                                    console.error(
                                        "Error deleting listing:",
                                        error
                                    );
                                    alert("Failed to delete listing");
                                }
                            }}
                            onEdit={(listing) => {
                                router.push(`/post-listing?id=${listing.id}`);
                            }}
                        />
                    )}

                    {activeTab === "favorites" && (
                        <FavoritedListings
                            listings={favoritedListings}
                            onRemove={(id) => {
                                setFavoritedListings(
                                    favoritedListings.filter((l) => l.id !== id)
                                );
                            }}
                        />
                    )}

                    {activeTab === "account" && (
                        <AccountInformation user={user} />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
