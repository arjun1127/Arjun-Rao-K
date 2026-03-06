"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import { animate } from "animejs";
import { categories as projectCategories, projects } from "./projectsData";

interface CategoryOption {
    id: string;
    label: string;
}

interface CategoryChipsProps {
    active: string;
    onChange: (id: string) => void;
    categories?: CategoryOption[];
    counts?: Record<string, number>;
}

const defaultCategories: CategoryOption[] = [
    { id: "all", label: "All" },
    ...projectCategories.map((category) => ({ id: category.id, label: category.label })),
];

export default function CategoryChips({
    active,
    onChange,
    categories = defaultCategories,
    counts,
}: CategoryChipsProps) {
    const barRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const fallbackCounts = useMemo(() => {
        const map: Record<string, number> = { all: projects.length };
        projectCategories.forEach((category) => {
            map[category.id] = projects.filter((project) => project.category === category.id).length;
        });
        return map;
    }, []);

    const countMap = counts ?? fallbackCounts;

    const moveIndicator = useCallback(() => {
        const bar = barRef.current;
        const indicator = indicatorRef.current;
        const btn = btnRefs.current.get(active);
        if (!bar || !indicator || !btn) return;

        const barRect = bar.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        const translateX = btnRect.left - barRect.left + bar.scrollLeft;

        animate(indicator, {
            translateX,
            width: btnRect.width,
            duration: 500,
            ease: "inOutExpo",
        });
    }, [active]);

    useEffect(() => {
        const bar = barRef.current;
        const indicator = indicatorRef.current;
        const btn = btnRefs.current.get(active);
        if (!bar || !indicator || !btn) return;

        const barRect = bar.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        const translateX = btnRect.left - barRect.left + bar.scrollLeft;
        indicator.style.transform = `translateX(${translateX}px)`;
        indicator.style.width = `${btnRect.width}px`;
    }, [active]);

    useEffect(() => {
        moveIndicator();
    }, [active, moveIndicator]);

    useEffect(() => {
        const bar = barRef.current;
        if (!bar) return;

        const handleResize = () => moveIndicator();
        const handleScroll = () => moveIndicator();

        window.addEventListener("resize", handleResize);
        bar.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("resize", handleResize);
            bar.removeEventListener("scroll", handleScroll);
        };
    }, [moveIndicator]);

    return (
        <div ref={barRef} className="chip-bar">
            <div ref={indicatorRef} className="chip-indicator" />
            {categories.map((category) => (
                <button
                    key={category.id}
                    ref={(element) => {
                        if (element) btnRefs.current.set(category.id, element);
                    }}
                    type="button"
                    className={`chip-btn ${active === category.id ? "chip-active" : ""}`}
                    aria-pressed={active === category.id}
                    onClick={() => onChange(category.id)}
                >
                    {category.label}
                    <span className="chip-count">{countMap[category.id] ?? 0}</span>
                </button>
            ))}
        </div>
    );
}
