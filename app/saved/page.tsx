"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { useFavorites } from "@/lib/favorites-context";
import { Listing } from "@/types";

export default function SavedPage() {
    const { favorites } = useFavorites();
    const [selectedListing, setSelectedListing] = useState<Listing | null>(
        null
    );
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchListings() {
            try {
                setLoading(true);
                const response = await fetch("/api/listings");
                if (!response.ok) {
                    throw new Error("Failed to fetch listings");
                }
                const data = await response.json();

                // Transform database listings to match Listing interface
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

                setListings(transformedListings);
                setError(null);
            } catch (err) {
                console.error("Error fetching listings:", err);
                setError("Failed to load listings. Please try again later.");
                setListings([]);
            } finally {
                setLoading(false);
            }
        }

        fetchListings();
    }, []);

    // Filter to only show favorited listings
    const savedListings = useMemo(() => {
        return listings.filter((listing) => favorites.has(listing.id));
    }, [favorites, listings]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Saved Listings
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {savedListings.length} listing
                        {savedListings.length !== 1 ? "s" : ""} saved
                    </p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-600">Loading listings...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : savedListings.length > 0 ? (
                    <ListingGrid
                        listings={savedListings}
                        onSelectListing={setSelectedListing}
                    />
                ) : (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No saved listings yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Start favoriting listings to save them for later
                        </p>
                        <a
                            href="/"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition">
                            Browse Listings
                        </a>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
