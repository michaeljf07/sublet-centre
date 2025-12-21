"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoritesContextType {
    favorites: Set<number>;
    isFavorite: (listingId: number) => boolean;
    toggleFavorite: (listingId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
    undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedFavorites = localStorage.getItem("sublet-favorites");
        if (savedFavorites) {
            try {
                const parsed = JSON.parse(savedFavorites);
                setFavorites(new Set(parsed));
            } catch (error) {
                console.error("Failed to load favorites:", error);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(
                "sublet-favorites",
                JSON.stringify(Array.from(favorites))
            );
        }
    }, [favorites, isLoading]);

    const isFavorite = (listingId: number): boolean => {
        return favorites.has(listingId);
    };

    const toggleFavorite = (listingId: number): void => {
        setFavorites((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(listingId)) {
                newSet.delete(listingId);
            } else {
                newSet.add(listingId);
            }
            return newSet;
        });
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                isFavorite,
                toggleFavorite,
            }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error("useFavorites must be used within FavoritesProvider");
    }
    return context;
}
