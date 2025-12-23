import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";

export async function GET(request: Request) {
    try {
        const requestHeaders = await headers();
        const session = await auth.api.getSession({
            headers: requestHeaders,
        });

        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const { data: userNotifications, error } = await supabaseAdmin
            .from("notifications")
            .select("*")
            .eq("user_id", session.user.id);

        if (error) throw error;

        return new Response(JSON.stringify(userNotifications), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch notifications" }),
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const body = await request.json();
        const { type, title, description, relatedId } = body;

        if (!type || !title) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        const { data: newNotification, error } = await supabaseAdmin
            .from("notifications")
            .insert([
                {
                    userId: session.user.id,
                    type,
                    title,
                    description,
                    relatedId,
                },
            ])
            .select()
            .single();

        if (error) throw error;

        return new Response(JSON.stringify(newNotification), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to create notification:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create notification" }),
            { status: 500 }
        );
    }
}
