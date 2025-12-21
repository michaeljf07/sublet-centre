import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const listingId = parseInt(id);

        const listing = await db
            .select({
                id: listings.id,
                userId: listings.userId,
                title: listings.title,
                description: listings.description,
                price: listings.price,
                address: listings.address,
                moveIn: listings.moveIn,
                moveOut: listings.moveOut,
                bedrooms: listings.bedrooms,
                bathrooms: listings.bathrooms,
                image: listings.image,
                amenities: listings.amenities,
                createdAt: listings.createdAt,
                updatedAt: listings.updatedAt,
                posterName: sql<string>`(SELECT name FROM "user" WHERE "user".id = ${listings.userId})`,
            })
            .from(listings)
            .where(eq(listings.id, listingId))
            .limit(1);

        if (listing.length === 0) {
            return new Response(
                JSON.stringify({ error: "Listing not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(listing[0]), {
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
        const listing = await db
            .select()
            .from(listings)
            .where(eq(listings.id, listingId))
            .limit(1);

        if (listing.length === 0) {
            return new Response(
                JSON.stringify({ error: "Listing not found" }),
                { status: 404 }
            );
        }

        if (listing[0].userId !== session.user.id) {
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

        // Update listing
        const updatedListing = await db
            .update(listings)
            .set({
                title,
                description,
                price: price.toString(),
                address,
                moveIn: new Date(moveIn),
                moveOut: new Date(moveOut),
                bedrooms,
                bathrooms,
                image: image || null,
                amenities: amenities || [],
                updatedAt: new Date(),
            })
            .where(eq(listings.id, listingId))
            .returning();

        return new Response(JSON.stringify(updatedListing[0]), {
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
        const listing = await db
            .select()
            .from(listings)
            .where(eq(listings.id, listingId))
            .limit(1);

        if (listing.length === 0) {
            return new Response(
                JSON.stringify({ error: "Listing not found" }),
                { status: 404 }
            );
        }

        if (listing[0].userId !== session.user.id) {
            return new Response(JSON.stringify({ error: "Forbidden" }), {
                status: 403,
            });
        }

        // Delete listing
        await db.delete(listings).where(eq(listings.id, listingId));

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
