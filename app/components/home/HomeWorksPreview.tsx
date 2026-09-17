"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../projects/projectsData";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";
import { ExternalLink, ArrowRight, FolderKanban } from "lucide-react";
import "../shaders/threeui.css";

const ShaderButtons = lazy(() =>
    import("@designcodeio/threeui").then((mod) => ({ default: mod.ShaderButtons }))
);

const ConstellationField = lazy(() =>
    import("@designcodeio/threeui").then((mod) => ({ default: mod.ConstellationField }))
);

gsap.registerPlugin(ScrollTrigger);

export default function HomeWorksPreview() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageFrameRef = useRef<HTMLDivElement>(null);
    const liveBtnRef = useRef<HTMLAnchorElement>(null);
    const { lang } = useLang();

    // Select Yoga Portfolio project (id: 1)
    const yogaProject = projects.find((p) => p.id === 1) || projects[0];

    useEffect(() => {
        if (!liveBtnRef.current) return;
        const iframe = liveBtnRef.current.querySelector("iframe");
        if (!iframe) return;
        const sendMsg = () => {
            iframe.contentWindow?.postMessage({ btnText: "VISIT LIVE SITE" }, "*");
        };
        sendMsg();
        iframe.addEventListener("load", sendMsg);
        return () => iframe.removeEventListener("load", sendMsg);
    }, [lang]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 60, scale: 0.98 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                        end: "top 25%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            if (imageFrameRef.current) {
                gsap.fromTo(
                    imageFrameRef.current,
                    { opacity: 0, x: 40 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 70%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const projectDesc = typeof yogaProject.description === "string"
        ? yogaProject.description
        : t(yogaProject.description, lang);

    return (
        <section className="about-dark-section w-full py-12 lg:py-24">
            <div
                ref={containerRef}
                className="about-glossy-container works-preview-container mx-auto relative overflow-hidden transition-all"
                style={{ background: "transparent" }}
            >
                {/* THREEUI CONSTELLATION FIELD (CONNECTIVITY GRAPH) BACKGROUND */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[32px]">
                    <Suspense fallback={null}>
                        <ConstellationField
                            variant="connectivity-graph"
                            mode="light"
                            speed={1.00}
                            size={0.35}
                            length={1.50}
                            density={1.00}
                            opacity={1.00}
                            hue={0}
                            saturation={1.00}
                            brightness={1.00}
                        />
                    </Suspense>
                </div>

                <div ref={contentRef} className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

                    {/* LEFT SIDE: TEXT DETAILS */}
                    <div className="lg:col-span-6 flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5470eb]/10 border border-[#5470eb]/25 mb-6">
                                <FolderKanban className="w-3.5 h-3.5 text-[#5470eb]" />
                                <span className="text-xs uppercase tracking-widest font-semibold text-[#5470eb] font-mono">
                                    {t(translations.home.worksPreviewKicker, lang)}
                                </span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0c0c0c] tracking-tight mb-4">
                                {yogaProject.title}
                            </h2>

                            <p className="text-base sm:text-lg text-gray-700 font-sans leading-relaxed mb-6">
                                {projectDesc}
                            </p>

                            {/* TECH TAGS */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {yogaProject.tech.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1.5 rounded-lg bg-white/80 border border-gray-300 text-gray-800 text-xs font-mono font-medium shadow-xs"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200/80">
                            {yogaProject.live && (
                                <a
                                    ref={liveBtnRef}
                                    href={yogaProject.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="home-hero-induction-wrap"
                                >
                                    <Suspense fallback={<div className="hero-primary-btn">{t(translations.home.visitLiveSite, lang)}</div>}>
                                        <ShaderButtons
                                            variant="induction-button"
                                            mode="dark"
                                            hue={0}
                                            saturation={1.00}
                                            brightness={1.00}
                                        />
                                    </Suspense>
                                    <span className="absolute inset-0 z-20" aria-label={t(translations.home.visitLiveSite, lang)} />
                                </a>
                            )}

                            <Link
                                href="/projects"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition-all hover:-translate-y-0.5"
                            >
                                <span>{t(translations.home.viewAllProjects, lang)}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE: PROJECT IMAGE FRAME */}
                    <div ref={imageFrameRef} className="lg:col-span-6 relative group">
                        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#5470eb]/30 to-indigo-400/20 blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />

                        <div className="relative rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xl bg-white p-2">
                            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100">
                                <Image
                                    src={yogaProject.image}
                                    alt={yogaProject.title}
                                    fill
                                    priority
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
