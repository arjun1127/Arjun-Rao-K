"use client";

import { useCallback, useEffect, useMemo, useRef, lazy, Suspense } from "react";
import { animate, stagger } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";

import SiteNav from "../shared/SiteNav";
import useIsMobile from "../../hooks/useIsMobile";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";

import { projects } from "./projectsData";

const ShaderButtons = lazy(() =>
    import("@designcodeio/threeui").then((mod) => ({ default: mod.ShaderButtons }))
);

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
    const pageRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cardsMapRef = useRef<Map<string | number, HTMLElement>>(new Map());

    const isMobile = useIsMobile();
    const { lang } = useLang();

    const localizedProjects = useMemo(() => {
        return projects.map((p) => ({
            ...p,
            category: typeof p.category === "object" ? p.category[lang] || p.category.en : p.category,
            description: typeof p.description === "object" ? p.description[lang] || p.description.en : p.description,
            type: typeof p.type === "object" ? p.type[lang] || p.type.en : p.type,
        }));
    }, [lang]);

    /*
     * ---------------------------------------------------------
     * PROJECT CARD ENTRANCE
     * ---------------------------------------------------------
     */

    const animateProjectEnter = useCallback(() => {
        const cards = Array.from(cardsMapRef.current.values());

        if (!cards.length) return;

        animate(cards, {
            opacity: [0, 1],
            translateY: [80, 0],
            scale: [0.94, 1],
            delay: stagger(120),
            duration: 850,
            ease: "outExpo",
        });
    }, []);

    /*
     * ---------------------------------------------------------
     * GSAP PAGE ANIMATIONS
     * ---------------------------------------------------------
     */

    useEffect(() => {
        if (isMobile) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".projects-title",
                {
                    y: 80,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power4.out",
                }
            );

            gsap.fromTo(
                ".projects-subtitle",
                {
                    y: 28,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    delay: 0.2,
                }
            );

            gsap.from(".project-card", {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.16,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".projects-grid",
                    start: "top 82%",
                },
            });
        }, pageRef);

        return () => ctx.revert();
    }, [isMobile]);

    useEffect(() => {
        animateProjectEnter();
    }, [animateProjectEnter]);

    /*
     * ---------------------------------------------------------
     * THREE.JS PARTICLE BACKGROUND
     * SAME VISUAL LANGUAGE AS CONTACTS PAGE
     * ---------------------------------------------------------
     */

    useEffect(() => {
        if (isMobile) return;

        const canvas = canvasRef.current;
        const section = projectsRef.current;

        if (!canvas || !section) return;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            62,
            canvas.clientWidth / Math.max(canvas.clientHeight, 1),
            0.1,
            100
        );

        camera.position.z = 5.7;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.setSize(
            canvas.clientWidth,
            canvas.clientHeight
        );

        /*
         * PARTICLES
         */

        const particleCount = 500;

        const particlePositions = new Float32Array(
            particleCount * 3
        );

        const particleVelocity = new Float32Array(
            particleCount
        );

        for (let i = 0; i < particleCount; i += 1) {
            const i3 = i * 3;

            particlePositions[i3] =
                (Math.random() - 0.5) * 18;

            particlePositions[i3 + 1] =
                (Math.random() - 0.5) * 12;

            particlePositions[i3 + 2] =
                (Math.random() - 0.5) * 6;

            particleVelocity[i] =
                0.002 + Math.random() * 0.005;
        }

        const particleGeometry =
            new THREE.BufferGeometry();

        particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                particlePositions,
                3
            )
        );

        const particleMaterial =
            new THREE.PointsMaterial({
                color: 0x5470eb,
                size: 0.028,
                transparent: true,
                opacity: 0.75,
                sizeAttenuation: true,
            });

        const particles = new THREE.Points(
            particleGeometry,
            particleMaterial
        );

        scene.add(particles);

        /*
         * NETWORK LINES
         */

        const lineSegmentsCount = 70;

        const linePositions =
            new Float32Array(
                lineSegmentsCount * 6
            );

        for (
            let i = 0;
            i < lineSegmentsCount;
            i += 1
        ) {
            const i6 = i * 6;

            linePositions[i6] =
                (Math.random() - 0.5) * 18;

            linePositions[i6 + 1] =
                (Math.random() - 0.5) * 12;

            linePositions[i6 + 2] =
                (Math.random() - 0.5) * 6;

            linePositions[i6 + 3] =
                linePositions[i6] +
                (Math.random() - 0.5) * 1.8;

            linePositions[i6 + 4] =
                linePositions[i6 + 1] +
                (Math.random() - 0.5) * 1.5;

            linePositions[i6 + 5] =
                linePositions[i6 + 2] +
                (Math.random() - 0.5) * 1.5;
        }

        const linesGeometry =
            new THREE.BufferGeometry();

        linesGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                linePositions,
                3
            )
        );

        const linesMaterial =
            new THREE.LineBasicMaterial({
                color: 0x5470eb,
                transparent: true,
                opacity: 0.14,
            });

        const lines = new THREE.LineSegments(
            linesGeometry,
            linesMaterial
        );

        scene.add(lines);

        /*
         * ANIMATION LOOP
         */

        const particlePositionAttr =
            particleGeometry.getAttribute(
                "position"
            ) as THREE.BufferAttribute;

        let frameId = 0;

        const draw = () => {
            const time =
                performance.now() * 0.001;

            for (
                let i = 0;
                i < particleCount;
                i += 1
            ) {
                const i3 = i * 3;

                particlePositions[i3 + 1] +=
                    particleVelocity[i];

                particlePositions[i3] +=
                    Math.sin(time + i * 0.1) *
                    0.0005;

                if (
                    particlePositions[i3 + 1] >
                    6
                ) {
                    particlePositions[i3 + 1] =
                        -6;
                }
            }

            particlePositionAttr.needsUpdate =
                true;

            particles.rotation.z += 0.0005;
            lines.rotation.z -= 0.0003;

            renderer.render(scene, camera);

            frameId =
                requestAnimationFrame(draw);
        };

        draw();

        /*
         * RESIZE
         */

        const resize = () => {
            const width =
                canvas.clientWidth;

            const height =
                Math.max(
                    canvas.clientHeight,
                    1
                );

            camera.aspect =
                width / height;

            camera.updateProjectionMatrix();

            renderer.setSize(
                width,
                height
            );
        };

        window.addEventListener(
            "resize",
            resize
        );

        /*
         * SCROLL CAMERA
         */

        const cameraTween = gsap.to(
            camera.position,
            {
                z: 5,
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                },
            }
        );

        return () => {
            cancelAnimationFrame(frameId);

            window.removeEventListener(
                "resize",
                resize
            );

            cameraTween.scrollTrigger?.kill();
            cameraTween.kill();

            particleGeometry.dispose();
            particleMaterial.dispose();

            linesGeometry.dispose();
            linesMaterial.dispose();

            renderer.dispose();
        };
    }, [isMobile]);

    /*
     * ---------------------------------------------------------
     * CARD HOVER
     * ---------------------------------------------------------
     */

    const handleCardEnter = useCallback(
        (card: HTMLElement) => {
            animate(card, {
                translateY: -10,
                scale: 1.025,
                boxShadow:
                    "0 0 48px rgba(84,112,235,0.28)",
                duration: 280,
                ease: "outExpo",
            });
        },
        []
    );

    const handleCardLeave = useCallback(
        (card: HTMLElement) => {
            animate(card, {
                translateY: 0,
                scale: 1,
                boxShadow:
                    "0 0 0 rgba(84,112,235,0)",
                duration: 280,
                ease: "outExpo",
            });
        },
        []
    );

    /*
     * ---------------------------------------------------------
     * RENDER
     * ---------------------------------------------------------
     */

    return (
        <main
            ref={pageRef}
            className="projects-page"
        >


            <div className="projects-scene-wrap">
                <canvas
                    ref={canvasRef}
                    className="projects-canvas"
                />
            </div>

            <section className="projects-hero">
                <div className="projects-hero-inner">
                    <p className="projects-kicker">
                        Selected Work
                    </p>

                    <h1 className="projects-title">
                        Projects
                    </h1>

                    <p className="projects-subtitle">
                        Things I've designed,
                        engineered and brought
                        to life.
                    </p>
                </div>
            </section>

            <section
                ref={projectsRef}
                className="projects-section"
            >
                <div className="projects-shell">
                    <div className="projects-shell-head">
                        <div>
                            <p className="projects-section-kicker">
                                2024 — 2026
                            </p>

                            <h2>
                                Selected work
                            </h2>
                        </div>

                        <span className="projects-count">
                            {String(
                                localizedProjects.length
                            ).padStart(2, "0")}{" "}
                            Projects
                        </span>
                    </div>

                    <div className="projects-grid">
                        {localizedProjects.map((project, index) => {
                            const projectNumber = String(index + 1).padStart(2, "0");
                            const href = project.live || project.github || "#";
                            return (
                                <article
                                    key={project.id}
                                    ref={(element) => {
                                        if (element) {
                                            cardsMapRef.current.set(
                                                project.id,
                                                element
                                            );
                                            return;
                                        }

                                        cardsMapRef.current.delete(project.id);
                                    }}
                                    className="project-card"
                                    onMouseEnter={(event) =>
                                        handleCardEnter(event.currentTarget)
                                    }
                                    onMouseLeave={(event) =>
                                        handleCardLeave(event.currentTarget)
                                    }
                                >
                                    <div className="project-card-inner">

                                        {/* FRONT */}
                                        <div className="project-card-face project-card-front">

                                            <div className="project-card-top">
                                                <span className="project-number">
                                                    {projectNumber}
                                                </span>

                                                <span className="project-year">
                                                    {project.year}
                                                </span>
                                            </div>

                                            <div className="project-card-main">
                                                <div>
                                                    <h3>
                                                        {project.title}
                                                    </h3>

                                                    <p>
                                                        {project.description}
                                                    </p>
                                                </div>

                                                <ArrowUpRight
                                                    className="project-arrow"
                                                    size={26}
                                                />
                                            </div>

                                            <div className="project-card-footer">

                                                <div className="project-tags">
                                                    {project.tech.map((tag) => (
                                                        <span key={tag}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="project-actions">
                                                    <a
                                                        href={project.live || "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="project-induction-wrap"
                                                    >
                                                        <Suspense fallback={<div className="hero-primary-btn">View Project</div>}>
                                                            <ShaderButtons
                                                                variant="induction-button"
                                                                mode="dark"
                                                                hue={0}
                                                                saturation={1.00}
                                                                brightness={1.00}
                                                            />
                                                        </Suspense>
                                                        <span className="absolute inset-0 z-20" aria-label="View Project" />
                                                    </a>

                                                    {project.github &&
                                                        project.github !== "#" && (
                                                            <a
                                                                href={project.github}
                                                                className="project-github"
                                                                aria-label="GitHub"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Github size={17} />
                                                            </a>
                                                        )}
                                                </div>

                                            </div>

                                        </div>

                                        {/* BACK */}
                                        <div className="project-card-face project-card-back">

                                            <img
                                                src={project.image}
                                                alt={`${project.title} preview`}
                                                className="project-card-image"
                                            />

                                            <div className="project-card-back-overlay">
                                                <span>
                                                    {projectNumber}
                                                </span>

                                                <h3>
                                                    {project.title}
                                                </h3>

                                                <a
                                                    href={project.live || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="project-induction-wrap mt-2"
                                                >
                                                    <Suspense fallback={<div className="hero-primary-btn">View Project</div>}>
                                                        <ShaderButtons
                                                            variant="induction-button"
                                                            mode="dark"
                                                            hue={0}
                                                            saturation={1.00}
                                                            brightness={1.00}
                                                        />
                                                    </Suspense>
                                                    <span className="absolute inset-0 z-20" aria-label="View Project" />
                                                </a>
                                            </div>

                                        </div>

                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="projects-closing">
                <p>
                    More experiments are always
                    in progress.
                </p>

                <h2>
                    Building the next one.
                </h2>
            </section>
        </main>
    );
}