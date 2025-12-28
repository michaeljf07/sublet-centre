"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { Listing } from "@/types";

interface HomeProps {
    initialListings?: Listing[];
}

export default function Home({ initialListings = [] }: HomeProps) {
    const [inputValue, setInputValue] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedListing, setSelectedListing] = useState<Listing | null>(
        null
    );
    const [listings, setListings] = useState<Listing[]>(initialListings);
    const [loading, setLoading] = useState<boolean>(
        initialListings.length === 0
    );
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>("most-recent");

    useEffect(() => {
        // Only fetch if we don't have initial listings
        if (initialListings.length > 0) {
            return;
        }

        async function fetchListings() {
            try {
                setLoading(true);
                const url = new URL("/api/listings", window.location.origin);
                if (searchTerm.trim()) {
                    url.searchParams.set("search", searchTerm);
                }
                const response = await fetch(url.toString());
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
        }

        fetchListings();
    }, []);

    // Fetch listings when search term changes (including empty to get all)
    useEffect(() => {
        // Skip if we just have initial listings and search hasn't been triggered
        if (initialListings.length > 0 && searchTerm === "") {
            return;
        }

        async function searchListings() {
            try {
                setLoading(true);
                const url = new URL("/api/listings", window.location.origin);
                if (searchTerm.trim()) {
                    url.searchParams.set("search", searchTerm);
                }
                const response = await fetch(url.toString());
                if (!response.ok) {
                    throw new Error("Failed to fetch listings");
                }
                const data = await response.json();

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
                        distance: "TBD",
                        poster: listing.poster_name || "User",
                    })
                );

                setListings(transformedListings);
                setError(null);
            } catch (err) {
                console.error("Error searching listings:", err);
                setError("Failed to load listings. Please try again later.");
                setListings([]);
            } finally {
                setLoading(false);
            }
        }

        searchListings();
    }, [searchTerm]);

    // Filter listings based on search term inputted by user (typed)
    const filteredListings = useMemo(() => {
        return listings;
    }, [listings]);

    // Sort listings based on the filter on browsing page
    const sortedListings = useMemo(() => {
        const listingsToSort = [...filteredListings];

        switch (sortBy) {
            case "price-low-to-high":
                return listingsToSort.sort((a, b) => a.price - b.price);
            case "price-high-to-low":
                return listingsToSort.sort((a, b) => b.price - a.price);
            case "move-in-date":
                return listingsToSort.sort((a, b) => {
                    const dateA = new Date(a.moveIn || 0).getTime();
                    const dateB = new Date(b.moveIn || 0).getTime();
                    return dateA - dateB;
                });
            case "most-recent":
            default:
                return listingsToSort;
        }
    }, [filteredListings, sortBy]);

    function handleSearch(term?: string) {
        setSearchTerm(term ?? inputValue);
    }

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
                    listings={sortedListings}
                    onSelectListing={setSelectedListing}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
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
