"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { ArrowRight } from "lucide-react";
import useIsMobile from "../../hooks/useIsMobile";
import type { PortalInfo, PortalShape } from "./homeData";

interface PortalCardProps {
    portal: PortalInfo;
    index: number;
    onNavigate: (href: string, cardEl: HTMLElement) => void;
}

/* ── Geometry factory ── */
function createPortalGeometry(shape: PortalShape): THREE.BufferGeometry {
    switch (shape) {
        case "icosahedron":
            return new THREE.IcosahedronGeometry(1.1, 1);
        case "octahedron":
            return new THREE.OctahedronGeometry(1.2, 0);
        case "dodecahedron":
            return new THREE.DodecahedronGeometry(1.1, 0);
        case "torus":
            return new THREE.TorusGeometry(0.9, 0.35, 12, 24);
    }
}

/**
 * PortalCard — A single navigation portal rendered as a floating
 * card with an embedded Three.js wireframe preview, a magnetic
 * tilt hover effect, and a warp-out click transition.
 */
export default function PortalCard({ portal, index, onNavigate }: PortalCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    /* ── Embedded wireframe scene ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            45,
            canvas.clientWidth / Math.max(canvas.clientHeight, 1),
            0.1,
            50
        );
        camera.position.z = 3.5;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const geo = createPortalGeometry(portal.shape);
        const mat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
        });
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);

        /* Orbiting dots */
        const dotCount = 30;
        const dotPositions = new Float32Array(dotCount * 3);
        for (let i = 0; i < dotCount; i++) {
            const r = 1.3 + Math.random() * 0.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            dotPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            dotPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            dotPositions[i * 3 + 2] = r * Math.cos(phi);
        }
        const dotGeo = new THREE.BufferGeometry();
        dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
        const dotMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.04,
            transparent: true,
            opacity: 0.45,
        });
        const dots = new THREE.Points(dotGeo, dotMat);
        scene.add(dots);

        let rafId = 0;
        const animate = () => {
            rafId = requestAnimationFrame(animate);
            mesh.rotation.y += 0.004;
            mesh.rotation.x += 0.002;
            dots.rotation.y -= 0.003;
            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            const w = canvas.clientWidth;
            const h = Math.max(canvas.clientHeight, 1);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
            geo.dispose();
            mat.dispose();
            dotGeo.dispose();
            dotMat.dispose();
            renderer.dispose();
        };
    }, [portal.shape]);

    /* ── Magnetic tilt hover ── */
    useEffect(() => {
        if (isMobile) return;
        const card = cardRef.current;
        const inner = innerRef.current;
        if (!card || !inner) return;

        const rotateX = gsap.quickTo(inner, "rotateX", { duration: 0.5, ease: "power3.out" });
        const rotateY = gsap.quickTo(inner, "rotateY", { duration: 0.5, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
            const rect = card.getBoundingClientRect();
            const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            rotateY(nx * 12);
            rotateX(-ny * 10);
        };

        const onLeave = () => {
            rotateX(0);
            rotateY(0);
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);

        return () => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
        };
    }, [isMobile]);

    /* ── Click warp transition ── */
    const handleClick = useCallback(() => {
        const card = cardRef.current;
        if (!card) return;
        onNavigate(portal.href, card);
    }, [portal.href, onNavigate]);

    return (
        <div
            ref={cardRef}
            className="portal-card"
            style={{ perspective: "800px" }}
            onClick={handleClick}
            role="link"
            tabIndex={0}
            aria-label={`Navigate to ${portal.title}`}
            onKeyDown={(e) => { if (e.key === "Enter") handleClick(); }}
        >
            <div ref={innerRef} className="portal-card-inner" style={{ transformStyle: "preserve-3d" }}>
                {/* Three.js preview */}
                <div className="portal-canvas-wrap">
                    <canvas ref={canvasRef} className="portal-canvas" />
                </div>

                {/* Label */}
                <div className="portal-label-row">
                    <span className="portal-index">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="portal-title">{portal.title}</h3>
                </div>

                <p className="portal-tagline">{portal.tagline}</p>

                {/* Arrow */}
                <div className="portal-arrow">
                    <ArrowRight size={18} strokeWidth={2} />
                </div>
            </div>
        </div>
    );
}
