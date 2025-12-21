import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

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

        const userNotifications = await db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, session.user.id));

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

        const newNotification = await db
            .insert(notifications)
            .values({
                userId: session.user.id,
                type,
                title,
                description,
                relatedId,
            })
            .returning();

        return new Response(JSON.stringify(newNotification[0]), {
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
