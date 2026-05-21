"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";

export default function ProjectsHero() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const { lang } = useLang();

    useEffect(() => {
        const title = titleRef.current;
        const subtitle = subtitleRef.current;

        if (title) {
            gsap.fromTo(
                title,
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
            );
        }

        if (subtitle) {
            gsap.fromTo(
                subtitle,
                { y: 32, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 }
            );
        }
    }, []);

    return (
        <section ref={sectionRef} className="projects-hero">
            <div className="projects-hero-content">
                <h1 ref={titleRef} className="project-hero">
                    {t(translations.projects.heroTitle, lang)}
                </h1>
                <p ref={subtitleRef} className="projects-subtitle">
                    {t(translations.projects.heroSubtitle, lang)}
                </p>
            </div>
        </section>
    );
}
