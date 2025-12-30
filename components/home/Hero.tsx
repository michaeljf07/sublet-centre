import { Search } from "lucide-react";
import { useState } from "react";

interface HeroProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onSearch: (term?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
    searchTerm,
    onSearchChange,
    onSearch,
}) => {
    const [selectedTerm, setSelectedTerm] = useState<string>("All Terms");

    function handleTermChange(term: string) {
        setSelectedTerm(term);
        if (term !== "All Terms") {
            onSearchChange(term);
            onSearch(term);
        } else {
            onSearchChange("");
            onSearch("");
        }
    }
    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-14 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-3 tracking-tight">
                        Find Your Perfect Sublet
                    </h1>
                    <p className="text-lg md:text-lg mb-10 text-blue-100">
                        Housing solutions that sync with your co-op schedule
                    </p>

                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-6">
                        <div className="flex flex-col gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by location or keyword..."
                                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        onSearchChange(e.target.value)
                                    }
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            onSearch();
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <select
                                    value={selectedTerm}
                                    onChange={(e) =>
                                        handleTermChange(e.target.value)
                                    }
                                    className="flex-1 px-4 py-3.5 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                    <option>All Terms</option>
                                    <option>Spring 2026</option>
                                    <option>Fall 2026</option>
                                    <option>Winter 2026</option>
                                </select>
                                <button
                                    onClick={() => onSearch()}
                                    className="px-8 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold hover:cursor-pointer transition-colors duration-200">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
