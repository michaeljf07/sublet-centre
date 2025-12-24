import { supabaseAuth } from "./auth";
import { supabaseClient } from "./supabase";

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
