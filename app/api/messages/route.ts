import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";

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
        const { content, listingId } = body;

        if (!content || !listingId) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        // Get the listing to find the recipient
        const { data: listing, error: listingError } = await supabaseAdmin
            .from("listings")
            .select("userId, title")
            .eq("id", parseInt(listingId))
            .single();

        if (listingError || !listing) {
            return new Response(
                JSON.stringify({ error: "Listing not found" }),
                { status: 404 }
            );
        }

        // Create the message
        const { data: newMessage, error: messageError } = await supabaseAdmin
            .from("messages")
            .insert([
                {
                    senderId: session.user.id,
                    recipientId: listing.userId,
                    listingId: parseInt(listingId),
                    content,
                },
            ])
            .select()
            .single();

        if (messageError) throw messageError;

        // Create a notification for the recipient
        await supabaseAdmin.from("notifications").insert([
            {
                userId: listing.userId,
                type: "message",
                title: "New Message",
                description: `You have a new message about "${listing.title}"`,
                relatedId: newMessage.id,
            },
        ]);

        return new Response(JSON.stringify(newMessage), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to send message:", error);
        return new Response(
            JSON.stringify({ error: "Failed to send message" }),
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const { searchParams } = new URL(request.url);
        const conversationUserId = searchParams.get("userId");

        // Get messages between the current user and the specified user
        let query = supabaseAdmin.from("messages").select("*");

        if (conversationUserId) {
            query = query.or(
                `and(senderId.eq.${session.user.id},recipientId.eq.${conversationUserId}),` +
                    `and(senderId.eq.${conversationUserId},recipientId.eq.${session.user.id})`
            );
        } else {
            query = query.or(
                `senderId.eq.${session.user.id},recipientId.eq.${session.user.id}`
            );
        }

        const { data: userMessages, error } = await query;

        if (error) throw error;

        return new Response(JSON.stringify(userMessages), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch messages" }),
            { status: 500 }
        );
    }
}
