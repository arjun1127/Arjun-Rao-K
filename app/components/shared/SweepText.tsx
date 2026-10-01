"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface SweepTextProps {
    text: string;
    className?: string;
    as?: "p" | "h2" | "h3" | "h4" | "span" | "div";
    initialColor?: string;
    sweepColor?: string;
    finalColor?: string;
    stagger?: number;
    sweepDuration?: number;
    returnDuration?: number;
    delayReturn?: number;
    start?: string;
}

export default function SweepText({
    text,
    className = "",
    as: Tag = "p",
    initialColor = "rgba(255, 255, 255, 0.35)",
    sweepColor = "#5470EB",
    finalColor = "#ffffff",
    stagger = 0.08,
    sweepDuration = 0.6,
    returnDuration = 0.8,
    delayReturn = 0.4,
    start = "top 85%",
}: SweepTextProps) {
    const containerRef = useRef<HTMLElement>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const words = text ? text.split(" ") : [];

    useEffect(() => {
        const container = containerRef.current;
        const validWords = wordRefs.current.filter(Boolean) as HTMLSpanElement[];

        if (!container || validWords.length === 0) return;

        // Set initial muted color
        gsap.set(validWords, { color: initialColor });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: start,
                once: true,
            },
        });

        // 1. Slow blue color sweep through words
        tl.to(validWords, {
            color: sweepColor,
            stagger: stagger,
            duration: sweepDuration,
            ease: "none",
        });

        // 2. Slow return to original/final text color
        tl.to(
            validWords,
            {
                color: finalColor,
                stagger: stagger,
                duration: returnDuration,
                ease: "power2.out",
            },
            `+=${delayReturn}`
        );

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, [text, initialColor, sweepColor, finalColor, stagger, sweepDuration, returnDuration, delayReturn, start]);

    return (
        <Tag ref={containerRef as any} className={className}>
            {words.map((word, idx) => (
                <span
                    key={`${word}-${idx}`}
                    ref={(el) => {
                        wordRefs.current[idx] = el;
                    }}
                    className="inline-block mr-[0.25em]"
                >
                    {word}
                </span>
            ))}
        </Tag>
    );
}
