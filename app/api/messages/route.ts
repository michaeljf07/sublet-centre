import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { messages, listings, notifications } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq, or, and } from "drizzle-orm";

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
        const listing = await db
            .select()
            .from(listings)
            .where(eq(listings.id, parseInt(listingId)))
            .limit(1);

        if (listing.length === 0) {
            return new Response(
                JSON.stringify({ error: "Listing not found" }),
                { status: 404 }
            );
        }

        // Create the message
        const newMessage = await db
            .insert(messages)
            .values({
                senderId: session.user.id,
                recipientId: listing[0].userId,
                listingId: parseInt(listingId),
                content,
            })
            .returning();

        // Create a notification for the recipient
        await db.insert(notifications).values({
            userId: listing[0].userId,
            type: "message",
            title: "New Message",
            description: `You have a new message about "${listing[0].title}"`,
            relatedId: newMessage[0].id,
        });

        return new Response(JSON.stringify(newMessage[0]), {
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
        let userMessages;
        if (conversationUserId) {
            userMessages = await db
                .select()
                .from(messages)
                .where(
                    or(
                        and(
                            eq(messages.senderId, session.user.id),
                            eq(messages.recipientId, conversationUserId)
                        ),
                        and(
                            eq(messages.senderId, conversationUserId),
                            eq(messages.recipientId, session.user.id)
                        )
                    )
                );
        } else {
            // Get all messages where user is either sender or recipient
            userMessages = await db
                .select()
                .from(messages)
                .where(
                    or(
                        eq(messages.senderId, session.user.id),
                        eq(messages.recipientId, session.user.id)
                    )
                );
        }

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
