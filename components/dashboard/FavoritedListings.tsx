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

    function handleRemove(id: number) {
        toggleFavorite(id);
        onRemove(id);
    }

    if (listings.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">
                    You haven't favorited any listings yet.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
                <div
                    key={listing.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
                    {listing.image && (
                        <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-40 object-cover"
                        />
                    )}
                    <div className="p-4">
                        <h4 className="font-medium text-gray-900 text-base line-clamp-2">
                            {listing.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {listing.address}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="font-semibold text-gray-900 text-base">
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
    );
}
