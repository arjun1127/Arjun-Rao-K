"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { animate, stagger } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { Code2, Github, Play, Send } from "lucide-react";
import SiteNav from "../components/shared/SiteNav";
import useIsMobile from "../hooks/useIsMobile";
import { useLang } from "../i18n/LangContext";
import { translations, t } from "../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

type HubCard = {
    id: string;
    title: string;
    lines: string[];
    cta: string;
    href: string;
    icon: "github" | "store" | "contact";
};

const hubCards: HubCard[] = [

    {
        id: "github",
        title: "github",
        lines: ["Open-source contributions", "Project repositories", "Code experiments"],
        cta: "View Profile",
        href: "https://github.com/arjun1127",
        icon: "github",
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
    const { lang } = useLang();

    const localizedCards = useMemo(() => [
        {
            id: "github",
            title: t(translations.socials.githubTitle, lang),
            lines: translations.socials.githubLines.map((l) => t(l, lang)),
            cta: t(translations.socials.githubCta, lang),
            href: "https://github.com/arjun1127",
            icon: "github" as const,
        },
        {
            id: "store",
            title: t(translations.socials.storeTitle, lang),
            lines: translations.socials.storeLines.map((l) => t(l, lang)),
            cta: t(translations.socials.storeCta, lang),
            href: "https://code-store-1.onrender.com/",
            icon: "store" as const,
        },
        {
            id: "contact",
            title: t(translations.socials.contactTitle, lang),
            lines: translations.socials.contactLines.map((l) => t(l, lang)),
            cta: t(translations.socials.contactCta, lang),
            href: "#contact-form",
            icon: "contact" as const,
        },
    ], [lang]);



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
            62,
            canvas.clientWidth / Math.max(canvas.clientHeight, 1),
            0.1,
            100
        );
        camera.position.z = 5.7;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const particleCount = 500;
        const particlePositions = new Float32Array(particleCount * 3);
        const particleVelocity = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i += 1) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * 18.0;
            particlePositions[i3 + 1] = (Math.random() - 0.5) * 12.0;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 6.0;
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

        const lineSegmentsCount = 70;
        const linePositions = new Float32Array(lineSegmentsCount * 6);
        for (let i = 0; i < lineSegmentsCount; i += 1) {
            const i6 = i * 6;
            linePositions[i6] = (Math.random() - 0.5) * 18.0;
            linePositions[i6 + 1] = (Math.random() - 0.5) * 12.0;
            linePositions[i6 + 2] = (Math.random() - 0.5) * 6.0;

            linePositions[i6 + 3] = linePositions[i6] + (Math.random() - 0.5) * 1.8;
            linePositions[i6 + 4] = linePositions[i6 + 1] + (Math.random() - 0.5) * 1.5;
            linePositions[i6 + 5] = linePositions[i6 + 2] + (Math.random() - 0.5) * 1.5;
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

                if (particlePositions[i3 + 1] > 6.0) {
                    particlePositions[i3 + 1] = -6.0;
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
            <div className="social-hero-hub-wrap">
                <div className="hub-scene-wrap">
                    <canvas ref={canvasRef} className="hub-canvas" />
                </div>

                <section ref={heroRef} className="social-hero">
                    <div className="social-hero-inner">
                        <h1 className="connect-title">{t(translations.socials.connectTitle, lang)}</h1>
                        <p className="connect-subtitle">{t(translations.socials.connectSubtitle, lang)}</p>
                    </div>
                </section>

                <section ref={hubRef} className="social-hub-section">
                    <div className="social-hub-shell">
                        <div className="hub-grid">
                            {localizedCards.map((card) => (
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
                                            {card.icon === "github" && <Github size={20} />}
                                            {card.icon === "store" && <Code2 size={20} />}
                                            {card.icon === "contact" && <Send size={20} />}
                                        </div>
                                        <h3>{card.title}</h3>
                                    </div>

                                    {card.id === "store" && (
                                        <div className="hub-code-lines">
                                            <span className="code-line">&lt;code /&gt;</span>
                                            <span className="code-line">&lt;/&gt;</span>
                                            <span className="code-line">const motion = true;</span>
                                        </div>
                                    )}

                                    <ul>
                                        {card.lines.map((line, idx) => (
                                            <li key={line || idx}>{line}</li>
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
            </div>

            <section id="contact-form" ref={contactRef} className="social-form-section">
                <div className="about-glossy-container social-form-shell">
                    <div className="social-form-head">
                        <h2>{t(translations.socials.sendMessage, lang)}</h2>
                        <p>{t(translations.socials.formDesc, lang)}</p>
                    </div>

                    <form className="social-contact-form" onSubmit={handleSubmit}>
                        <label>
                            {t(translations.socials.nameLabel, lang)}
                            <input
                                type="text"
                                name="name"
                                required
                                onFocus={(event) => handleInputFocus(event.currentTarget)}
                                onBlur={(event) => handleInputBlur(event.currentTarget)}
                            />
                        </label>
                        <label>
                            {t(translations.socials.emailLabel, lang)}
                            <input
                                type="email"
                                name="email"
                                required
                                onFocus={(event) => handleInputFocus(event.currentTarget)}
                                onBlur={(event) => handleInputBlur(event.currentTarget)}
                            />
                        </label>
                        <label>
                            {t(translations.socials.messageLabel, lang)}
                            <textarea
                                name="message"
                                rows={5}
                                required
                                onFocus={(event) => handleInputFocus(event.currentTarget)}
                                onBlur={(event) => handleInputBlur(event.currentTarget)}
                            />
                        </label>

                        <button ref={submitBtnRef} className="social-submit-btn" type="submit">
                            {isSubmitting ? t(translations.socials.sending, lang) : t(translations.socials.send, lang)}
                        </button>
                    </form>

                    <div
                        ref={successRef}
                        className={`social-submit-success ${isSent ? "visible" : ""}`}
                        aria-live="polite"
                    >
                        {t(translations.socials.messageSent, lang)}
                    </div>
                </div>
            </section>

            <section className="social-closing-cta">
                <h2>{t(translations.socials.closingCta, lang)}</h2>

            </section>
        </main>
    );
}
