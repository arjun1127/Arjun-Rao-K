"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

export default function FutureVision() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLDivElement>(null);
    const { lang } = useLang();

    const explorations = translations.about.explorations.map((item) => t(item, lang));

    useEffect(() => {
        if (!sectionRef.current || !itemsRef.current) return;

        const items = itemsRef.current.querySelectorAll(".future-item");

        gsap.fromTo(
            items,
            { opacity: 0, x: -40 },
            {
                opacity: 0.7,
                x: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <div ref={sectionRef} className="future-section">
            <h2>{t(translations.about.futureTitle, lang)}</h2>
            <div ref={itemsRef} className="future-items">
                {explorations.map((item, i) => (
                    <div key={i} className="future-item">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}
