import { supabaseAuth } from "@/lib/auth";

export async function POST(request: Request) {
    const path = new URL(request.url).pathname.replace("/api/auth/", "");

    if (path === "sign-up") {
        const { email, password } = await request.json();
        const { data, error } = await supabaseAuth.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return new Response(JSON.stringify(data), { status: 200 });
    }

    if (path === "sign-in") {
        const { email, password } = await request.json();
        const { data, error } = await supabaseAuth.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return new Response(JSON.stringify(data), { status: 200 });
    }

    if (path === "sign-out") {
        const { error } = await supabaseAuth.auth.signOut();
        if (error) throw error;
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
    });
}

export async function GET(request: Request) {
    const path = new URL(request.url).pathname.replace("/api/auth/", "");

    if (path === "get-session") {
        const token = request.headers
            .get("Authorization")
            ?.replace("Bearer ", "");
        if (!token) {
            return new Response(JSON.stringify({ session: null }), {
                status: 200,
            });
        }

        const { data, error } = await supabaseAuth.auth.getUser(token);
        if (error || !data.user) {
            return new Response(JSON.stringify({ session: null }), {
                status: 200,
            });
        }

        return new Response(
            JSON.stringify({
                session: {
                    user: data.user,
                },
            }),
            { status: 200 }
        );
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
    });
}
