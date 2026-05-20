"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
// import * as THREE from "three";
// import useIsMobile from "../../hooks/useIsMobile";

export default function ProjectsHero() {
    const sectionRef = useRef<HTMLElement>(null);
    //const canvasRef = useRef<HTMLCanvasElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    // const isMobile = useIsMobile();

    useEffect(() => {
        const title = titleRef.current;
        const subtitle = subtitleRef.current;

        if (title) {
            gsap.fromTo(
                title,
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
            );
        }

        if (subtitle) {
            gsap.fromTo(
                subtitle,
                { y: 32, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 }
            );
        }
    }, []);

    // useEffect(() => {
    //     if (isMobile) return;
    //     const canvas = canvasRef.current;
    //     const section = sectionRef.current;
    //     if (!canvas || !section) return;

    //     const scene = new THREE.Scene();

    //     const camera = new THREE.PerspectiveCamera(
    //         75,
    //         canvas.clientWidth / canvas.clientHeight,
    //         0.1,
    //         1000
    //     );

    //     camera.position.z = 5;

    //     const renderer = new THREE.WebGLRenderer({
    //         canvas,
    //         alpha: true,
    //         antialias: true,
    //     });

    //     renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //     // PARTICLES
    //     const particleCount = 240;

    //     const geometry = new THREE.BufferGeometry();

    //     const positions = new Float32Array(particleCount * 3);

    //     for (let i = 0; i < particleCount * 3; i += 3) {
    //         positions[i] = (Math.random() - 0.5) * 15;
    //         positions[i + 1] = (Math.random() - 0.5) * 12;
    //         positions[i + 2] = (Math.random() - 0.5) * 10;
    //     }

    //     geometry.setAttribute(
    //         "position",
    //         new THREE.BufferAttribute(positions, 3)
    //     );

    //     const material = new THREE.PointsMaterial({
    //         color: 0x5470eb,
    //         size: 0.03,
    //         transparent: true,
    //         opacity: 0.65,
    //     });

    //     const particles = new THREE.Points(geometry, material);

    //     scene.add(particles);

    //     let animationId: number;

    //     const animate = () => {
    //         animationId = requestAnimationFrame(animate);

    //         particles.rotation.y += 0.00025;
    //         particles.rotation.x += 0.00008;

    //         renderer.render(scene, camera);
    //     };

    //     animate();

    //     const handleResize = () => {
    //         const width = canvas.clientWidth;
    //         const height = Math.max(canvas.clientHeight, 1);
    //         camera.aspect = width / height;
    //         camera.updateProjectionMatrix();
    //         renderer.setSize(width, height);
    //     };
    //     window.addEventListener("resize", handleResize);

    //     return () => {
    //         cancelAnimationFrame(animationId);

    //         window.removeEventListener("resize", handleResize);

    //         renderer.dispose();
    //         geometry.dispose();
    //         material.dispose();
    //     };
    // }, [isMobile]);

    return (
        <section ref={sectionRef} className="projects-hero">
            {/* <canvas ref={canvasRef} className="projects-hero-canvas" /> */}
            <div className="projects-hero-content">
                <h1 ref={titleRef} className="project-hero">
                    Projects
                </h1>
                <p ref={subtitleRef} className="projects-subtitle">
                    Some of projects that I was involved in during my college
                </p>
            </div>
        </section>
    );
}
