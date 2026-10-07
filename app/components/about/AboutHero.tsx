"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import useIsMobile from "../../hooks/useIsMobile";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

export default function AboutHero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // ABOUT HERO REFS
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const descWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const introCardRef = useRef<HTMLDivElement>(null);
    const imageWrapRef = useRef<HTMLDivElement>(null);
    const floatingCardRef = useRef<HTMLDivElement>(null);

    // IMAGE REVEAL REFS
    const imgBlurredRef = useRef<HTMLDivElement>(null);
    const imgScanlineRef = useRef<HTMLDivElement>(null);
    const imgClearRef = useRef<HTMLDivElement>(null);
    const imgFrameRef = useRef<HTMLDivElement>(null);

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

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 15;
            positions[i + 1] = (Math.random() - 0.5) * 12;
            positions[i + 2] = (Math.random() - 0.5) * 10;
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
            animationId = requestAnimationFrame(animate);

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

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, [isMobile]);

    // =========================================================
    // GSAP SCROLL TRIGGER ANIMATIONS
    // =========================================================

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const description = subtitleRef.current;
        const introCard = introCardRef.current;
        const imageWrap = imageWrapRef.current;

        // REDUCED MOTION
        if (prefersReducedMotion) {
            if (description) gsap.set(description, { opacity: 1, clearProps: "filter,transform" });
            if (introCard) gsap.set(introCard, { opacity: 1, clearProps: "filter,transform" });
            if (imageWrap) gsap.set(imageWrap, { opacity: 1, clearProps: "filter,transform" });
            // Show clear image directly
            if (imgBlurredRef.current) gsap.set(imgBlurredRef.current, { opacity: 0 });
            if (imgScanlineRef.current) gsap.set(imgScanlineRef.current, { opacity: 0 });
            if (imgClearRef.current) gsap.set(imgClearRef.current, { opacity: 1 });
            return;
        }

        const descWords = descWordRefs.current.filter(Boolean) as HTMLSpanElement[];

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse",
            },
            defaults: {
                ease: "power3.out",
            },
        });

        // 1. ABOUT DESCRIPTION — SLOW BLUE WORD COLOR SWEEP
        if (description && descWords.length > 0) {
            tl.fromTo(
                description,
                {
                    opacity: 0,
                    y: 30,
                    filter: "blur(8px)",
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "power2.out",
                },
                0
            );

            gsap.set(descWords, {
                color: "rgba(255,255,255,0.35)",
            });

            // Slow blue sweep through words
            tl.to(
                descWords,
                {
                    color: "#5470EB",
                    stagger: 0.06,
                    duration: 0.5,
                    ease: "none",
                },
                0.2
            ).to(
                descWords,
                {
                    color: "#ffffff",
                    stagger: 0.06,
                    duration: 0.7,
                    ease: "power2.out",
                },
                0.7
            );
        }

        // 2. INTRO CARD
        if (introCard) {
            tl.fromTo(
                introCard,
                {
                    opacity: 0,
                    y: 35,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                0.3
            );
        }

        // 3. IMAGE WRAPPER
        if (imageWrap) {
            tl.fromTo(
                imageWrap,
                {
                    opacity: 0,
                    x: isMobile ? 0 : 40,
                    y: isMobile ? 30 : 0,
                    scale: 0.95,
                },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 1.0,
                    ease: "power3.out",
                },
                0.2
            );
        }

        // 4. FLOATING CARD CONTINUOUS FLOAT
        const floatingCard = floatingCardRef.current;
        if (floatingCard) {
            gsap.to(floatingCard, {
                y: -10,
                repeat: -1,
                yoyo: true,
                duration: 2.5,
                ease: "sine.inOut",
            });
        }

        // CLEANUP
        return () => {
            tl.kill();

            if (floatingCard) {
                gsap.killTweensOf(floatingCard);
            }

            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === section) st.kill();
            });
        };
    }, [isMobile]);

    // =========================================================
    // SCROLL-DRIVEN IMAGE REVEAL ANIMATION
    // =========================================================

    useEffect(() => {
        const frame = imgFrameRef.current;
        const blurred = imgBlurredRef.current;
        const scanline = imgScanlineRef.current;
        const clear = imgClearRef.current;

        if (!frame || !blurred || !scanline || !clear) return;

        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) return;

        // Initial state: blurred fully visible, others hidden
        gsap.set(blurred, { opacity: 1 });
        gsap.set(scanline, { opacity: 0, clipPath: "inset(0 100% 0 0)" });
        gsap.set(clear, { opacity: 0 });

        // Scroll-driven reveal timeline
        const revealTl = gsap.timeline({
            scrollTrigger: {
                trigger: frame,
                start: "top 80%",
                end: "bottom 20%",
                scrub: 1.2,
            },
        });

        // Phase 1 (0% → 40%): Scan-line image wipes in from left to right
        revealTl.to(
            scanline,
            {
                opacity: 1,
                clipPath: "inset(0 0% 0 0)",
                duration: 0.4,
                ease: "none",
            },
            0
        );

        // Phase 1b: Add a glitch flicker on the frame border during wipe
        revealTl.to(
            frame,
            {
                borderColor: "rgba(84, 112, 235, 0.6)",
                boxShadow: "0 20px 60px rgba(84, 112, 235, 0.25), inset 0 0 30px rgba(84, 112, 235, 0.08)",
                duration: 0.4,
                ease: "none",
            },
            0
        );

        // Phase 2 (40% → 70%): Clear image fades in over the scan-lines
        revealTl.to(
            clear,
            {
                opacity: 1,
                duration: 0.3,
                ease: "power2.inOut",
            },
            0.4
        );

        // Phase 2b: Fade out the blurred base
        revealTl.to(
            blurred,
            {
                opacity: 0,
                duration: 0.3,
                ease: "power2.inOut",
            },
            0.4
        );

        // Phase 3 (70% → 100%): Fade out scan-lines, only clear remains
        revealTl.to(
            scanline,
            {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
            },
            0.7
        );

        // Phase 3b: Frame settles into final style
        revealTl.to(
            frame,
            {
                borderColor: "rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                duration: 0.3,
                ease: "power2.out",
            },
            0.7
        );

        return () => {
            revealTl.kill();
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === frame) st.kill();
            });
        };
    }, []);

    // =========================================================
    // JSX
    // =========================================================

    return (
        <section ref={sectionRef} className="about-dark-section about-hero">
            {/* THREE.JS PARTICLES */}
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />

            {/* ABOUT CONTENT */}
            <div className="about-hero-content pt-12 pb-16 sm:pt-20 sm:pb-28">
                <div className="hero-grid">
                    {/* LEFT COL */}
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
                            {t(translations.about.heroDesc, lang)
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
                                <span>React</span>
                                <span>Three.js</span>
                                <span>AI Systems</span>
                                <span>Japan</span>
                            </div>

                            <div className="hero-buttons">
                                <Link
                                    href="/projects"
                                    className="hero-primary-btn"
                                >
                                    {t(translations.about.viewProjects, lang)}
                                </Link>

                                <Link
                                    href="/socials"
                                    className="hero-secondary-btn"
                                >
                                    {t(translations.about.contact, lang)}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL — SCROLL-REVEAL IMAGE STACK */}
                    <div
                        ref={imageWrapRef}
                        className="hero-image-wrapper"
                    >
                        <div className="hero-image-glow" />

                        <div ref={imgFrameRef} className="hero-image-frame">
                            {/* Layer 1: Blurred mosaic (base) */}
                            <div
                                ref={imgBlurredRef}
                                className="hero-image-layer"
                            >
                                <Image
                                    src="/ascii-magic-1.png"
                                    alt="Arjun Rao – pixelated"
                                    width={1400}
                                    height={1200}
                                    priority
                                    className="hero-image"
                                />
                            </div>

                            {/* Layer 2: Scan-line effect (mid reveal) */}
                            <div
                                ref={imgScanlineRef}
                                className="hero-image-layer hero-image-layer--scanline"
                            >
                                <Image
                                    src="/ascii-magic-3.png"
                                    alt="Arjun Rao – scan-lines"
                                    width={1400}
                                    height={1200}
                                    className="hero-image"
                                />
                            </div>

                            {/* Layer 3: Clear ASCII (final reveal) */}
                            <div
                                ref={imgClearRef}
                                className="hero-image-layer hero-image-layer--clear"
                            >
                                <Image
                                    src="/ascii-magic-2.png"
                                    alt="Arjun Rao – clear"
                                    width={1400}
                                    height={1200}
                                    className="hero-image"
                                />
                            </div>
                        </div>

                        <div
                            ref={floatingCardRef}
                            className="hero-floating-card"
                        >
                            <p className="floating-label">
                                {t(translations.about.status, lang)}
                            </p>

                            <p className="floating-text">
                                {t(translations.about.statusText, lang)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

