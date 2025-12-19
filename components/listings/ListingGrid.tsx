import { Listing } from "@/types";
import { ListingCard } from "./ListingCard";

interface ListingGridProps {
    listings: Listing[];
    onSelectListing: (listing: Listing) => void;
}

export const ListingGrid: React.FC<ListingGridProps> = ({
    listings,
    onSelectListing,
}) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {listings.length} Available Sublets
                </h2>
                <select className="px-4 py-2 border border-gray-600 rounded-lg text-gray-900">
                    <option>Most Recent</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Move-in Date</option>
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
