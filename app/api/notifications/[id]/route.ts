import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const notificationId = parseInt(params.id);

        // Verify the notification belongs to the user
        const notification = await db
            .select()
            .from(notifications)
            .where(
                and(
                    eq(notifications.id, notificationId),
                    eq(notifications.userId, session.user.id)
                )
            );

        if (notification.length === 0) {
            return new Response(
                JSON.stringify({ error: "Notification not found" }),
                { status: 404 }
            );
        }

        // Delete the notification
        await db
            .delete(notifications)
            .where(
                and(
                    eq(notifications.id, notificationId),
                    eq(notifications.userId, session.user.id)
                )
            );

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to delete notification:", error);
        return new Response(
            JSON.stringify({ error: "Failed to delete notification" }),
            { status: 500 }
        );
    }
}
