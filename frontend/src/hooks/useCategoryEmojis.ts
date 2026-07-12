/**
 * Custom hook for fetching categories and mapping them into category-emoji object
 * Used in CategoryBreakdown, CalendarExpenseTable
 */

import { useEffect, useState } from "react";
import { fetchCategories } from "../services/api";
import { Category } from "../types";

export function useCategoryEmojis() {
    const [emojiMap, setEmojiMap] = useState<Record<string, string>>({});

    useEffect(() => {
        const mapCatEmojis = async() => {
            try {
                const data = await fetchCategories();

                // Create object, e.g. { "Food":  }
                const mapping = data.reduce((acc: Record<string, string>, cat: Category) => {
                    acc[cat.name] = cat.emoji;
                    return acc;
                }, {});

                setEmojiMap(mapping);
            } catch (err) {
                console.error("Failed to map categories to emojis:", err);
            }
        }

        mapCatEmojis();
    }, []);

    return emojiMap;
}