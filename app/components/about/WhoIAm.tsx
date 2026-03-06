"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { Link } from "lucide-react";
import useIsMobile from "../../hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

export default function WhoIAm() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isMobile = useIsMobile();

    // Three.js wireframe sphere
    useEffect(() => {
        if (isMobile) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.z = 4;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Wireframe icosahedron
        const geo = new THREE.IcosahedronGeometry(1.5, 2);
        const mat = new THREE.MeshBasicMaterial({
            color: 0x5470eb,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
        });
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);

        // Orbiting particles
        const particleCount = 80;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            const r = 1.8 + Math.random() * 0.8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            pPos[i] = r * Math.sin(phi) * Math.cos(theta);
            pPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
            pPos[i + 2] = r * Math.cos(phi);
        }
        pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({
            color: 0x5470eb,
            size: 0.04,
            transparent: true,
            opacity: 0.5,
        });
        const particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            mesh.rotation.y += 0.003;
            mesh.rotation.x += 0.001;
            particles.rotation.y -= 0.002;
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
            geo.dispose();
            mat.dispose();
            pGeo.dispose();
            pMat.dispose();
        };
    }, [isMobile]);

    // GSAP scroll-triggered fade-in
    useEffect(() => {
        if (!sectionRef.current || !textRef.current || !canvasRef.current) return;

        gsap.fromTo(
            textRef.current,
            { opacity: 0, x: -60 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        gsap.fromTo(
            canvasRef.current,
            { opacity: 0, x: 60 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <div ref={sectionRef} className="who-section">
            <div ref={textRef} className="who-text">
                <h2 className="text-3xl font-semibold text-black">
                    Hi, I&apos;m Arjun Rao.
                </h2>

                <p className="mt-4 text-gray-700">
                    Currently balancing between learning Japanese and building software systems.
                </p>

                <p className="mt-4 text-gray-700">
                    I plan to offer services in software development, focusing on advanced 3D
                    websites, portfolio experiences, end-to-end web development, and AI
                    integrations.
                </p>

                <p className="mt-4 text-gray-700">
                    For now, explore some of my landing page code snippets.
                </p>

                <a
                    href="https://code-store-1.onrender.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                >
                    View Code Snippets
                </a>
            </div>

            <div className="who-visual">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
        </div>
    );
}
