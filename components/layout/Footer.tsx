import { Home } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Link
                            href="/"
                            className="flex items-center space-x-2 mb-4">
                            <Home className="w-6 h-6" />
                            <span className="text-xl font-bold">
                                SubletSync
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm">
                            The easiest way for UWaterloo students to find and
                            post sublets that sync with co-op schedules.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">For Renters</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link
                                    href="/listings"
                                    className="hover:text-white transition-colors">
                                    Browse Listings
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/saved"
                                    className="hover:text-white transition-colors">
                                    Saved Searches
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    How It Works
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">For Subletters</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link
                                    href="/post-listing"
                                    className="hover:text-white transition-colors">
                                    Post a Listing
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Pricing Guide
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Safety Tips
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Privacy Policy
                                </a>
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
