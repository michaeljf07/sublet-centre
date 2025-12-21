import { Listing } from "@/types";
import { useFavorites } from "@/lib/favorites-context";
import { Heart } from "lucide-react";

interface FavoritedListingsProps {
    listings: Listing[];
    onRemove: (id: number) => void;
}

export function FavoritedListings({
    listings,
    onRemove,
}: FavoritedListingsProps) {
    const { toggleFavorite } = useFavorites();

    const handleRemove = (id: number) => {
        toggleFavorite(id);
        onRemove(id);
    };

    if (listings.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600">
                    You haven't favorited any listings yet.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    Favorited Listings
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 p-4 md:p-6">
                {listings.map((listing) => (
                    <div
                        key={listing.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-200 transition-transform duration-300">
                        {listing.image && (
                            <img
                                src={listing.image}
                                alt={listing.title}
                                className="w-full h-32 md:h-40 object-cover"
                            />
                        )}
                        <div className="p-3 md:p-4">
                            <h4 className="font-medium text-gray-900 text-sm md:text-base line-clamp-2">
                                {listing.title}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-1">
                                {listing.address}
                            </p>
                            <div className="mt-3 flex items-center justify-between gap-2">
                                <span className="font-semibold text-gray-900 text-sm md:text-base">
                                    ${listing.price}/mo
                                </span>
                                <button
                                    onClick={() => handleRemove(listing.id)}
                                    className="p-2 hover:bg-red-50 rounded transition">
                                    <Heart className="w-4 md:w-5 h-4 md:h-5 fill-red-500 text-red-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
