"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import useIsMobile from "../../hooks/useIsMobile";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";

export default function AboutHero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // LANDING HERO
    const firstNameRef = useRef<HTMLHeadingElement>(null);
    const lastNameRef = useRef<HTMLHeadingElement>(null);
    const roleRef = useRef<HTMLDivElement>(null);
    const scrollCueRef = useRef<HTMLDivElement>(null);

    // EXISTING ABOUT HERO
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const descWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const introCardRef = useRef<HTMLDivElement>(null);
    const imageWrapRef = useRef<HTMLDivElement>(null);
    const floatingCardRef = useRef<HTMLDivElement>(null);

    const isMobile = useIsMobile();
    const { lang } = useLang();

    // =========================================================
    // THREE.JS PARTICLES
    // =========================================================

    useEffect(() => {
        if (isMobile) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );

        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });

        renderer.setSize(
            canvas.clientWidth,
            canvas.clientHeight,
            false
        );

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        // PARTICLES
        const particleCount = 240;

        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(
            particleCount * 3
        );

        for (
            let i = 0;
            i < particleCount * 3;
            i += 3
        ) {
            positions[i] =
                (Math.random() - 0.5) * 15;

            positions[i + 1] =
                (Math.random() - 0.5) * 12;

            positions[i + 2] =
                (Math.random() - 0.5) * 10;
        }

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );

        const material = new THREE.PointsMaterial({
            color: 0x5470eb,
            size: 0.03,
            transparent: true,
            opacity: 0.65,
        });

        const particles = new THREE.Points(
            geometry,
            material
        );

        scene.add(particles);

        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(
                animate
            );

            particles.rotation.y += 0.0025;
            particles.rotation.x += 0.0008;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;

            if (w === 0 || h === 0) return;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            renderer.setSize(w, h, false);
        };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {
            cancelAnimationFrame(animationId);

            window.removeEventListener(
                "resize",
                handleResize
            );

            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, [isMobile]);

    // =========================================================
    // GSAP
    // =========================================================

    useEffect(() => {
        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        const firstName = firstNameRef.current;
        const lastName = lastNameRef.current;
        const description = subtitleRef.current;

        if (!firstName || !lastName) return;

        // =====================================================
        // REDUCED MOTION
        // =====================================================

        if (prefersReducedMotion) {
            gsap.set(
                [
                    firstName,
                    lastName,
                    roleRef.current,
                    scrollCueRef.current,
                    description,
                    introCardRef.current,
                    imageWrapRef.current,
                ],
                {
                    opacity: 1,
                    clearProps: "filter,transform",
                }
            );

            return;
        }

        const tl = gsap.timeline({
            defaults: {
                ease: "power3.inOut",
            },
        });

        // =====================================================
        // 1. ARJUN & RAO — CINEMA TITLE (LETTER SPACING)
        // =====================================================

        tl.fromTo(
            [firstName, lastName],
            {
                letterSpacing: isMobile ? "0.4em" : "1.2em",
                opacity: 0,
                filter: "blur(10px)",
            },
            {
                letterSpacing: "-0.06em",
                opacity: 1,
                filter: "blur(0px)",
                duration: 2.0,
                ease: "power3.inOut",
                stagger: 0.15,
            },
            0
        );

        // =====================================================
        // 3. PROFESSION
        // =====================================================

        if (roleRef.current) {
            tl.fromTo(
                roleRef.current,
                {
                    opacity: 0,
                    y: 20,
                    filter: "blur(6px)",
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.7,
                    ease: "power2.out",
                },
                0.75
            );
        }

        // =====================================================
        // 4. SCROLL CUE
        // =====================================================

        if (scrollCueRef.current) {
            tl.fromTo(
                scrollCueRef.current,
                {
                    opacity: 0,
                    y: 15,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                },
                1.15
            );
        }

        // =====================================================
        // 5. ABOUT DESCRIPTION — SLOW BLUE WORD COLOR SWEEP
        // =====================================================

        const descWords = descWordRefs.current.filter(Boolean) as HTMLSpanElement[];

        if (description && descWords.length > 0) {
            tl.fromTo(
                description,
                {
                    opacity: 0,
                    y: 20,
                    filter: "blur(6px)",
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "power2.out",
                },
                1.1
            );

            gsap.set(descWords, {
                color: "rgba(255,255,255,0.35)",
            });

            // Slow blue sweep through words
            tl.to(
                descWords,
                {
                    color: "#5470EB",
                    stagger: 0.08,
                    duration: 0.6,
                    ease: "none",
                },
                1.3
            );

            // Slow return to pure white
            tl.to(
                descWords,
                {
                    color: "#ffffff",
                    stagger: 0.08,
                    duration: 0.8,
                    ease: "power2.out",
                },
                2.1
            );
        }

        // =====================================================
        // 6. EXISTING INTRO CARD
        // =====================================================

        if (introCardRef.current) {
            tl.fromTo(
                introCardRef.current,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                },
                1.4
            );
        }

        // =====================================================
        // 7. EXISTING IMAGE
        // =====================================================

        if (imageWrapRef.current) {
            tl.fromTo(
                imageWrapRef.current,
                {
                    opacity: 0,
                    x: isMobile ? 0 : 40,
                    y: isMobile ? 30 : 0,
                    scale: 0.96,
                },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 1.1,
                    ease: "power3.out",
                },
                1.3
            );
        }

        // =====================================================
        // 8. FLOATING CARD
        // =====================================================

        if (floatingCardRef.current) {
            gsap.to(
                floatingCardRef.current,
                {
                    y: -10,
                    repeat: -1,
                    yoyo: true,
                    duration: 2.5,
                    ease: "sine.inOut",
                }
            );
        }

        // =====================================================
        // 9. CLEANUP
        // =====================================================

        return () => {
            tl.kill();

            if (floatingCardRef.current) {
                gsap.killTweensOf(
                    floatingCardRef.current
                );
            }
        };
    }, [isMobile]);

    // =========================================================
    // JSX
    // =========================================================

    return (
        <section className="about-dark-section about-hero">

            {/* =================================================
                LANDING HERO
            ================================================= */}

            <div
                className="
                    relative
                    z-10
                    flex
                    min-h-fit
                    sm:min-h-[100svh]
                    w-full
                    flex-col
                    justify-start
                    sm:justify-center
                    px-6
                    pt-20
                    pb-6
                    sm:px-10
                    sm:pt-0
                    sm:pb-0
                    lg:px-16
                "
            >
                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1600px]
                    "
                >

                    {/* =========================================
                        ARJUN
                    ========================================= */}

                    <div className="overflow-hidden">
                        <h1
                            ref={firstNameRef}
                            className="
                                select-none
                                text-[clamp(4.5rem,14vw,14rem)]
                                font-normal
                                leading-[0.8]
                                tracking-[-0.06em]
                                text-white
                                will-change-transform
                            "
                            style={{ fontFamily: 'var(--font-display), "Instrument Serif", serif' }}
                        >
                            ARJUN
                        </h1>
                    </div>

                    {/* =========================================
                        RAO
                    ========================================= */}

                    <div
                        className="
                            mt-1
                            overflow-hidden
                            sm:mt-2
                        "
                    >
                        <h1
                            ref={lastNameRef}
                            className="
                                select-none
                                text-[clamp(4.5rem,14vw,14rem)]
                                font-normal
                                leading-[0.8]
                                tracking-[-0.06em]
                                text-white
                                will-change-transform
                            "
                            style={{ fontFamily: 'var(--font-display), "Instrument Serif", serif' }}
                        >
                            RAO
                        </h1>
                    </div>

                    {/* =========================================
                        ROLE + SCROLL
                    ========================================= */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-col
                            gap-4
                            border-t
                            border-white/10
                            pt-4
                            sm:mt-12
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                            sm:gap-6
                            sm:pt-6
                        "
                    >

                        <p
                            ref={roleRef}
                            className="
                                text-sm
                                font-medium
                                tracking-wide
                                text-white/70
                                sm:text-base
                                lg:text-lg
                            "
                            style={{ fontFamily: 'var(--font-body), "Manrope", sans-serif' }}
                        >
                            AI / Full Stack Engineer
                        </p>

                        <div
                            ref={scrollCueRef}
                            className="
                                flex
                                items-center
                                gap-2
                                text-xs
                                uppercase
                                tracking-[0.25em]
                                text-white/50
                            "
                            style={{ fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace' }}
                        >
                            <span>
                                Scroll to explore
                            </span>

                            <svg
                                className="
                                    h-4
                                    w-4
                                    animate-bounce
                                "
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        </div>

                    </div>
                </div>
            </div>

            {/* =================================================
                THREE.JS PARTICLES
            ================================================= */}

            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />

            {/* =================================================
                EXISTING ABOUT CONTENT
            ================================================= */}

            <div
                className="
                    about-hero-content
                    pt-4
                    pb-16
                    sm:pt-16
                    sm:pb-28
                "
            >
                <div className="hero-grid">

                    {/* =========================================
                        LEFT
                    ========================================= */}

                    <div className="hero-left-col">

                        <p
                            ref={subtitleRef}
                            className="hero-description"
                            style={{
                                fontSize: "1.25rem",
                                lineHeight: 1.9,
                                color: "rgba(255, 255, 255, 0.3)",
                            }}
                        >
                            {t(translations.about.heroDesc2, lang)
                                .split(" ")
                                .map((word, idx) => (
                                    <span
                                        key={idx}
                                        ref={(el) => {
                                            descWordRefs.current[idx] = el;
                                        }}
                                        className="inline-block mr-[0.28em]"
                                    >
                                        {word}
                                    </span>
                                ))}
                        </p>

                        <div
                            ref={introCardRef}
                            className="hero-info-card"
                        >
                            <div className="hero-tags">
                                <span>
                                    React
                                </span>

                                <span>
                                    Three.js
                                </span>

                                <span>
                                    AI Systems
                                </span>

                                <span>
                                    Japan
                                </span>
                            </div>

                            <div className="hero-buttons">

                                <Link
                                    href="/projects"
                                    className="hero-primary-btn"
                                >
                                    {t(
                                        translations
                                            .about
                                            .viewProjects,
                                        lang
                                    )}
                                </Link>

                                <Link
                                    href="/socials"
                                    className="hero-secondary-btn"
                                >
                                    {t(
                                        translations
                                            .about
                                            .contact,
                                        lang
                                    )}
                                </Link>

                            </div>
                        </div>

                    </div>

                    {/* =========================================
                        RIGHT
                    ========================================= */}

                    <div
                        ref={imageWrapRef}
                        className="hero-image-wrapper"
                    >

                        <div className="hero-image-glow" />

                        <div className="hero-image-frame">

                            <Image
                                src="/me2.jpeg"
                                alt="Arjun Rao"
                                width={1400}
                                height={1200}
                                priority
                                className="hero-image"
                            />

                        </div>

                        <div
                            ref={floatingCardRef}
                            className="hero-floating-card"
                        >

                            <p className="floating-label">
                                {t(
                                    translations.about
                                        .status,
                                    lang
                                )}
                            </p>

                            <p className="floating-text">
                                {t(
                                    translations.about
                                        .statusText,
                                    lang
                                )}
                            </p>

                        </div>

                    </div>

                </div>
            </div>

        </section>
    );
}
