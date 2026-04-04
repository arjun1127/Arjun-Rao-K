"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import PortalCard from "./PortalCard";
import { portals } from "./homeData";

/**
 * PortalGrid — Arranges 4 PortalCards in a 2×2 grid (desktop) / column (mobile).
 * Orchestrates entrance stagger with Anime.js and warp-out click transitions with GSAP.
 */
export default function PortalGrid() {
    const gridRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const transitionLockRef = useRef(false);

    /* ── Anime.js entrance stagger ── */
    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const cards = grid.querySelectorAll(".portal-card");
        if (!cards.length) return;

        // Delay entrance to let the hero copy animate first
        const timeout = setTimeout(() => {
            animate(cards, {
                opacity: [0, 1],
                translateY: [80, 0],
                scale: [0.88, 1],
                delay: stagger(160, { start: 0 }),
                duration: 900,
                ease: "outExpo",
            });
        }, 1200);

        return () => clearTimeout(timeout);
    }, []);

    /* ── Warp-out click transition ── */
    const handleNavigate = useCallback(
        (href: string, cardEl: HTMLElement) => {
            if (transitionLockRef.current) return;
            transitionLockRef.current = true;

            const grid = gridRef.current;
            const otherCards = grid
                ? Array.from(grid.querySelectorAll<HTMLElement>(".portal-card")).filter(
                      (el) => el !== cardEl
                  )
                : [];

            const tl = gsap.timeline({
                defaults: { ease: "power3.inOut" },
                onComplete: () => {
                    router.push(href);
                    transitionLockRef.current = false;
                },
            });

            // Fade siblings
            if (otherCards.length) {
                tl.to(
                    otherCards,
                    {
                        opacity: 0,
                        scale: 0.9,
                        y: 30,
                        stagger: 0.06,
                        duration: 0.35,
                    },
                    0
                );
            }

            // Warp the clicked card
            tl.to(
                cardEl,
                {
                    scale: 1.15,
                    opacity: 0,
                    filter: "blur(12px)",
                    duration: 0.5,
                },
                0.15
            );

            // Fade the hero copy
            const heroCopy = document.querySelector(".hero-copy-void");
            if (heroCopy) {
                tl.to(heroCopy, { opacity: 0, y: -30, duration: 0.35 }, 0);
            }
        },
        [router]
    );

    return (
        <div ref={gridRef} className="portal-grid">
            {portals.map((portal, i) => (
                <PortalCard
                    key={portal.id}
                    portal={portal}
                    index={i}
                    onNavigate={handleNavigate}
                />
            ))}
        </div>
    );
}
