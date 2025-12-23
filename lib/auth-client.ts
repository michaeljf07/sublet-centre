import { supabaseAuth } from "./auth";
import { supabaseClient } from "./supabase";

// Make sure supabase auth is using proper session storage on client
if (typeof window !== "undefined") {
    // Session is already persisted by default in Supabase
}

export const signIn = async (email: string, password: string) => {
    return supabaseAuth.auth.signInWithPassword({
        email,
        password,
    });
};

export const signUp = async (email: string, password: string, name: string) => {
    return supabaseAuth.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
            },
        },
    });
};

export const signOut = async () => {
    return supabaseAuth.auth.signOut();
};

export const getSession = async () => {
    return supabaseClient.auth.getSession();
};

export const getAuthToken = async () => {
    const { data } = await supabaseClient.auth.getSession();
    return data?.session?.access_token;
};
