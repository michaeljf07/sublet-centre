"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSession, getAuthToken } from "@/lib/auth-client";

export default function PostListingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("id");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        address: "",
        moveIn: "",
        moveOut: "",
        bedrooms: "",
        bathrooms: "",
        image: "",
        amenities: [] as string[],
    });

    const amenityOptions = [
        "WiFi",
        "Laundry",
        "Gym",
        "Parking",
        "Pet Friendly",
        "Utilities Included",
        "Furnished",
        "Balcony",
        "Kitchen",
        "Air Conditioning",
        "Heating",
        "Dishwasher",
    ];

    useEffect(() => {
        async function checkAuth() {
            try {
                const { data } = await getSession();
                if (!data?.session?.user) {
                    router.push("/auth");
                    return;
                }
                setIsAuthenticated(true);

                // If editing, fetch the listing data
                if (editId) {
                    const response = await fetch(`/api/listings/${editId}`);
                    if (!response.ok) {
                        throw new Error("Failed to load listing");
                    }
                    const listing = await response.json();

                    // Format dates for input fields
                    const moveInDate = listing.moveIn
                        ? new Date(listing.moveIn).toISOString().split("T")[0]
                        : "";
                    const moveOutDate = listing.moveOut
                        ? new Date(listing.moveOut).toISOString().split("T")[0]
                        : "";

                    setFormData({
                        title: listing.title,
                        description: listing.description,
                        price: listing.price,
                        address: listing.address,
                        moveIn: moveInDate,
                        moveOut: moveOutDate,
                        bedrooms: listing.bedrooms.toString(),
                        bathrooms: listing.bathrooms.toString(),
                        image: listing.image || "",
                        amenities: listing.amenities || [],
                    });
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                router.push("/auth");
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, [router, editId]);

    function handleInputChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleAddAmenity(amenity: string) {
        if (!formData.amenities.includes(amenity)) {
            setFormData((prev) => ({
                ...prev,
                amenities: [...prev.amenities, amenity],
            }));
        }
    }

    function handleRemoveAmenity(amenity: string) {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.filter((a) => a !== amenity),
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        // Validation
        if (
            !formData.title ||
            !formData.description ||
            !formData.price ||
            !formData.address ||
            !formData.moveIn ||
            !formData.moveOut ||
            !formData.bedrooms ||
            !formData.bathrooms
        ) {
            setError("Please fill in all required fields");
            setIsSubmitting(false);
            return;
        }

        if (new Date(formData.moveIn) >= new Date(formData.moveOut)) {
            setError("Move-out date must be after move-in date");
            setIsSubmitting(false);
            return;
        }

        try {
            const listingData = {
                ...formData,
                price: parseFloat(formData.price),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseInt(formData.bathrooms),
            };

            let token = await getAuthToken();

            if (!token) {
                const sessionResult = await getSession();
                token = sessionResult?.data?.session?.access_token;
                if (!token) {
                    throw new Error("Not authenticated - please sign in again");
                }
            }

            const url = editId ? `/api/listings/${editId}` : "/api/listings";
            const method = editId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(listingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error ||
                        `Failed to ${editId ? "update" : "create"} listing`
                );
            }

            // Redirect to dashboard on success
            router.push("/dashboard?tab=listings");
        } catch (err: any) {
            setError(
                err.message ||
                    `Failed to ${
                        editId ? "update" : "create"
                    } listing. Please try again.`
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
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

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {editId ? "Edit Listing" : "Post a New Listing"}
                    </h1>
                    <p className="mt-2 text-gray-600 text-sm md:text-base">
                        {editId
                            ? "Update your listing details"
                            : "Share your sublet opportunity with other students"}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-lg shadow p-4 md:p-6 space-y-6">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Listing Title{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Sunny Studio in Midtown"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your sublet..."
                            rows={4}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monthly Price (CAD){" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="1500"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="e.g., 123 King St W, Waterloo, ON"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Move-in Date{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="moveIn"
                                value={formData.moveIn}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Move-out Date{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="moveOut"
                                value={formData.moveOut}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bedrooms <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleInputChange as any}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500">
                                <option value="">Select...</option>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {num} Bedroom{num > 1 ? "s" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bathrooms{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleInputChange as any}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500">
                                <option value="">Select...</option>
                                {[1, 1.5, 2, 2.5, 3].map((num) => (
                                    <option key={num} value={num}>
                                        {num} Bathroom{num > 1 ? "s" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amenities
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {amenityOptions.map((amenity) => (
                                <button
                                    key={amenity}
                                    type="button"
                                    onClick={() => {
                                        if (
                                            formData.amenities.includes(amenity)
                                        ) {
                                            handleRemoveAmenity(amenity);
                                        } else {
                                            handleAddAmenity(amenity);
                                        }
                                    }}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition hover:cursor-pointer ${
                                        formData.amenities.includes(amenity)
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}>
                                    {amenity}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-600">
                            Selected: {formData.amenities.join(", ") || "None"}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition hover:cursor-pointer">
                            {isSubmitting
                                ? editId
                                    ? "Saving..."
                                    : "Publishing..."
                                : editId
                                ? "Save Changes"
                                : "Publish Listing"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 font-medium transition hover:cursor-pointer">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}
