import { Home } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Home className="w-6 h-6" />
                            <span className="text-xl font-bold">
                                SubletSync
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            The easiest way for UWaterloo students to find and
                            post sublets that sync with co-op schedules.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">For Renters</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="hover:text-white cursor-pointer">
                                Browse Listings
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                Saved Searches
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                How It Works
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">For Subletters</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="hover:text-white cursor-pointer">
                                Post a Listing
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                Pricing Guide
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                Safety Tips
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="hover:text-white cursor-pointer">
                                Help Center
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                Contact Us
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                Terms of Service
                            </li>
                            <li className="hover:text-white cursor-pointer">
                                Privacy Policy
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>
                        © 2025 SubletSync. Made for UWaterloo students, by
                        UWaterloo students.
                    </p>
                </div>
            </div>
        </footer>
    );
}
