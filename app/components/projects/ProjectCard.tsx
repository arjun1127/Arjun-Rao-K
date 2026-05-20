"use client";

import { useCallback, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import type { Project } from "./projectsData";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLSpanElement>(null);
    const [expanded, setExpanded] = useState(false);
    const architecture = project.architecture ?? [];

    const indexStr = String(index + 1).padStart(2, "0");

    const animateExpandedTech = () => {
        const details = detailsRef.current;
        if (!details) return;
        const techTags = details.querySelectorAll(".expanded-tech-tag");
        if (!techTags.length) return;

        animate(techTags, {
            scale: [0, 1],
            opacity: [0, 1],
            delay: stagger(80),
            duration: 380,
            ease: "outBack",
        });
    };

    const handleToggle = useCallback(() => {
        const card = cardRef.current;
        const details = detailsRef.current;
        if (!card || !details) return;

        if (!expanded) {
            setExpanded(true);

            details.style.maxHeight = "none";
            const fullHeight = details.scrollHeight;
            details.style.maxHeight = "0px";

            animate(card, {
                translateY: [-2, 0],
                duration: 420,
                ease: "outExpo",
            });

            animate(details, {
                maxHeight: ["0px", `${fullHeight}px`],
                opacity: [0, 1],
                translateY: [24, 0],
                duration: 600,
                ease: "inOutExpo",
            });

            if (arrowRef.current) {
                animate(arrowRef.current, {
                    rotate: 90,
                    duration: 360,
                    ease: "outExpo",
                });
            }

            requestAnimationFrame(animateExpandedTech);
            return;
        }

        animate(details, {
            maxHeight: [`${details.scrollHeight}px`, "0px"],
            opacity: [1, 0],
            translateY: [0, 20],
            duration: 460,
            ease: "inOutExpo",
            onComplete: () => setExpanded(false),
        });

        if (arrowRef.current) {
            animate(arrowRef.current, {
                rotate: 0,
                duration: 320,
                ease: "outExpo",
            });
        }
    }, [expanded]);

    const handleMouseEnter = useCallback(() => {
        if (!cardRef.current) return;
        animate(cardRef.current, {
            translateY: -8,
            boxShadow: "0 0 20px rgba(84,112,235,0.4)",
            duration: 200,
            ease: "outExpo",
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!cardRef.current) return;
        animate(cardRef.current, {
            translateY: 0,
            boxShadow: "0 0 0 rgba(84,112,235,0)",
            duration: 220,
            ease: "outExpo",
        });
    }, []);

    return (
        <article
            ref={cardRef}
            className="project-card"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <header className="project-card-header">
                <div className="project-top">
                    <span className="project-index">{indexStr}</span>
                    <h3 className="project-title">{project.title}</h3>
                    <div className="project-tech-inline">
                        {project.tech.map((tech) => (
                            <span key={tech} className="project-tech-inline-tag">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                <button type="button" className="inspect-btn" onClick={handleToggle}>
                    inspect
                    <span ref={arrowRef} className="inspect-arrow">

                    </span>
                </button>
            </header>

            <div ref={detailsRef} className="project-details">
                <p className="project-description">{project.description}</p>

                <div className="project-expanded-tech">
                    {project.tech.map((tech) => (
                        <span key={`expanded-${tech}`} className="expanded-tech-tag">
                            {tech}
                        </span>
                    ))}
                </div>

                {architecture.length > 0 && (
                    <div className="project-architecture">
                        {architecture.map((node, idx) => (
                            <span key={node}>
                                <span className="arch-node">{node}</span>
                                {idx < architecture.length - 1 && (
                                    <span className="arch-arrow"> → </span>
                                )}
                            </span>
                        ))}
                    </div>
                )}

                <div className="project-links">
                    {project.github && (
                        <a
                            href={project.github}
                            className="project-link github-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>
                    )}
                    {project.live && (
                        <a
                            href={project.live}
                            className="project-link live-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Live
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
