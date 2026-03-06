"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import useIsMobile from "../../hooks/useIsMobile";

interface SkillNode {
    name: string;
    category: string;
    position: [number, number, number];
}

const skills: SkillNode[] = [
    // Languages cluster (red-ish)
    { name: "TypeScript", category: "Languages", position: [-2.5, 1.5, 0] },
    { name: "Python", category: "Languages", position: [-3, 0.5, 0.5] },
    { name: "JavaScript", category: "Languages", position: [-2, 2.2, -0.5] },
    { name: "SQL", category: "Languages", position: [-3.2, 1, -0.8] },
    // Frameworks cluster (blue)
    { name: "React", category: "Frameworks", position: [0, 2, 0.5] },
    { name: "Next.js", category: "Frameworks", position: [0.8, 1.3, -0.3] },
    { name: "Node.js", category: "Frameworks", position: [-0.5, 1.2, 0.8] },
    { name: "Express", category: "Frameworks", position: [0.3, 2.5, -0.2] },
    // Infrastructure cluster (green)
    { name: "Docker", category: "Infrastructure", position: [2.5, 0.5, 0.3] },
    { name: "AWS", category: "Infrastructure", position: [3, 1.5, -0.5] },
    { name: "MongoDB", category: "Infrastructure", position: [2.8, -0.2, 0.5] },
    { name: "PostgreSQL", category: "Infrastructure", position: [2, 0, -0.3] },
    // Graphics cluster (purple)
    { name: "Three.js", category: "Graphics", position: [-1, -1.5, 0.5] },
    { name: "GSAP", category: "Graphics", position: [-0.3, -2.2, -0.3] },
    { name: "Framer", category: "Graphics", position: [-1.5, -2, 0] },
    { name: "Anime.js", category: "Graphics", position: [0.5, -1.8, 0.5] },
    // AI cluster (cyan)
    { name: "TensorFlow", category: "AI", position: [1.5, -1, -0.5] },
    { name: "PyTorch", category: "AI", position: [2, -1.8, 0.3] },
    { name: "OpenAI", category: "AI", position: [1, -2.5, -0.2] },
    { name: "Gemini", category: "AI", position: [2.5, -1.5, 0] },
];

const categoryColors: Record<string, number> = {
    Languages: 0xff6b6b,
    Frameworks: 0x5470eb,
    Infrastructure: 0x51cf66,
    Graphics: 0xcc5de8,
    AI: 0x22b8cf,
};

const categoryColorCSS: Record<string, string> = {
    Languages: "#ff6b6b",
    Frameworks: "#5470eb",
    Infrastructure: "#51cf66",
    Graphics: "#cc5de8",
    AI: "#22b8cf",
};

// Connections between related skills
const connections: [number, number][] = [
    [0, 2], [1, 3], [0, 1], // Languages internals
    [4, 5], [6, 7], [4, 6], // Frameworks internals
    [8, 9], [10, 11], [8, 10], // Infrastructure internals
    [12, 13], [14, 15], [12, 14], // Graphics internals
    [16, 17], [18, 19], [16, 18], // AI internals
    [2, 4], [6, 11], [12, 4], [15, 13], [17, 10], // Cross-cluster
];

/* ── Static mobile fallback ── */
function MobileSkillGrid() {
    const grouped = skills.reduce<Record<string, SkillNode[]>>((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    return (
        <div className="mobile-skill-grid">
            {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mobile-skill-cluster">
                    <h3
                        className="mobile-skill-category"
                        style={{ color: categoryColorCSS[category] }}
                    >
                        {category}
                    </h3>
                    <div className="mobile-skill-chips">
                        {items.map((skill) => (
                            <span
                                key={skill.name}
                                className="mobile-skill-chip"
                                style={{
                                    borderColor: categoryColorCSS[skill.category],
                                    color: categoryColorCSS[skill.category],
                                }}
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Desktop Three.js view ── */
export default function TechnicalDNA() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const animationIdRef = useRef<number>(0);
    const isMobile = useIsMobile();

    const handleMouseMove = useCallback((e: MouseEvent, canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera, nodeGroup: THREE.Group) => {
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.params.Points = { threshold: 0.3 };
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(nodeGroup.children, false);
        const tooltip = tooltipRef.current;
        if (!tooltip) return;

        if (intersects.length > 0) {
            const idx = nodeGroup.children.indexOf(intersects[0].object);
            if (idx >= 0 && idx < skills.length) {
                tooltip.textContent = skills[idx].name;
                tooltip.style.opacity = "1";
                tooltip.style.left = `${e.clientX - rect.left + 12}px`;
                tooltip.style.top = `${e.clientY - rect.top - 10}px`;
            }
        } else {
            tooltip.style.opacity = "0";
        }
    }, []);

    useEffect(() => {
        if (isMobile) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const nodeGroup = new THREE.Group();
        scene.add(nodeGroup);

        // Create skill nodes as small spheres
        skills.forEach((skill) => {
            const geo = new THREE.SphereGeometry(0.12, 16, 16);
            const mat = new THREE.MeshBasicMaterial({
                color: categoryColors[skill.category],
                transparent: true,
                opacity: 0.85,
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(...skill.position);
            nodeGroup.add(mesh);
        });

        // Create connection lines
        const lineGroup = new THREE.Group();
        scene.add(lineGroup);

        connections.forEach(([a, b]) => {
            const points = [
                new THREE.Vector3(...skills[a].position),
                new THREE.Vector3(...skills[b].position),
            ];
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            const mat = new THREE.LineBasicMaterial({
                color: 0x5470eb,
                transparent: true,
                opacity: 0.15,
            });
            const line = new THREE.Line(geo, mat);
            lineGroup.add(line);
        });

        const onMouseMove = (e: MouseEvent) => handleMouseMove(e, canvas, camera, nodeGroup);
        canvas.addEventListener("mousemove", onMouseMove);

        const animateScene = () => {
            animationIdRef.current = requestAnimationFrame(animateScene);
            nodeGroup.rotation.y += 0.002;
            lineGroup.rotation.y += 0.002;
            renderer.render(scene, camera);
        };
        animateScene();

        const handleResize = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationIdRef.current);
            canvas.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
        };
    }, [handleMouseMove, isMobile]);

    return (
        <section className="about-dark-section tech-section">
            <h2>Things I have worked On</h2>
            {isMobile ? (
                <MobileSkillGrid />
            ) : (
                <div className="tech-canvas-wrapper">
                    <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
                    <div ref={tooltipRef} className="skill-tooltip" />
                </div>
            )}
        </section>
    );
}
