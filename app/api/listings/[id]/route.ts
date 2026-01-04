import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const listingId = parseInt(id);

        const { data: listing, error } = await supabaseAdmin
            .from("listings")
            .select("*")
            .eq("id", listingId)
            .single();

        if (error || !listing) {
            return new Response(
                JSON.stringify({ error: "Listing not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(listing), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to fetch listing:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch listing" }),
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const listingId = parseInt(id);

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        // Check if user owns the listing
        const { data: listing, error: fetchError } = await supabaseAdmin
            .from("listings")
            .select("user_id")
            .eq("id", listingId)
            .single();

        if (fetchError || !listing) {
            return new Response(
                JSON.stringify({ error: "Listing not found" }),
                { status: 404 }
            );
        }

        if (listing.user_id !== session.user.id) {
            return new Response(JSON.stringify({ error: "Forbidden" }), {
                status: 403,
            });
        }

        const body = await request.json();
        const {
            title,
            description,
            price,
            address,
            move_in,
            move_out,
            bedrooms,
            bathrooms,
            image,
            amenities,
        } = body;

        if (
            !title ||
            !description ||
            !price ||
            !address ||
            !move_in ||
            !move_out ||
            !bedrooms ||
            !bathrooms
        ) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        // Update listing
        const { data: updatedListing, error } = await supabaseAdmin
            .from("listings")
            .update({
                title,
                description,
                price: price.toString(),
                address,
                move_in,
                move_out,
                bedrooms,
                bathrooms,
                image: image || null,
                amenities: amenities || [],
            })
            .eq("id", listingId)
            .select()
            .single();

        if (error) throw error;

        return new Response(JSON.stringify(updatedListing), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to update listing:", error);
        return new Response(
            JSON.stringify({ error: "Failed to update listing" }),
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const listingId = parseInt(id);

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        // Check if user owns the listing
        const { data: listing, error: fetchError } = await supabaseAdmin
            .from("listings")
            .select("userId")
            .eq("id", listingId)
            .single();

        if (fetchError || !listing) {
            return new Response(
                JSON.stringify({ error: "Listing not found" }),
                { status: 404 }
            );
        }

        if (listing.userId !== session.user.id) {
            return new Response(JSON.stringify({ error: "Forbidden" }), {
                status: 403,
            });
        }

        // Delete listing
        const { error } = await supabaseAdmin
            .from("listings")
            .delete()
            .eq("id", listingId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to delete listing:", error);
        return new Response(
            JSON.stringify({ error: "Failed to delete listing" }),
            { status: 500 }
        );
    }
}
