"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

export default function ConnectCTA() {
    const sectionRef = useRef<HTMLElement>(null);
    const { lang } = useLang();

    useEffect(() => {
        if (!sectionRef.current) return;

        gsap.fromTo(
            sectionRef.current.children,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="about-dark-section cta-section">
            <h2>{t(translations.about.ctaTitle, lang)}</h2>
            <a href="mailto:arjunkrao2004@gmail.com" className="glow-button">
                {t(translations.about.ctaButton, lang)}
            </a>
        </section>
    );
}
