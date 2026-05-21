"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";

export default function JourneyTimeline() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const { lang } = useLang();

    const milestones = translations.about.milestones.map((m) => ({
        year: m.year,
        label: t(m.label, lang),
        desc: t(m.desc, lang),
    }));

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
            <h2>{t(translations.about.journeyTitle, lang)}</h2>
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
