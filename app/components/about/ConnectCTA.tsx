"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";
import SweepText from "../shared/SweepText";

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
            <SweepText
                as="h2"
                text={t(translations.about.ctaTitle, lang)}
                initialColor="rgba(255,255,255,0.35)"
                sweepColor="#5470EB"
                finalColor="#ffffff"
                stagger={0.08}
                sweepDuration={0.6}
                returnDuration={0.8}
            />
            <a href="mailto:arjunkrao2004@gmail.com" className="glow-button">
                {t(translations.about.ctaButton, lang)}
            </a>
        </section>
    );
}
