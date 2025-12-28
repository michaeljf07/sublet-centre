import { Search } from "lucide-react";
import { useState } from "react";

interface HeroProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onSearch: () => void;
}

export const Hero: React.FC<HeroProps> = ({
    searchTerm,
    onSearchChange,
    onSearch,
}) => {
    const [selectedTerm, setSelectedTerm] = useState<string>("All Terms");

    const handleTermChange = (term: string) => {
        setSelectedTerm(term);
        if (term !== "All Terms") {
            onSearchChange(term);
            // Trigger search immediately when a term is selected
            setTimeout(() => {
                onSearch();
            }, 0);
        } else {
            onSearchChange("");
        }
    };
    return (
        <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Find Your Perfect Sublet
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-blue-100">
                        Housing solutions that sync with your co-op schedule
                    </p>

                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4">
                        <div className="flex flex-col gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by location or keyword..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500">
                                    <option>All Terms</option>
                                    <option>Spring 2026</option>
                                    <option>Fall 2026</option>
                                    <option>Winter 2026</option>
                                </select>
                                <button
                                    onClick={onSearch}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium hover:cursor-pointer transition">
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
