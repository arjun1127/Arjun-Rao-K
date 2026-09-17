"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";
import { Github, Mail, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function HomeContact() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);

    const { lang } = useLang();

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            if (buttonsRef.current) {
                gsap.fromTo(
                    buttonsRef.current.children,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
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
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="about-dark-section cta-section py-20 lg:py-32 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

            <div ref={contentRef} className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <span className="text-xs uppercase tracking-[0.2em] text-[#a7b7ff] font-mono mb-4 inline-block">
                    {t(translations.home.stage04, lang)} • {t(translations.portals.contact.title, lang)}
                </span>

                <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-6">
                    {t(translations.home.contactTitle, lang)}
                </h2>

                <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto font-mono mb-12 leading-relaxed">
                    {t(translations.home.contactSubtitle, lang)}
                </p>

                {/* TWO DIRECT LINKS: GITHUB & EMAIL */}
                <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-lg mx-auto">
                    {/* GITHUB LINK */}
                    <a
                        href="https://github.com/arjun1127"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold transition-all hover:-translate-y-1 shadow-xl group"
                    >
                        <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        <span>{t(translations.home.github, lang)}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>

                    {/* EMAIL LINK */}
                    <a
                        href="mailto:arjunkrao2004@gmail.com"
                        className="glow-button w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#5470eb] hover:bg-[#435ddb] text-white font-semibold transition-all hover:-translate-y-1 shadow-xl shadow-indigo-500/25 group"
                    >
                        <Mail className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        <span>{t(translations.home.sendEmail, lang)}</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
