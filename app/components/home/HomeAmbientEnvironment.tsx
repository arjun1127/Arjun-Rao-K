"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import useIsMobile from "../../hooks/useIsMobile";

export default function HomeAmbientEnvironment() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (isMobile) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const root = canvas.parentElement;
        if (!root) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            48,
            canvas.clientWidth / Math.max(canvas.clientHeight, 1),
            0.1,
            100
        );
        camera.position.set(0, 0.2, 10.6);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const ambientLight = new THREE.AmbientLight(0x5470eb, 0.34);
        const rimLight = new THREE.PointLight(0x5470eb, 0.62, 30);
        rimLight.position.set(2.5, 2.2, 6);
        scene.add(ambientLight, rimLight);

        const particleCount = 230;
        const particlePositions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i += 1) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * 20;
            particlePositions[i3 + 1] = (Math.random() - 0.5) * 12;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 10;
            velocities[i] = 0.001 + Math.random() * 0.0025;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x5470eb,
            size: 0.06,
            transparent: true,
            opacity: 0.13,
            sizeAttenuation: true,
        });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        const linePositions = new Float32Array(60 * 6);
        for (let i = 0; i < 60; i += 1) {
            const i6 = i * 6;
            linePositions[i6] = (Math.random() - 0.5) * 18;
            linePositions[i6 + 1] = (Math.random() - 0.5) * 10;
            linePositions[i6 + 2] = (Math.random() - 0.5) * 8;
            linePositions[i6 + 3] = linePositions[i6] + (Math.random() - 0.5) * 2.2;
            linePositions[i6 + 4] = linePositions[i6 + 1] + (Math.random() - 0.5) * 2.2;
            linePositions[i6 + 5] = linePositions[i6 + 2] + (Math.random() - 0.5) * 1.8;
        }

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x5470eb,
            transparent: true,
            opacity: 0.08,
        });
        const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lineSegments);

        const grid = new THREE.GridHelper(18, 24, 0x5470eb, 0x5470eb);
        grid.position.y = -3.4;
        grid.position.z = -5.4;
        grid.rotation.x = Math.PI / 2.9;
        const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
        gridMaterials.forEach((material) => {
            material.transparent = true;
            material.opacity = 0.06;
        });
        scene.add(grid);

        gsap.fromTo(
            camera.position,
            { z: 11.8 },
            { z: 9.3, duration: 2.2, ease: "power2.out" }
        );

        const pointerState = { x: 0, y: 0 };
        const handlePointerMove = (event: PointerEvent) => {
            const rect = root.getBoundingClientRect();
            const normX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            const normY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
            gsap.to(pointerState, {
                x: normX * 0.6,
                y: normY * 0.35,
                duration: 0.8,
                ease: "power3.out",
                overwrite: true,
            });
        };

        const handlePointerLeave = () => {
            gsap.to(pointerState, {
                x: 0,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                overwrite: true,
            });
        };

        const handleScroll = () => {
            const progress = Math.min(window.scrollY / 700, 1);
            gsap.to(camera.position, {
                z: 9.3 - progress * 0.8,
                duration: 0.55,
                ease: "power2.out",
                overwrite: true,
            });
        };

        const handleResize = () => {
            const width = canvas.clientWidth;
            const height = Math.max(canvas.clientHeight, 1);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        root.addEventListener("pointermove", handlePointerMove);
        root.addEventListener("pointerleave", handlePointerLeave);
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize);

        const particlesPositionAttr = particlesGeometry.getAttribute("position") as THREE.BufferAttribute;
        let rafId = 0;

        const render = () => {
            const t = performance.now() * 0.001;

            for (let i = 0; i < particleCount; i += 1) {
                const i3 = i * 3;
                particlePositions[i3 + 1] += velocities[i];
                particlePositions[i3] += Math.sin(t * 0.45 + i * 0.11) * 0.002;
                if (particlePositions[i3 + 1] > 6) particlePositions[i3 + 1] = -6;
            }
            particlesPositionAttr.needsUpdate = true;

            camera.position.x += (pointerState.x - camera.position.x) * 0.03;
            camera.position.y += (0.2 + pointerState.y - camera.position.y) * 0.03;
            camera.lookAt(0, 0, 0);

            particles.rotation.z += 0.00023;
            lineSegments.rotation.y += 0.0002;

            renderer.render(scene, camera);
            rafId = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(rafId);
            root.removeEventListener("pointermove", handlePointerMove);
            root.removeEventListener("pointerleave", handlePointerLeave);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);

            particlesGeometry.dispose();
            particlesMaterial.dispose();
            lineGeometry.dispose();
            lineMaterial.dispose();
            (grid.geometry as THREE.BufferGeometry).dispose();
            gridMaterials.forEach((material) => material.dispose());
            renderer.dispose();
        };
    }, [isMobile]);

    if (isMobile) return null;
    return <canvas ref={canvasRef} className="home-ambient-canvas" aria-hidden="true" />;
}
