"use client";

import Link from "next/link";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type MouseEvent as ReactMouseEvent,
} from "react";
import { animate, stagger } from "animejs";
import { homeCopy, homeTitle, homeTitleJP } from "./homeData";

interface HomeHeroCopyProps {
    onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
}

/* ── timing ── */
const CYCLE_INTERVAL = 5000;   // ms between swaps
const CHAR_OUT_DUR = 420;    // per-char fade-out
const CHAR_IN_DUR = 520;    // per-char fade-in
const DESC_OUT_DUR = 600;    // description fade-out
const DESC_IN_DUR = 700;    // description fade-in

/* ── theme palette for character colors ── */
const THEME_COLORS = ["#5470eb", "#0f1f36", "#0c0c0c", "#3b5de7", "#1a2d5a"];

function splitToChars(text: string) {
    return text.split("").map((ch) => (ch === " " ? "\u00A0" : ch));
}

export default function HomeHeroCopy({ onNavigate }: HomeHeroCopyProps) {
    const ctaRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isJPRef = useRef(false);
    const [titleChars, setTitleChars] = useState(() => splitToChars(homeTitle));

    /* ── character hover effect using theme colors ── */
    useEffect(() => {
        const title = titleRef.current;
        if (!title) return;

        const chars = Array.from(title.querySelectorAll<HTMLElement>(".home-title-char"));
        const cleanups: Array<() => void> = [];

        chars.forEach((el) => {
            const original = el.style.color || "";

            const onEnter = () => {
                const color = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
                animate(el, {
                    color,
                    scale: [1, 1.15],
                    duration: 200,
                    ease: "outExpo",
                });
            };

            const onLeave = () => {
                animate(el, {
                    color: original || "#0c0c0c",
                    scale: [1.15, 1],
                    duration: 300,
                    ease: "outExpo",
                });
            };

            el.addEventListener("pointerenter", onEnter);
            el.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
                el.removeEventListener("pointerenter", onEnter);
                el.removeEventListener("pointerleave", onLeave);
            });
        });

        return () => cleanups.forEach((fn) => fn());
    }, [titleChars]);

    /* ── alternating EN ↔ JP swap ── */
    const swapText = useCallback(() => {
        const title = titleRef.current;
        const desc = descRef.current;
        if (!title || !desc) return;

        const chars = title.querySelectorAll<HTMLElement>(".home-title-char");

        // Fade out chars one by one
        animate(chars, {
            opacity: [1, 0],
            translateY: [0, -20],
            delay: stagger(35),
            duration: CHAR_OUT_DUR,
            ease: "inQuad",
            onComplete: () => {
                const next = !isJPRef.current;
                isJPRef.current = next;
                const newChars = splitToChars(next ? homeTitleJP : homeTitle);
                setTitleChars(newChars);
            },
        });

        // Fade out description
        animate(desc, {
            opacity: [1, 0],
            translateY: [0, -14],
            duration: DESC_OUT_DUR,
            ease: "inQuad",
            onComplete: () => {
                desc.textContent = isJPRef.current ? homeCopy.descriptionJP : homeCopy.description;

                animate(desc, {
                    opacity: [0, 1],
                    translateY: [14, 0],
                    duration: DESC_IN_DUR,
                    ease: "outExpo",
                });
            },
        });
    }, []);

    /* Animate NEW chars in after React re-renders them */
    useEffect(() => {
        const title = titleRef.current;
        if (!title) return;

        const chars = title.querySelectorAll<HTMLElement>(".home-title-char");
        if (!chars.length) return;

        animate(chars, {
            opacity: [0, 1],
            translateY: [20, 0],
            delay: stagger(40),
            duration: CHAR_IN_DUR,
            ease: "outExpo",
        });
    }, [titleChars]);

    /* ── cycle timer ── */
    useEffect(() => {
        const startCycle = () => {
            timerRef.current = setTimeout(() => {
                swapText();
                startCycle();
            }, CYCLE_INTERVAL);
        };

        // Wait for entrance animations before cycling
        const initialDelay = setTimeout(() => {
            startCycle();
        }, 3200);

        return () => {
            clearTimeout(initialDelay);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [swapText]);

    /* ── CTA hover effects ── */
    useEffect(() => {
        const root = ctaRef.current;
        if (!root) return;

        const targets = Array.from(root.querySelectorAll<HTMLElement>(".home-cta-btn"));
        const cleanups: Array<() => void> = [];

        targets.forEach((target) => {
            const onEnter = () => {
                target.animate(
                    [{ transform: "translateY(0) scale(1)" }, { transform: "translateY(-2px) scale(1.04)" }],
                    { duration: 200, fill: "forwards", easing: "cubic-bezier(0.16,1,0.3,1)" }
                );
            };
            const onLeave = () => {
                target.animate(
                    [{ transform: "translateY(-2px) scale(1.04)" }, { transform: "translateY(0) scale(1)" }],
                    { duration: 180, fill: "forwards", easing: "ease-out" }
                );
            };

            target.addEventListener("pointerenter", onEnter);
            target.addEventListener("pointerleave", onLeave);
            target.addEventListener("focus", onEnter);
            target.addEventListener("blur", onLeave);

            cleanups.push(() => {
                target.removeEventListener("pointerenter", onEnter);
                target.removeEventListener("pointerleave", onLeave);
                target.removeEventListener("focus", onEnter);
                target.removeEventListener("blur", onLeave);
            });
        });

        return () => cleanups.forEach((fn) => fn());
    }, []);

    return (
        <section className="home-hero-copy">
            <p className="home-kicker">{homeCopy.kicker}</p>

            <h1 ref={titleRef} className="home-title sekuya-regular">
                {titleChars.map((char, i) => (
                    <span key={`${char}-${i}`} className="home-title-char">
                        {char}
                    </span>
                ))}
            </h1>

            <h2 className="home-subtitle">{homeCopy.subtitle}</h2>

            <p ref={descRef} className="home-description">
                {homeCopy.description}
            </p>

            <div ref={ctaRef} className="home-cta-row">
                {homeCopy.ctas.map((cta) => (
                    <Link
                        key={cta.href}
                        href={cta.href}
                        className={`home-cta-btn ${cta.variant === "primary" ? "home-cta-primary" : "home-cta-secondary"}`}
                        onClick={(event) => onNavigate(event, cta.href)}
                    >
                        {cta.label}
                    </Link>
                ))}
            </div>
        </section>
    );
}
