import { Home, Bell, User, Menu } from "lucide-react";
import Link from "next/link";

export const Header = () => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <Link href="/" className="flex items-center space-x-2">
                            <Home className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">
                                SubletSync
                            </span>
                        </Link>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            UWaterloo
                        </span>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <button className="text-gray-700 hover:text-blue-600 font-medium hover:cursor-pointer">
                            Browse
                        </button>
                        <button className="text-gray-700 hover:text-blue-600 font-medium hover:cursor-pointer">
                            Post Listing
                        </button>
                        <button className="text-gray-700 hover:text-blue-600 font-medium hover:cursor-pointer">
                            Messages
                        </button>
                        <button className="text-gray-700 hover:text-blue-600 font-medium hover:cursor-pointer">
                            Saved
                        </button>
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full relative hover:cursor-pointer">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:cursor-pointer">
                            <User className="w-5 h-5" />
                            <span>Profile</span>
                        </button>
                    </div>

                    <button className="md:hidden">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};
