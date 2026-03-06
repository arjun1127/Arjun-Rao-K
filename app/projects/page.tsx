"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ProjectsHero from "../components/projects/ProjectsHero";
import SkillSystem from "../components/projects/SkillSystem";
import ProjectsExplorer from "../components/projects/ProjectsExplorer";
import SiteNav from "../components/shared/SiteNav";

export default function Projects() {
    const pageRef = useRef<HTMLElement>(null);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    const handleSelectSkill = useCallback((skillId: string | null) => {
        setSelectedSkill(skillId);
        if (!skillId) setHoveredSkill(null);
    }, []);

    const handleHoverSkill = useCallback((skillId: string | null) => {
        setHoveredSkill(skillId);
    }, []);

    useEffect(() => {
        const page = pageRef.current;
        if (!page) return;

        const transition = gsap.fromTo(
            page,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power2.out" }
        );

        return () => {
            transition.kill();
        };
    }, []);

    return (
        <main ref={pageRef} className="projects-page-root" data-page="projects">
            <SiteNav />
            <ProjectsHero />
            <SkillSystem
                selectedSkill={selectedSkill}
                onSelectSkill={handleSelectSkill}
                onHoverSkill={handleHoverSkill}
            />
            <ProjectsExplorer selectedSkill={selectedSkill} hoveredSkill={hoveredSkill} />
        </main>
    );
}
