import { MapPin, Bed, Bath, Heart } from "lucide-react";
import { Listing } from "@/types";

interface ListingCardProps {
    listing: Listing;
    onSelect: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
    listing,
    onSelect,
}) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => onSelect(listing)}>
            <div className="relative">
                <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                />
                <button
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Handle favorite logic
                    }}>
                    <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {listing.moveIn} - {listing.moveOut}
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
                        {listing.distance}
                    </span>
                    <span className="text-sm text-gray-600">
                        by {listing.poster}
                    </span>
                </div>
            </div>
        </div>
    );
};
