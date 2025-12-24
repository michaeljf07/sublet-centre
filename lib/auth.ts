import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
}

export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

const supabaseAdminAuth = createClient(
    supabaseUrl,
    supabaseServiceRoleKey || supabaseAnonKey
);

// Helper to for API route authentication
export const auth = {
    api: {
        async getSession({ headers }: { headers: Headers }) {
            try {
                const authHeader =
                    headers.get("Authorization") ||
                    headers.get("authorization");
                if (!authHeader) {
                    return null;
                }

                const token = authHeader.replace("Bearer ", "");
                const { data, error } = await supabaseAdminAuth.auth.getUser(
                    token
                );

                if (error) {
                    return null;
                }

                if (!data.user) {
                    return null;
                }

                return {
                    user: data.user,
                    session: { user: data.user },
                };
            } catch (error) {
                return null;
            }
        },
    },
};
