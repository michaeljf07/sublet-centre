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
        const checkAuth = async () => {
            try {
                const { data } = await getSession();
                setIsAuthenticated(!!data?.session?.user);
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, []);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push("/auth");
            return;
        }

        toggleFavorite(listing.id);
    };

    const handleCardClick = () => {
        router.push(`/listings/${listing.id}`);
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:shadow-blue-200 transition-transform cursor-pointer hover:scale-105 duration-300"
            onClick={handleCardClick}>
            <div className="relative">
                <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                />
                <button
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 hover:cursor-pointer transition"
                    onClick={handleFavoriteClick}>
                    <Heart
                        className={`w-5 h-5 hover:scale-110 duration-300 transition transform ${
                            isLiked
                                ? "fill-red-500 text-red-500"
                                : "text-gray-600"
                        }`}
                    />
                </button>
                <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {formatDate(listing.moveIn)} - {formatDate(listing.moveOut)}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                        {listing.title}
                    </h3>
                    <span className="text-xl font-bold text-blue-600">
                        ${listing.price}/mo
                    </span>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{listing.address}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{listing.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span>{listing.bathrooms} bath</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    {listing.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {amenity}
                        </span>
                    ))}
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {listing.distance} from campus
                    </span>
                    <span className="text-sm text-gray-600">
                        by {listing.poster}
                    </span>
                </div>
            </div>
        </div>
    );
};
