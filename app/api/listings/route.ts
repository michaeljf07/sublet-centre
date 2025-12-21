import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        let allListings;

        if (userId) {
            allListings = await db
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
                .where(eq(listings.userId, userId));
        } else {
            allListings = await db
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
                .from(listings);
        }

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

        // Create listing in database
        const newListing = await db
            .insert(listings)
            .values({
                userId: session.user.id,
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
            })
            .returning();

        return new Response(JSON.stringify(newListing[0]), {
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
