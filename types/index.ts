export interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    address: string;
    moveIn: string;
    moveOut: string;
    bedrooms: number;
    bathrooms: number;
    image: string;
    amenities: string[];
    distance: string;
    poster: string;
}

export type PageType = "home" | "create" | "messages" | "saved";

export interface User {
    id: string;
    email: string;
    name: string;
    programYear?: number;
}
