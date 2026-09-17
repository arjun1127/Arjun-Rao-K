"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ProjectsHero from "../components/projects/ProjectsHero";
import SiteNav from "../components/shared/SiteNav";
import * as THREE from "three";
import useIsMobile from "../hooks/useIsMobile";

export default function Projects() {
    const pageRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isMobile = useIsMobile();

    return (
        <>

            <main ref={pageRef} className="projects-page-root" data-page="projects">
                <canvas ref={canvasRef} className="projects-hero-canvas" />
                <SiteNav />
                <ProjectsHero />
            </main>
        </>
    );
}
