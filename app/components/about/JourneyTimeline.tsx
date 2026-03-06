"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

const milestones = [
    {
        year: "2022",
        label: "Started Programming and Engineering in ECE",
        desc: "Discovered the world of code began with JAVA, problem-solving, and building small projects.",
    },
    {
        year: "2024",
        label: "Full-Stack & AI",
        desc: "Built end-to-end applications with React, Node, databases, and built ML systems for college projects on Electronics and Communication Engineering.",
    },
    {
        year: "2025-2026",
        label: "Interactive Web Engineering",
        desc: "Exploring immersive web experiences Three.js, GSAP, animations, and real-time interactive interfaces.",
    },
    {
        year: "2026-2027",
        label: "Freelance and Future",
        desc: "Plans of doing freelancing and in next year will be reloacting for Tokyo for work.",
    }

];

export default function JourneyTimeline() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);

                    // Draw the vertical track line
                    if (trackRef.current) {
                        animate(trackRef.current, {
                            scaleY: [0, 1],
                            duration: 1500,
                            ease: "outExpo",
                        });
                    }

                    // Nodes appear sequentially
                    const nodes = section.querySelectorAll(".timeline-node");
                    if (nodes.length > 0) {
                        animate(nodes, {
                            scale: [0, 1],
                            opacity: [0, 1],
                            delay: stagger(300, { start: 400 }),
                            ease: "outExpo",
                            duration: 800,
                        });
                    }
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, [hasAnimated]);

    return (
        <div ref={sectionRef} className="journey-section">
            <h2>Developer Journey</h2>
            <div className="timeline-container">
                <div ref={trackRef} className="timeline-track" />
                {milestones.map((m, i) => (
                    <div key={i} className="timeline-node">
                        <div className="timeline-dot" />
                        <div className="timeline-year">{m.year}</div>
                        <div className="timeline-label">{m.label}</div>
                        <div className="timeline-desc">{m.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
