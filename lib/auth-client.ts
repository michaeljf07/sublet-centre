import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
});

export const signIn = async (email: string, password: string) => {
    return authClient.signIn.email({ email, password });
};

export const signUp = async (email: string, password: string, name: string) => {
    return authClient.signUp.email({ email, password, name });
};

export const signOut = async () => {
    return authClient.signOut();
};
