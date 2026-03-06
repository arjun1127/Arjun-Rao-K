"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import useIsMobile from "../../hooks/useIsMobile";

export default function ProjectsHero() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const isMobile = useIsMobile();

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

    useEffect(() => {
        if (isMobile) return;
        const canvas = canvasRef.current;
        const section = sectionRef.current;
        if (!canvas || !section) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            48,
            canvas.clientWidth / Math.max(canvas.clientHeight, 1),
            0.1,
            100
        );
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const particleCount = 180;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i += 1) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 8.6;
            positions[i3 + 1] = (Math.random() - 0.5) * 4.8;
            positions[i3 + 2] = (Math.random() - 0.5) * 2.8;
            velocities[i] = 0.0015 + Math.random() * 0.004;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x5470eb,
            size: 0.026,
            transparent: true,
            opacity: 0.2,
            sizeAttenuation: true,
        });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        const cubes = new THREE.Group();
        scene.add(cubes);
        for (let i = 0; i < 18; i += 1) {
            const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            const material = new THREE.MeshBasicMaterial({
                color: 0x5470eb,
                transparent: true,
                opacity: 0.15,
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                (Math.random() - 0.5) * 7.6,
                (Math.random() - 0.5) * 3.8,
                (Math.random() - 0.5) * 2.5
            );
            cubes.add(cube);
        }

        const positionAttr = particlesGeometry.getAttribute("position") as THREE.BufferAttribute;
        let rafId = 0;

        const render = () => {
            const t = performance.now() * 0.001;
            for (let i = 0; i < particleCount; i += 1) {
                const i3 = i * 3;
                positions[i3 + 1] += velocities[i];
                positions[i3] += Math.sin(t + i * 0.1) * 0.0005;
                if (positions[i3 + 1] > 2.8) positions[i3 + 1] = -2.8;
            }
            positionAttr.needsUpdate = true;

            cubes.children.forEach((cube, index) => {
                cube.rotation.x += 0.002 + index * 0.00004;
                cube.rotation.y += 0.0025 + index * 0.00003;
            });

            particles.rotation.z += 0.0004;
            renderer.render(scene, camera);
            rafId = requestAnimationFrame(render);
        };
        render();

        const handleResize = () => {
            const width = canvas.clientWidth;
            const height = Math.max(canvas.clientHeight, 1);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", handleResize);
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            cubes.children.forEach((cube) => {
                const mesh = cube as THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
                mesh.geometry.dispose();
                mesh.material.dispose();
            });
            renderer.dispose();
        };
    }, [isMobile]);

    return (
        <section ref={sectionRef} className="about-dark-section projects-hero">
            <canvas ref={canvasRef} className="projects-hero-canvas" />
            <div className="projects-hero-content">
                <h1 ref={titleRef} className="projects-title sekuya-regular">
                    PROJECT SYSTEMS
                </h1>
                <p ref={subtitleRef} className="projects-subtitle">
                    A collection of interactive engineering projects.
                </p>
            </div>
        </section>
    );
}
