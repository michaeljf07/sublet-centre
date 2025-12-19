"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { Listing } from "@/types";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedListing, setSelectedListing] = useState<Listing | null>(
        null
    );

    // This would come from your API
    const listings: Listing[] = [
        {
            id: 1,
            title: "Sunny Studio in Midtown",
            description:
                "A bright, modern studio apartment close to public transport.",
            price: 1800,
            address: "123 Midtown Ave, New York, NY",
            moveIn: "2024-07-01",
            moveOut: "2024-12-31",
            bedrooms: 1,
            bathrooms: 1,
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            amenities: ["WiFi", "Laundry", "Gym"],
            distance: "0.5 mi from campus",
            poster: "Alice",
        },
        {
            id: 2,
            title: "Spacious 2BR with Balcony",
            description:
                "Large two-bedroom apartment with a private balcony and city views.",
            price: 2500,
            address: "456 Uptown Blvd, New York, NY",
            moveIn: "2024-08-15",
            moveOut: "2025-01-15",
            bedrooms: 2,
            bathrooms: 2,
            image: "https://images.unsplash.com/photo-1464983953574-0892a716854b",
            amenities: ["Balcony", "Parking", "Pet Friendly"],
            distance: "1.2 mi from campus",
            poster: "Bob",
        },
        {
            id: 3,
            title: "Cozy Room in Shared Flat",
            description:
                "Private room in a friendly, shared apartment. Utilities included.",
            price: 950,
            address: "789 Downtown Rd, New York, NY",
            moveIn: "2024-09-01",
            moveOut: "2025-05-31",
            bedrooms: 1,
            bathrooms: 1,
            image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
            amenities: ["Utilities Included", "Shared Kitchen", "Furnished"],
            distance: "0.8 mi from campus",
            poster: "Carol",
        },
    ];

    const handleSearch = () => {
        // Implement search logic
        console.log("Searching for:", searchTerm);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Hero
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
            />
            <ListingGrid
                listings={listings}
                onSelectListing={setSelectedListing}
            />
            <Footer />
        </div>
    );
}
