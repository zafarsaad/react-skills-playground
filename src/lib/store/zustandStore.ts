import { create } from 'zustand';

type State = {
    count: number;
    increase: () => void;
    reset: () => void;
}

export const useZustandStore = create<State>((set) => ({
    count: 0,
    increase: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set({ count: 0 }),
}));