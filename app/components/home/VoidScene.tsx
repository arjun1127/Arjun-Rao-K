"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import useIsMobile from "../../hooks/useIsMobile";

/**
 * VoidScene — Full-viewport Three.js background for the landing page.
 *
 * Renders:
 *  • A monochrome particle field (white on black, ~320 particles)
 *  • Faint connection lines between nearby particles
 *  • A perspective grid floor receding into darkness
 *  • Mouse-reactive camera parallax (GSAP quickTo)
 */
export default function VoidScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const root = canvas.parentElement;
        if (!root) return;

        /* ── Renderer + Scene + Camera ── */
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            50,
            canvas.clientWidth / Math.max(canvas.clientHeight, 1),
            0.1,
            120
        );
        camera.position.set(0, 0.3, isMobile ? 12 : 10);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        /* ── Particle field ── */
        const particleCount = isMobile ? 120 : 320;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 24;
            positions[i3 + 1] = (Math.random() - 0.5) * 14;
            positions[i3 + 2] = (Math.random() - 0.5) * 12;
            velocities[i] = 0.001 + Math.random() * 0.003;
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const particleMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: isMobile ? 0.06 : 0.045,
            transparent: true,
            opacity: 0.35,
            sizeAttenuation: true,
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        /* ── Connection lines ── */
        const lineCount = isMobile ? 20 : 50;
        const linePositions = new Float32Array(lineCount * 6);
        for (let i = 0; i < lineCount; i++) {
            const i6 = i * 6;
            linePositions[i6] = (Math.random() - 0.5) * 22;
            linePositions[i6 + 1] = (Math.random() - 0.5) * 12;
            linePositions[i6 + 2] = (Math.random() - 0.5) * 10;
            linePositions[i6 + 3] = linePositions[i6] + (Math.random() - 0.5) * 2.8;
            linePositions[i6 + 4] = linePositions[i6 + 1] + (Math.random() - 0.5) * 2.4;
            linePositions[i6 + 5] = linePositions[i6 + 2] + (Math.random() - 0.5) * 2;
        }

        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.06,
        });
        const lines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(lines);

        /* ── Grid floor ── */
        const grid = new THREE.GridHelper(30, 40, 0xffffff, 0xffffff);
        grid.position.y = -4.2;
        grid.position.z = -6;
        grid.rotation.x = Math.PI / 3.2;
        const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material];
        gridMats.forEach((m) => {
            m.transparent = true;
            m.opacity = 0.035;
        });
        scene.add(grid);

        /* ── Intro camera zoom (GSAP) ── */
        gsap.fromTo(
            camera.position,
            { z: isMobile ? 14 : 12.5 },
            { z: isMobile ? 12 : 9.8, duration: 2.6, ease: "power2.out" }
        );

        /* ── Mouse parallax (GSAP quickTo) ── */
        const pointer = { x: 0, y: 0 };

        const onPointerMove = (e: PointerEvent) => {
            if (isMobile) return;
            const rect = root.getBoundingClientRect();
            const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            gsap.to(pointer, {
                x: nx * 0.7,
                y: ny * 0.4,
                duration: 0.9,
                ease: "power3.out",
                overwrite: true,
            });
        };

        const onPointerLeave = () => {
            gsap.to(pointer, { x: 0, y: 0, duration: 1, ease: "power3.out", overwrite: true });
        };

        if (!isMobile) {
            root.addEventListener("pointermove", onPointerMove);
            root.addEventListener("pointerleave", onPointerLeave);
        }

        /* ── Resize handler ── */
        const onResize = () => {
            const w = canvas.clientWidth;
            const h = Math.max(canvas.clientHeight, 1);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        /* ── Render loop ── */
        const posAttr = particleGeo.getAttribute("position") as THREE.BufferAttribute;
        let rafId = 0;

        const render = () => {
            const t = performance.now() * 0.001;

            /* Particle drift */
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3 + 1] += velocities[i];
                positions[i3] += Math.sin(t * 0.35 + i * 0.13) * 0.0015;
                if (positions[i3 + 1] > 7) positions[i3 + 1] = -7;
            }
            posAttr.needsUpdate = true;

            /* Subtle orbit of particles & lines */
            particles.rotation.z += 0.00015;
            lines.rotation.y += 0.00012;

            /* Camera follows pointer */
            camera.position.x += (pointer.x - camera.position.x) * 0.025;
            camera.position.y += (0.3 + pointer.y - camera.position.y) * 0.025;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
            rafId = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(rafId);
            if (!isMobile) {
                root.removeEventListener("pointermove", onPointerMove);
                root.removeEventListener("pointerleave", onPointerLeave);
            }
            window.removeEventListener("resize", onResize);
            particleGeo.dispose();
            particleMat.dispose();
            lineGeo.dispose();
            lineMat.dispose();
            (grid.geometry as THREE.BufferGeometry).dispose();
            gridMats.forEach((m) => m.dispose());
            renderer.dispose();
        };
    }, [isMobile]);

    return <canvas ref={canvasRef} className="void-canvas" aria-hidden="true" />;
}
