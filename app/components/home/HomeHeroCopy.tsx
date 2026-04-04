"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { animate, stagger } from "animejs";
import { Github, Linkedin, Download } from "lucide-react";
import { homeCopy, homeTitle, homeTitleJP } from "./homeData";

/* ── timing ── */
const CYCLE_INTERVAL = 5000;
const CHAR_OUT_DUR = 420;
const CHAR_IN_DUR = 520;
const DESC_OUT_DUR = 600;
const DESC_IN_DUR = 700;

/* ── B&W theme palette for character hover colors ── */
const THEME_COLORS = ["#ffffff", "#999999", "#cccccc", "#666666", "#e0e0e0"];

function splitToChars(text: string) {
    return text.split("").map((ch) => (ch === " " ? "\u00A0" : ch));
}

export default function HomeHeroCopy() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isJPRef = useRef(false);
    const [titleChars, setTitleChars] = useState(() => splitToChars(homeTitle));

    /* ── character hover effect ── */
    useEffect(() => {
        const title = titleRef.current;
        if (!title) return;

        const chars = Array.from(title.querySelectorAll<HTMLElement>(".home-title-char"));
        const cleanups: Array<() => void> = [];

        chars.forEach((el) => {
            const original = el.style.color || "";

            const onEnter = () => {
                const c = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
                animate(el, {
                    color: c,
                    scale: [1, 1.18],
                    duration: 200,
                    ease: "outExpo",
                });
            };

            const onLeave = () => {
                animate(el, {
                    color: original || "#ffffff",
                    scale: [1.18, 1],
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

        animate(chars, {
            opacity: [1, 0],
            translateY: [0, -20],
            delay: stagger(35),
            duration: CHAR_OUT_DUR,
            ease: "inQuad",
            onComplete: () => {
                const next = !isJPRef.current;
                isJPRef.current = next;
                setTitleChars(splitToChars(next ? homeTitleJP : homeTitle));
            },
        });

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

    /* ── Animate chars in after React re-renders ── */
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

        const initialDelay = setTimeout(() => {
            startCycle();
        }, 3200);

        return () => {
            clearTimeout(initialDelay);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [swapText]);

    return (
        <section className="hero-copy-void">
            {/* Scan-line overlay */}
            <div className="scan-line-overlay" aria-hidden="true" />

            <p className="void-kicker">{homeCopy.kicker}</p>

            <h1 ref={titleRef} className="void-title sekuya-regular">
                {titleChars.map((char, i) => (
                    <span key={`${char}-${i}`} className="home-title-char">
                        {char}
                    </span>
                ))}
            </h1>

            <h2 className="void-subtitle">{homeCopy.subtitle}</h2>

            <p ref={descRef} className="void-description">
                {homeCopy.description}
            </p>

            <div className="hero-social-links" style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', justifyContent: 'center', opacity: 0.8 }}>
                <a href="https://github.com/arjun1127" target="_blank" rel="noreferrer" className="hero-social-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                    <Github size={20} />
                    <span>GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/arjun-rao-1520a424a/" target="_blank" rel="noreferrer" className="hero-social-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                </a>
                <a href="/Arjun_resume.pdf" target="_blank" rel="noreferrer" className="hero-social-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                    <Download size={20} />
                    <span>Resume</span>
                </a>
            </div>
        </section>
    );
}
