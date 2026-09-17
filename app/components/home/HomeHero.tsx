"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, Suspense, lazy } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";
import { ArrowRight, User } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

import { useIframeButtonCustomization } from "../../hooks/useIframeButtonCustomization";

// Lazy-load ThreeUI components so the bundle stays lean until needed
const PredictiveArcCanvas = lazy(() =>
    import("@designcodeio/threeui").then((mod) => ({
        default: mod.PredictiveArcCanvas,
    }))
);

const ShaderButtons = lazy(() =>
    import("@designcodeio/threeui").then((mod) => ({
        default: mod.ShaderButtons,
    }))
);

export default function HomeHero() {
    const router = useRouter();
    const heroRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const kickerRef = useRef<HTMLDivElement>(null);
    const previewTextRef = useRef<HTMLParagraphElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const plasmaBtnRef = useRef<HTMLDivElement>(null);
    const imageWrapRef = useRef<HTMLDivElement>(null);
    const floatingCardRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { lang } = useLang();

    useIframeButtonCustomization({
        containerRef: plasmaBtnRef,
        text: t(translations.home.aboutMe, lang),
        lang,
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial reveal timeline
            const tl = gsap.timeline({
                defaults: { ease: "power4.out" },
            });

            tl.fromTo(
                kickerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.8 }
            )
                .fromTo(
                    titleRef.current,
                    { opacity: 0, y: 60 },
                    { opacity: 1, y: 0, duration: 1.1 },
                    "-=0.5"
                )
                .fromTo(
                    previewTextRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8 },
                    "-=0.7"
                )
                .fromTo(
                    cardRef.current,
                    { opacity: 0, y: 25 },
                    { opacity: 1, y: 0, duration: 0.8 },
                    "-=0.5"
                )
                .fromTo(
                    imageWrapRef.current,
                    { opacity: 0, x: 50, scale: 0.95 },
                    { opacity: 1, x: 0, scale: 1, duration: 1.1 },
                    "-=1"
                )
                .fromTo(
                    scrollRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.8 },
                    "-=0.3"
                );

            // Floating animation for status card
            if (floatingCardRef.current) {
                gsap.to(floatingCardRef.current, {
                    y: -12,
                    repeat: -1,
                    yoyo: true,
                    duration: 2.8,
                    ease: "sine.inOut",
                });
            }

            // ScrollTrigger exit fade/parallax as scene 1 scrolls out
            if (heroRef.current) {
                gsap.to(heroRef.current, {
                    opacity: 0.4,
                    scale: 0.98,
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            }
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="about-dark-section home-hero-section">
            {/* ── Predictive Arc Background ── */}
            <div className="home-hero-arc-bg">
                <Suspense fallback={<div className="home-hero-arc-fallback" />}>
                    <PredictiveArcCanvas
                        mode="dark"
                        speed={0.8}
                        hue={0}
                        saturation={1.1}
                        brightness={0.85}
                        spacing={5}
                        dotSize={6}
                        archHeight={0.7}
                        thickness={1}
                    />
                </Suspense>
            </div>

            {/* ── Hero Content (above the background) ── */}
            <div className="about-hero-content home-hero-content">
                <div className="hero-grid">

                    {/* LEFT COLUMN: ABOUT ME PREVIEW */}
                    <div className="hero-left-col">
                        <div ref={kickerRef} className="home-hero-kicker">
                            <span className="home-hero-kicker-line" />
                            <span className="home-hero-kicker-text">
                                {t(translations.home.stage01, lang)} • {t(translations.home.aboutMe, lang)}
                            </span>
                        </div>

                        <h1
                            ref={titleRef}
                            className="hero-main-title"
                        >
                            {t(translations.home.title, lang)}
                        </h1>

                        <p
                            ref={previewTextRef}
                            className="hero-description"
                        >
                            {t(translations.about.heroDesc, lang)}.
                        </p>

                        <div ref={cardRef} className="">
                            <div className="hero-buttons">
                                <div
                                    ref={plasmaBtnRef}
                                    onClick={() => router.push("/about")}
                                    className="home-hero-plasma-wrap"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && router.push("/about")}
                                >
                                    <Suspense fallback={<div className="hero-primary-btn">{t(translations.home.aboutMe, lang)}</div>}>
                                        <ShaderButtons
                                            variant="plasma-button"
                                            mode="dark"
                                            hue={0}
                                            saturation={1.00}
                                            brightness={1.00}
                                        />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PROFILE IMAGE & STATUS BADGE */}
                    <div ref={imageWrapRef} className="hero-image-wrapper">
                        <div className="hero-image-glow" />

                        <div className="hero-image-frame">
                            <Image
                                src="/kaizen1.png"
                                alt="Arjun Rao"
                                width={1400}
                                height={1200}
                                priority
                                className="hero-image"
                            />
                        </div>

                        {/* <div
                            ref={floatingCardRef}
                            className="hero-floating-card"
                        >
                            <p className="floating-label">
                                {t(translations.about.status, lang)}
                            </p>
                            <p className="floating-text">
                                {t(translations.about.statusText, lang)}
                            </p>
                        </div> */}
                    </div>
                </div>

                <div ref={scrollRef} className="scroll-indicator">
                    <span>{t(translations.about.scrollToExplore, lang)}</span>
                    <span className="home-hero-scroll-line" />
                </div>
            </div>
        </section>
    );
}
