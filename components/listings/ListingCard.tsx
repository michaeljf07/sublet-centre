import { MapPin, Bed, Bath, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Listing } from "@/types";
import { useFavorites } from "@/lib/favorites-context";
import { getSession } from "@/lib/auth-client";

interface ListingCardProps {
    listing: Listing;
    onSelect: (listing: Listing) => void;
}

function formatDate(date: string | Date | null | undefined): string {
    if (!date) {
        return "TBD";
    }
    let dateObj: Date;
    if (typeof date === "string") {
        dateObj = new Date(date);
    } else {
        dateObj = date;
    }
    if (isNaN(dateObj.getTime())) {
        return "TBD";
    }
    return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export const ListingCard: React.FC<ListingCardProps> = ({
    listing,
    onSelect,
}) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const isLiked = isFavorite(listing.id);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            try {
                const { data } = await getSession();
                setIsAuthenticated(!!data?.session?.user);
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setIsCheckingAuth(false);
            }
        }

        checkAuth();
    }, []);

    function handleFavoriteClick(e: React.MouseEvent) {
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push("/auth");
            return;
        }

        toggleFavorite(listing.id);
    }

    function handleCardClick() {
        router.push(`/listings/${listing.id}`);
    }

    return (
        <div
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
            onClick={handleCardClick}>
            <div className="relative overflow-hidden bg-gray-100">
                <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <button
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 hover:cursor-pointer transition-all"
                    onClick={handleFavoriteClick}>
                    <Heart
                        className={`w-5 h-5 transition-all duration-300 ${
                            isLiked
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                        }`}
                    />
                </button>
                <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    {formatDate(listing.moveIn)} - {formatDate(listing.moveOut)}
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="font-semibold text-base text-gray-900 line-clamp-2">
                        {listing.title}
                    </h3>
                    <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
                        ${listing.price}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">/month</p>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="line-clamp-1">{listing.address}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                    <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1.5" />
                        <span>{listing.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1.5" />
                        <span>{listing.bathrooms} bath</span>
                    </div>
                </div>

                {listing.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {listing.amenities.slice(0, 2).map((amenity, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                {amenity}
                            </span>
                        ))}
                        {listing.amenities.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{listing.amenities.length - 2}
                            </span>
                        )}
                    </div>
                )}

                <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <span>by {listing.poster}</span>
                </div>
            </div>
        </div>
    );
};
