"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ProjectsHero from "../components/projects/ProjectsHero";
import SkillSystem from "../components/projects/SkillSystem";
import ProjectsExplorer from "../components/projects/ProjectsExplorer";
import SiteNav from "../components/shared/SiteNav";
import * as THREE from "three";
import useIsMobile from "../hooks/useIsMobile";

export default function Projects() {
    const pageRef = useRef<HTMLElement>(null);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isMobile = useIsMobile();

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
        const particleCount = 400;

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
            size: 0.06,
            transparent: true,
            opacity: 0.9,
        });

        const particles = new THREE.Points(geometry, material);

        scene.add(particles);

        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            particles.rotation.y += 0.00025;
            particles.rotation.x += 0.00008;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const width = canvas.clientWidth;
            const height = Math.max(canvas.clientHeight, 1);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
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


    return (
        <main ref={pageRef} className="projects-page-root" data-page="projects">
            <canvas ref={canvasRef} className="projects-hero-canvas" />
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
