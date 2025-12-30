import { Listing } from "@/types";
import { ListingCard } from "./ListingCard";
import { Dispatch, SetStateAction } from "react";

interface ListingGridProps {
    listings: Listing[];
    onSelectListing: (listing: Listing) => void;
    sortBy?: string;
    onSortChange?: Dispatch<SetStateAction<string>>;
}

export const ListingGrid: React.FC<ListingGridProps> = ({
    listings,
    onSelectListing,
    sortBy = "most-recent",
    onSortChange,
}) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Available Sublets
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        {listings.length} properties found
                    </p>
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange?.(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option value="most-recent">Most Recent</option>
                    <option value="price-low-to-high">
                        Price: Low to High
                    </option>
                    <option value="price-high-to-low">
                        Price: High to Low
                    </option>
                    <option value="move-in-date">Move-in Date</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        listing={listing}
                        onSelect={onSelectListing}
                    />
                ))}
            </div>
        </div>
    );
};
