"use client";

import { useSyncExternalStore } from "react";
import { HomeSection } from "../hooks/useScrollProgress";

export interface PortfolioStoreState {
    activeSection: HomeSection;
    scrollProgress: number;
    hoveredProjectIndex: number | null;
    mousePosition: { x: number; y: number };
}

let state: PortfolioStoreState = {
    activeSection: "hero",
    scrollProgress: 0,
    hoveredProjectIndex: null,
    mousePosition: { x: 0, y: 0 },
};

const listeners = new Set<() => void>();

function emitChange() {
    for (const listener of listeners) {
        listener();
    }
}

export const portfolioStore = {
    getState: () => state,
    subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    setActiveSection: (activeSection: HomeSection) => {
        if (state.activeSection !== activeSection) {
            state = { ...state, activeSection };
            emitChange();
        }
    },
    setScrollProgress: (scrollProgress: number) => {
        state = { ...state, scrollProgress };
        emitChange();
    },
    setHoveredProjectIndex: (hoveredProjectIndex: number | null) => {
        if (state.hoveredProjectIndex !== hoveredProjectIndex) {
            state = { ...state, hoveredProjectIndex };
            emitChange();
        }
    },
    setMousePosition: (mousePosition: { x: number; y: number }) => {
        state = { ...state, mousePosition };
        emitChange();
    },
};

export function usePortfolioStore<T>(selector: (state: PortfolioStoreState) => T): T {
    return useSyncExternalStore(
        portfolioStore.subscribe,
        () => selector(portfolioStore.getState()),
        () => selector(portfolioStore.getState())
    );
}
