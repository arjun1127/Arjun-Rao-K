"use client";

import { useEffect, useState } from "react";

export type HomeSection = "hero" | "projects" | "about" | "contact";

export interface ScrollState {
    progress: number; // 0.0 to 1.0
    velocity: number;
    activeSection: HomeSection;
    sectionProgress: number; // 0.0 to 1.0 within active section
}

export function useScrollProgress(containerRef?: React.RefObject<HTMLElement | null>): ScrollState {
    const [scrollState, setScrollState] = useState<ScrollState>({
        progress: 0,
        velocity: 0,
        activeSection: "hero",
        sectionProgress: 0,
    });

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let lastTime = performance.now();
        let animationFrameId: number;

        const handleScroll = () => {
            const container = containerRef?.current;
            const now = performance.now();
            const currentScrollY = window.scrollY;
            const dt = Math.max((now - lastTime) / 1000, 0.001);

            let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (container) {
                maxScroll = container.scrollHeight - window.innerHeight;
            }

            if (maxScroll <= 0) maxScroll = 1;

            const progress = Math.min(Math.max(currentScrollY / maxScroll, 0), 1);
            const rawVelocity = (currentScrollY - lastScrollY) / dt;

            // Determine active section and local section progress
            // Hero: 0.00 - 0.20
            // Projects: 0.20 - 0.50
            // About: 0.50 - 0.75
            // Contact: 0.75 - 1.00
            let activeSection: HomeSection = "hero";
            let sectionProgress = 0;

            if (progress < 0.20) {
                activeSection = "hero";
                sectionProgress = progress / 0.20;
            } else if (progress < 0.50) {
                activeSection = "projects";
                sectionProgress = (progress - 0.20) / 0.30;
            } else if (progress < 0.75) {
                activeSection = "about";
                sectionProgress = (progress - 0.50) / 0.25;
            } else {
                activeSection = "contact";
                sectionProgress = (progress - 0.75) / 0.25;
            }

            lastScrollY = currentScrollY;
            lastTime = now;

            setScrollState({
                progress,
                velocity: rawVelocity,
                activeSection,
                sectionProgress: Math.min(Math.max(sectionProgress, 0), 1),
            });
        };

        const onScroll = () => {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(handleScroll);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [containerRef]);

    return scrollState;
}
