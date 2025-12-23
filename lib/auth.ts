import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
}

export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

// Helper for API routes to get session from headers
export const auth = {
    api: {
        async getSession({ headers }: { headers: Headers }) {
            try {
                const authHeader = headers.get("Authorization");
                if (!authHeader) return null;

                const token = authHeader.replace("Bearer ", "");
                const { data, error } = await supabaseAuth.auth.getUser(token);

                if (error || !data.user) return null;

                return {
                    user: data.user,
                    session: { user: data.user },
                };
            } catch {
                return null;
            }
        },
    },
};
