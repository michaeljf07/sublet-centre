"use client";

import { authClient } from "./auth-client";

export const getSession = async () => {
    try {
        const data = await authClient.getSession();
        return data;
    } catch (error) {
        console.error("Session error:", error);
        return null;
    }
};

export const useSession = () => {
    return authClient.useSession();
};
