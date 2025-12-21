import { signOut } from "@/lib/auth-client";

interface AccountInformationProps {
    user: {
        id: string;
        name: string | null;
        email: string;
        image?: string | null;
    };
}

export function AccountInformation({ user }: AccountInformationProps) {
    const handleSignOut = async () => {
        await signOut();
        window.location.href = "/";
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    Account Information
                </h3>
            </div>
            <div className="px-6 py-6">
                <div className="flex items-center space-x-4 mb-6">
                    {user.image && (
                        <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <h4 className="text-lg font-medium text-gray-900">
                            {user.name || "User"}
                        </h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block">
                            Email
                        </label>
                        <p className="mt-1 text-gray-900">{user.email}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block">
                            Name
                        </label>
                        <p className="mt-1 text-gray-900">
                            {user.name || "Not provided"}
                        </p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                        onClick={handleSignOut}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 font-medium transition hover:cursor-pointer">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
