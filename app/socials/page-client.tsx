"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { animate, stagger } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { Code2, Instagram, Play, Send, Youtube } from "lucide-react";
import SiteNav from "../components/shared/SiteNav";
import useIsMobile from "../hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

type HubCard = {
    id: string;
    title: string;
    lines: string[];
    cta: string;
    href: string;
    icon: "instagram" | "youtube" | "store" | "contact";
};

const hubCards: HubCard[] = [
    {
        id: "instagram",
        title: "Instagram",
        lines: ["Short visual updates", "Design experiments", "UI ideas in motion"],
        cta: "Visit Instagram",
        href: "https://www.instagram.com/_code_store/",
        icon: "instagram",
    },
    {
        id: "youtube",
        title: "YouTube",
        lines: ["Technical walkthroughs", "Project breakdowns", "Engineering experiments"],
        cta: "Watch Channel",
        href: "https://www.youtube.com/@CODE_STORE",
        icon: "youtube",
    },
    {
        id: "store",
        title: "CODE[STORE]",
        lines: ["Reusable code systems", "Animation templates", "Production-ready patterns"],
        cta: "Open Store",
        href: "https://code-store-1.onrender.com/",
        icon: "store",
    },
    {
        id: "contact",
        title: "Direct Contact",
        lines: ["Project inquiry", "Freelance discussion", "Collaboration kickoff"],
        cta: "Open Form",
        href: "#contact-form",
        icon: "contact",
    },
];

