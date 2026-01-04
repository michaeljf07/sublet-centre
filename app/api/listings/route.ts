import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const searchTerm = searchParams.get("search");

        let query = supabaseAdmin.from("listings").select("*");

        if (userId) {
            query = query.eq("user_id", userId);
        }

        if (searchTerm) {
            // Use ilike for case-insensitive search on string fields only
            const term = `%${searchTerm}%`;
            query = query.or(
                [
                    `title.ilike.${term}`,
                    `description.ilike.${term}`,
                    `address.ilike.${term}`,
                    `search_terms.ilike.${term}`,
                ].join(",")
            );
        }

        const { data: listings, error } = await query;
        if (error) throw error;

        return new Response(JSON.stringify(listings), {
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
        const requestHeaders = await headers();
        const session = await auth.api.getSession({
            headers: requestHeaders,
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
            move_in,
            move_out,
            bedrooms,
            bathrooms,
            image,
            amenities,
            search_terms: providedSearchTerms,
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

        const poster_name =
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "User";

        // Create search terms from provided value or generate from title, description, address, and amenities
        const searchTerms =
            providedSearchTerms ||
            [title, description, address, ...(amenities || [])]
                .join(" ")
                .toLowerCase();

        const { data: newListing, error } = await supabaseAdmin
            .from("listings")
            .insert([
                {
                    user_id: session.user.id,
                    title,
                    description,
                    price: price.toString(),
                    address,
                    move_in: move_in,
                    move_out: move_out,
                    bedrooms,
                    bathrooms,
                    image: image || null,
                    amenities: amenities || [],
                    poster_name: poster_name,
                    search_terms: searchTerms,
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
