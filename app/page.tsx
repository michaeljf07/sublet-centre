"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { Listing } from "@/types";

export default function Home() {
    const [inputValue, setInputValue] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedListing, setSelectedListing] = useState<Listing | null>(
        null
    );
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
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
                        moveIn: listing.move_in,
                        moveOut: listing.move_out,
                        bedrooms: listing.bedrooms,
                        bathrooms: listing.bathrooms,
                        image: listing.image,
                        amenities: listing.amenities || [],
                        distance: "TBD", // fix later with real distance calculation
                        poster: listing.poster_name || "User",
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
        };

        fetchListings();
    }, []);

    // Filter listings based on search term
    const filteredListings = useMemo(() => {
        if (!searchTerm.trim()) {
            return listings;
        }

        const term = searchTerm.toLowerCase();
        return listings.filter(
            (listing) =>
                listing.title.toLowerCase().includes(term) ||
                listing.description.toLowerCase().includes(term) ||
                listing.address.toLowerCase().includes(term) ||
                listing.amenities.some((amenity) =>
                    amenity.toLowerCase().includes(term)
                )
        );
    }, [searchTerm, listings]);

    const handleSearch = () => {
        setSearchTerm(inputValue);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Hero
                searchTerm={inputValue}
                onSearchChange={setInputValue}
                onSearch={handleSearch}
            />
            {loading ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <p className="text-gray-600">Loading listings...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            ) : filteredListings.length > 0 ? (
                <ListingGrid
                    listings={filteredListings}
                    onSelectListing={setSelectedListing}
                />
            ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No listings found
                        </h3>
                        <p className="text-gray-600">
                            Try adjusting your search terms or{" "}
                            <button
                                onClick={() => setSearchTerm("")}
                                className="text-blue-600 hover:text-blue-700 font-medium">
                                view all listings
                            </button>
                        </p>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