export default function Socials() {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const hubRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);
    const submitBtnRef = useRef<HTMLButtonElement>(null);
    const successRef = useRef<HTMLDivElement>(null);
    const cardsMapRef = useRef<Map<string, HTMLElement>>(new Map());

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const isMobile = useIsMobile();

    const moduleNodes = useMemo(
        () =>
            hubCards.map((card) => ({
                id: card.id,
                label:
                    card.id === "store" ? "CODE[STORE]" : card.id === "contact" ? "Contact" : card.title,
            })),
        []
    );

    const animateCardEnter = useCallback(() => {
        const cards = Array.from(cardsMapRef.current.values());
        if (!cards.length) return;

        animate(cards, {
            opacity: [0, 1],
            translateY: [70, 0],
            scale: [0.92, 1],
            delay: stagger(140),
            duration: 760,
            ease: "outExpo",
        });
    }, []);

    useEffect(() => {
        if (isMobile) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".connect-title",
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
            );
            gsap.fromTo(
                ".connect-subtitle",
                { y: 28, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 }
            );

            gsap.from(".hub-node", {
                y: 24,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".hub-node-map",
                    start: "top 86%",
                },
            });

            gsap.from(".hub-card", {
                y: 80,
                opacity: 0,
                duration: 0.9,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".hub-grid",
                    start: "top 80%",
                },
            });

            gsap.from(".social-form-shell", {
                y: 80,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".social-form-section",
                    start: "top 82%",
                },
            });
        }, pageRef);

        return () => ctx.revert();
    }, [isMobile]);

    useEffect(() => {
        animateCardEnter();
    }, [animateCardEnter]);

    useEffect(() => {
        if (isMobile) return;
        const playPulse = animate(".play-icon", {
            scale: [1, 1.15],
            direction: "alternate",
            loop: true,
            duration: 900,
            ease: "inOutSine",
        });

        const codeFlow = animate(".code-line", {
            translateX: [0, 8],
            direction: "alternate",
            loop: true,
            duration: 680,
            ease: "inOutSine",
            delay: stagger(110),
        });

        return () => {
            playPulse.pause();
            codeFlow.pause();
        };
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) return;
        const canvas = canvasRef.current;
        const section = hubRef.current;
        if (!canvas || !section) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            52,
            canvas.clientWidth / Math.max(canvas.clientHeight, 1),
            0.1,
            100
        );
        camera.position.z = 6.1;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const particleCount = 280;
        const particlePositions = new Float32Array(particleCount * 3);
        const particleVelocity = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i += 1) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * 8.4;
            particlePositions[i3 + 1] = (Math.random() - 0.5) * 4.6;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 3.5;
            particleVelocity[i] = 0.002 + Math.random() * 0.005;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x5470eb,
            size: 0.028,
            transparent: true,
            opacity: 0.75,
            sizeAttenuation: true,
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        const lineSegmentsCount = 34;
        const linePositions = new Float32Array(lineSegmentsCount * 6);
        for (let i = 0; i < lineSegmentsCount; i += 1) {
            const i6 = i * 6;
            linePositions[i6] = (Math.random() - 0.5) * 8;
            linePositions[i6 + 1] = (Math.random() - 0.5) * 4.2;
            linePositions[i6 + 2] = (Math.random() - 0.5) * 2.8;

            linePositions[i6 + 3] = linePositions[i6] + (Math.random() - 0.5) * 1.3;
            linePositions[i6 + 4] = linePositions[i6 + 1] + (Math.random() - 0.5) * 1.1;
            linePositions[i6 + 5] = linePositions[i6 + 2] + (Math.random() - 0.5) * 1.1;
        }

        const linesGeometry = new THREE.BufferGeometry();
        linesGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        const linesMaterial = new THREE.LineBasicMaterial({
            color: 0x5470eb,
            transparent: true,
            opacity: 0.14,
        });
        const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
        scene.add(lines);

        const particlePositionAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
        let frameId = 0;

        const draw = () => {
            const t = performance.now() * 0.001;

            for (let i = 0; i < particleCount; i += 1) {
                const i3 = i * 3;
                particlePositions[i3 + 1] += particleVelocity[i];
                particlePositions[i3] += Math.sin(t + i * 0.1) * 0.0005;

                if (particlePositions[i3 + 1] > 2.5) {
                    particlePositions[i3 + 1] = -2.5;
                }
            }

            particlePositionAttr.needsUpdate = true;
            particles.rotation.z += 0.0005;
            lines.rotation.z -= 0.0003;

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(draw);
        };
        draw();

        const resize = () => {
            const width = canvas.clientWidth;
            const height = Math.max(canvas.clientHeight, 1);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener("resize", resize);

        const cameraTween = gsap.to(camera.position, {
            z: 5,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
        });

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", resize);
            cameraTween.scrollTrigger?.kill();
            cameraTween.kill();
            particleGeometry.dispose();
            particleMaterial.dispose();
            linesGeometry.dispose();
            linesMaterial.dispose();
            renderer.dispose();
        };
    }, [isMobile]);

    const handleCardEnter = useCallback((card: HTMLElement) => {
        animate(card, {
            translateY: -10,
            scale: 1.05,
            boxShadow: "0 0 48px rgba(84,112,235,0.28)",
            duration: 250,
            ease: "outExpo",
        });
    }, []);

    const handleCardLeave = useCallback((card: HTMLElement) => {
        animate(card, {
            translateY: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(84,112,235,0)",
            duration: 250,
            ease: "outExpo",
        });
    }, []);

    const handleInputFocus = useCallback((target: HTMLInputElement | HTMLTextAreaElement) => {
        animate(target, {
            borderColor: "#5470eb",
            boxShadow: "0 0 0 3px rgba(84,112,235,0.18)",
            duration: 300,
            ease: "outQuad",
        });
    }, []);

    const handleInputBlur = useCallback((target: HTMLInputElement | HTMLTextAreaElement) => {
        animate(target, {
            borderColor: "rgba(84,112,235,0.35)",
            boxShadow: "0 0 0 0 rgba(84,112,235,0)",
            duration: 280,
            ease: "outQuad",
        });
    }, []);

    const jumpToCard = useCallback((cardId: string) => {
        const card = cardsMapRef.current.get(cardId);
        if (!card) return;

        card.scrollIntoView({ behavior: "smooth", block: "center" });
        animate(card, {
            scale: [1, 1.03, 1],
            duration: 520,
            ease: "outExpo",
        });
    }, []);

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (isSubmitting) return;

            setIsSubmitting(true);
            setIsSent(false);

            if (submitBtnRef.current) {
                animate(submitBtnRef.current, {
                    scale: [1, 0.92, 1],
                    duration: 420,
                    ease: "outExpo",
                });
            }

            window.setTimeout(() => {
                setIsSubmitting(false);
                setIsSent(true);

                if (successRef.current) {
                    animate(successRef.current, {
                        opacity: [0, 1],
                        translateY: [8, 0],
                        duration: 420,
                        ease: "outExpo",
                    });
                }
            }, 1100);
        },
        [isSubmitting]
    );

    return (
        <main ref={pageRef} className="social-page">
            <SiteNav />
            <section ref={heroRef} className="social-hero">
                <div className="social-hero-inner">
                    <p className="social-kicker">Communication Hub</p>
                    <h1 className="connect-title">CONNECT</h1>
                    <p className="connect-subtitle">Choose how you want to reach me.</p>
                </div>
            </section>

            <section ref={hubRef} className="social-hub-section">
                <div className="social-hub-shell">
                    <h2>Communication Hub</h2>
                    <p>Pick your preferred channel, then continue the conversation.</p>

                    <div className="hub-scene-wrap">
                        <canvas ref={canvasRef} className="hub-canvas" />
                        <div className="hub-node-map">
                            {moduleNodes.map((node) => (
                                <button
                                    key={node.id}
                                    type="button"
                                    className={`hub-node hub-node-${node.id}`}
                                    onClick={() => jumpToCard(node.id)}
                                >
                                    <span>{node.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="hub-grid">
                        {hubCards.map((card) => (
                            <article
                                key={card.id}
                                ref={(element) => {
                                    if (element) {
                                        cardsMapRef.current.set(card.id, element);
                                        return;
                                    }
                                    cardsMapRef.current.delete(card.id);
                                }}
                                className={`hub-card hub-card-${card.id}`}
                                onMouseEnter={(event) => handleCardEnter(event.currentTarget)}
                                onMouseLeave={(event) => handleCardLeave(event.currentTarget)}
                            >
                                <div className="hub-card-head">
                                    <div className="hub-card-icon">
                                        {card.icon === "instagram" && <Instagram size={20} />}
                                        {card.icon === "youtube" && <Youtube size={20} />}
                                        {card.icon === "store" && <Code2 size={20} />}
                                        {card.icon === "contact" && <Send size={20} />}
                                    </div>
                                    <h3>{card.title}</h3>
                                </div>

                                {card.id === "youtube" && (
                                    <div className="hub-play-wrap">
                                        <Play className="play-icon" size={16} />
                                        <span>Media Feed</span>
                                    </div>
                                )}

                                {card.id === "store" && (
                                    <div className="hub-code-lines">
                                        <span className="code-line">&lt;code /&gt;</span>
                                        <span className="code-line">&lt;/&gt;</span>
                                        <span className="code-line">const motion = true;</span>
                                    </div>
                                )}

                                <ul>
                                    {card.lines.map((line) => (
                                        <li key={line}>{line}</li>
                                    ))}
                                </ul>

                                <a href={card.href} className="hub-link-btn">
                                    {card.cta}
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact-form" ref={contactRef} className="social-form-section">
                <div className="about-glossy-container social-form-shell">
                    <div className="social-form-head">
                        <h2>Send a Message</h2>
                        <p>Tell me about your idea, scope, and timeline.</p>
                    </div>

                    <form className="social-contact-form" onSubmit={handleSubmit}>
                        <label>
                            Name
                            <input
                                type="text"
                                name="name"
                                required
                                onFocus={(event) => handleInputFocus(event.currentTarget)}
                                onBlur={(event) => handleInputBlur(event.currentTarget)}
                            />
                        </label>
                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                required
                                onFocus={(event) => handleInputFocus(event.currentTarget)}
                                onBlur={(event) => handleInputBlur(event.currentTarget)}
                            />
                        </label>
                        <label>
                            Message
                            <textarea
                                name="message"
                                rows={5}
                                required
                                onFocus={(event) => handleInputFocus(event.currentTarget)}
                                onBlur={(event) => handleInputBlur(event.currentTarget)}
                            />
                        </label>

                        <button ref={submitBtnRef} className="social-submit-btn" type="submit">
                            {isSubmitting ? "Sending..." : "Send"}
                        </button>
                    </form>

                    <div
                        ref={successRef}
                        className={`social-submit-success ${isSent ? "visible" : ""}`}
                        aria-live="polite"
                    >
                        ✓ Message Sent
                    </div>
                </div>
            </section>

            <section className="social-closing-cta">
                <h2>Let us build something with intent.</h2>
                <a href="/projects" className="social-closing-link">
                    Explore Projects
                </a>
            </section>
        </main>
    );
}
