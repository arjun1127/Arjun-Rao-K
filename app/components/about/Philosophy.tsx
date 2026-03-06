"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

export default function Philosophy() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const pointsRef = useRef<HTMLUListElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);

                    // Animate each character of the title
                    const chars = titleRef.current?.querySelectorAll(".char");
                    if (chars && chars.length > 0) {
                        animate(chars, {
                            translateY: [40, 0],
                            opacity: [0, 1],
                            delay: stagger(50),
                            ease: "outExpo",
                            duration: 800,
                        });
                    }

                    // Animate bullet points
                    const items = pointsRef.current?.querySelectorAll("li");
                    if (items && items.length > 0) {
                        animate(items, {
                            translateY: [20, 0],
                            opacity: [0, 1],
                            delay: stagger(150, { start: 600 }),
                            ease: "outExpo",
                            duration: 700,
                        });
                    }
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, [hasAnimated]);

    const title = "CODE SHOULD FEEL ALIVE";
    const titleChars = title.split("").map((char, i) => (
        <span key={i} className="char">
            {char === " " ? "\u00A0" : char}
        </span>
    ));

    return (
        <section ref={sectionRef} className="about-dark-section philosophy-section">
            <h2 ref={titleRef} className="philosophy-title">
                {titleChars}
            </h2>
            <ul ref={pointsRef} className="philosophy-points">
                <li>• Interfaces should guide users through experiences</li>
                <li>• Animation should explain complex systems</li>
                <li>• Technology should be expressive, not rigid</li>
            </ul>
        </section>
    );
}
