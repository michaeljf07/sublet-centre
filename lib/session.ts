"use client";

import { getSession as getSupabaseSession } from "./auth-client";

export const getSession = async () => {
    try {
        const data = await getSupabaseSession();
        return data;
    } catch (error) {
        console.error("Session error:", error);
        return null;
    }
};
