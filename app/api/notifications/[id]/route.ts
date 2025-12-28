import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const notificationId = parseInt(id);

        // Verify the notification belongs to the user
        const { data: notification, error: fetchError } = await supabaseAdmin
            .from("notifications")
            .select("*")
            .eq("id", notificationId)
            .eq("user_id", session.user.id)
            .single();

        if (fetchError || !notification) {
            return new Response(
                JSON.stringify({ error: "Notification not found" }),
                { status: 404 }
            );
        }

        // Delete the notification
        const { error } = await supabaseAdmin
            .from("notifications")
            .delete()
            .eq("id", notificationId)
            .eq("user_id", session.user.id);

        if (error) throw error;

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
