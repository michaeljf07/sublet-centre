import { Listing } from "@/types";
import { useRouter } from "next/navigation";

interface UserListingsProps {
    listings: Listing[];
    onDelete: (id: number) => void;
    onEdit: (listing: Listing) => void;
}

export function UserListings({
    listings,
    onDelete,
    onEdit,
}: UserListingsProps) {
    const router = useRouter();

    if (listings.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                    You haven't created any listings yet.
                </p>
                <button
                    onClick={() => router.push("/post-listing")}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 hover:cursor-pointer font-semibold transition-colors duration-200">
                    Create New Listing
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {listings.map((listing) => (
                <div
                    key={listing.id}
                    className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition border border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-medium text-gray-900 line-clamp-1">
                                {listing.title}
                            </h4>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                                {listing.address}
                            </p>
                            <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                                <span>${listing.price}/month</span>
                                <span>
                                    {listing.bedrooms} bed
                                    {listing.bedrooms > 1 ? "s" : ""}
                                </span>
                                <span>
                                    {listing.bathrooms} bath
                                    {listing.bathrooms > 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() =>
                                    router.push(`/listings/${listing.id}`)
                                }
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs md:text-sm font-medium hover:cursor-pointer transition whitespace-nowrap">
                                View
                            </button>
                            <button
                                onClick={() => onEdit(listing)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs md:text-sm font-medium hover:cursor-pointer transition whitespace-nowrap">
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(listing.id)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs md:text-sm font-medium hover:cursor-pointer transition whitespace-nowrap">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
