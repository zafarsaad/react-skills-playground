import { create } from "zustand";
import { persist } from "zustand/middleware";

type Request = {
    type: "REST" | "GraphQL";
    endpoint: string;
    timestamp: number;
};

type RequestStore = {
    requests: Request[];
    addRequest: (req: Request) => void;
};

// Initialize from localStorage if available
const getStoredRequests = (): Request[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('requests');
    return stored ? JSON.parse(stored) : [];
};

export const useRequestStore = create<RequestStore>()(
    persist(
        (set) => ({
            // Initialize with stored requests
            requests: getStoredRequests(),

            addRequest: (req) =>
                set((state) => {
                    const updated = [req, ...state.requests.slice(0, 9)];
                    // Only save to localStorage if we're in the browser
                    if (typeof window !== 'undefined') {
                        localStorage.setItem("requests", JSON.stringify(updated));
                    }
                    return { requests: updated };
                }),
        }),
        {
            name: "request-storage", // unique name for localStorage key
            skipHydration: true, // important for Next.js
        }
    )
); 