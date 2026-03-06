"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import type { Project } from "./projectsData";

gsap.registerPlugin(ScrollTrigger);

interface CategorySectionProps {
    title: string;
    projects: Project[];
    variant: "dark" | "glossy";
}

export default function CategorySection({ title, projects, variant }: CategorySectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        // Section header animation
        if (titleRef.current) {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 80 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }

        // Underline draw animation
        if (lineRef.current) {
            gsap.to(lineRef.current, {
                width: "100%",
                duration: 1.4,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            });
        }

        // Cards stagger in
        if (gridRef.current) {
            const cards = gridRef.current.querySelectorAll(".project-card");
            gsap.fromTo(
                cards,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    const catClass = variant === "dark" ? "dark-cat" : "glossy-cat";

    return (
        <div ref={sectionRef} className={`category-section ${catClass}`}>
            <div className="category-header">
                <h2 ref={titleRef} className="category-title">
                    {title}
                </h2>
                <div ref={lineRef} className="category-line" />
            </div>
            <div ref={gridRef} className="projects-grid">
                {projects.map((project, i) => (
                    <ProjectCard key={project.title} project={project} index={i} />
                ))}
            </div>
        </div>
    );
}
