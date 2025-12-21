import {
    pgTable,
    text,
    serial,
    timestamp,
    integer,
    decimal,
    boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const listings = pgTable("listings", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    address: text("address").notNull(),
    moveIn: timestamp("move_in").notNull(),
    moveOut: timestamp("move_out").notNull(),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: integer("bathrooms").notNull(),
    image: text("image"),
    amenities: text("amenities").array(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    listingId: integer("listing_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    senderId: text("sender_id").notNull(),
    recipientId: text("recipient_id").notNull(),
    listingId: integer("listing_id").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    type: text("type").notNull(), // 'message', 'favorite', etc
    title: text("title").notNull(),
    description: text("description"),
    relatedId: integer("related_id"), // listing id or message id
    read: boolean("read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

export const listingsRelations = relations(listings, ({ one }) => ({
    user: one(user, {
        fields: [listings.userId],
        references: [user.id],
    }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
    listing: one(listings, {
        fields: [favorites.listingId],
        references: [listings.id],
    }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    sender: one(user, {
        fields: [messages.senderId],
        references: [user.id],
    }),
    recipient: one(user, {
        fields: [messages.recipientId],
        references: [user.id],
    }),
    listing: one(listings, {
        fields: [messages.listingId],
        references: [listings.id],
    }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(user, {
        fields: [notifications.userId],
        references: [user.id],
    }),
}));

export * from "./auth-schema";
