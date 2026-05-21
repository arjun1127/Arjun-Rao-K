"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./translations";

interface LangContextValue {
    lang: Lang;
    toggleLang: () => void;
    setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
    lang: "en",
    toggleLang: () => {},
    setLang: () => {},
});

const STORAGE_KEY = "portfolio-lang";

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>("en");

    // Hydrate from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === "ja" || stored === "en") {
                setLangState(stored);
            }
        } catch {
            /* SSR or no storage */
        }
    }, []);

    const setLang = useCallback((next: Lang) => {
        setLangState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* no storage */
        }
    }, []);

    const toggleLang = useCallback(() => {
        setLang(lang === "en" ? "ja" : "en");
    }, [lang, setLang]);

    return (
        <LangContext.Provider value={{ lang, toggleLang, setLang }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang(): LangContextValue {
    return useContext(LangContext);
}
