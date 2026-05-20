"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import useIsMobile from "../../hooks/useIsMobile";

export default function AboutHero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    const introCardRef = useRef<HTMLDivElement>(null);
    const imageWrapRef = useRef<HTMLDivElement>(null);
    const floatingCardRef = useRef<HTMLDivElement>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    const isMobile = useIsMobile();

    // THREE PARTICLES
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

        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // PARTICLES
        const particleCount = 240;

        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(particleCount * 3);

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

        const particles = new THREE.Points(geometry, material);

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

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            renderer.setSize(w, h);
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

    // GSAP
    useEffect(() => {
        const tl = gsap.timeline({
            defaults: {
                ease: "power4.out",
            },
        });

        tl.fromTo(
            titleRef.current,
            {
                opacity: 0,
                y: 80,
            },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
            }
        )
            .fromTo(
                subtitleRef.current,
                {
                    opacity: 0,
                    y: 40,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                },
                "-=0.7"
            )
            .fromTo(
                introCardRef.current,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                },
                "-=0.5"
            )
            .fromTo(
                imageWrapRef.current,
                {
                    opacity: 0,
                    x: 60,
                    scale: 0.96,
                },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 1.2,
                },
                "-=1"
            )
            .fromTo(
                scrollRef.current,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 1,
                },
                "-=0.4"
            );

        gsap.to(floatingCardRef.current, {
            y: -10,
            repeat: -1,
            yoyo: true,
            duration: 2.5,
            ease: "sine.inOut",
        });

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <section className="about-dark-section about-hero">
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />

            <div className="about-hero-content">

                <div className="hero-grid">

                    {/* LEFT */}
                    <div className="hero-left-col">

                        <h1
                            ref={titleRef}
                            className="hero-main-title"
                        >
                            Arjun Rao
                        </h1>

                        <p
                            ref={subtitleRef}
                            className="hero-description"
                        >
                            ECE Graduate experienced in building
                            AI based Web Applications and Machine Learning systems

                            <br />
                            <br />

                            Currently exploring 3D web engineering, Blender, and Smart ways to improve one's Workflow and Systems.
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
                                    View Projects
                                </Link>

                                <Link
                                    href="/contact"
                                    className="hero-secondary-btn"
                                >
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
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
                                STATUS
                            </p>

                            <p className="floating-text">
                                2027 •  TOKYO 🇯🇵
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="scroll-indicator"
                >
                    Scroll to explore
                </div>
            </div>
        </section>
    );
}