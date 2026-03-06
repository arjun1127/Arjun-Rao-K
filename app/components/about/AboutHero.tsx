"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import useIsMobile from "../../hooks/useIsMobile";

export default function AboutHero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    // Three.js ambient particles
    useEffect(() => {
        if (isMobile) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 15;
            positions[i + 1] = (Math.random() - 0.5) * 15;
            positions[i + 2] = (Math.random() - 0.5) * 10;
        }
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x5470eb,
            size: 0.03,
            transparent: true,
            opacity: 0.6,
        });
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            points.rotation.y += 0.0003;
            points.rotation.x += 0.0001;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
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

    // GSAP entrance animations
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(
            titleRef.current,
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration: 1.2 }
        )
            .fromTo(
                subtitleRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1 },
                "-=0.6"
            )
            .fromTo(
                scrollRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.8 },
                "-=0.3"
            );
    }, []);

    return (
        <section className="about-dark-section about-hero">
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
            <div className="about-hero-content">
                <h1 ref={titleRef} className="sekuya-regular">Inside Developer’s Mind</h1>
                <p ref={subtitleRef} className="subtitle">
                    I work on Interactive Designs, Backend Systems and AI integration.
                </p>
                <div ref={scrollRef} className="scroll-indicator">
                    Scroll to explore
                </div>
            </div>
        </section>
    );
}
