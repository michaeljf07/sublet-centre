import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        let query = supabaseAdmin.from("listings").select("*");

        if (userId) {
            query = query.eq("userId", userId);
        }

        const { data: allListings, error } = await query;

        if (error) throw error;

        return new Response(JSON.stringify(allListings), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to fetch listings:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch listings" }),
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

        const {
            title,
            description,
            price,
            address,
            moveIn,
            moveOut,
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
            !moveIn ||
            !moveOut ||
            !bedrooms ||
            !bathrooms
        ) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        const { data: newListing, error } = await supabaseAdmin
            .from("listings")
            .insert([
                {
                    userId: session.user.id,
                    title,
                    description,
                    price: price.toString(),
                    address,
                    moveIn,
                    moveOut,
                    bedrooms,
                    bathrooms,
                    image: image || null,
                    amenities: amenities || [],
                },
            ])
            .select()
            .single();

        if (error) throw error;

        return new Response(JSON.stringify(newListing), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to create listing:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create listing" }),
            { status: 500 }
        );
    }
}
