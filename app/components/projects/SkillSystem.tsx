"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate } from "animejs";
import gsap from "gsap";
import * as THREE from "three";
import {
    getSkillLabel,
    skillClusters,
    skillConnections,
    skillNodes,
    type SkillNode,
} from "./skillSystemData";
import useIsMobile from "../../hooks/useIsMobile";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";

interface SkillSystemProps {
    selectedSkill: string | null;
    onSelectSkill: (skillId: string | null) => void;
    onHoverSkill: (skillId: string | null) => void;
}

interface NodeInstance {
    node: SkillNode;
    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
    basePosition: THREE.Vector3;
}

interface LineInstance {
    sourceId: string;
    targetId: string;
    sourceMesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
    targetMesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
    material: THREE.LineBasicMaterial;
    geometry: THREE.BufferGeometry;
}

const clusterColorById = new Map(skillClusters.map((cluster) => [cluster.id, cluster.color]));
const nodeById = new Map(skillNodes.map((node) => [node.id, node]));

export default function SkillSystem({
    selectedSkill,
    onSelectSkill,
    onHoverSkill,
}: SkillSystemProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const labelRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
    const selectionRef = useRef<string | null>(selectedSkill);
    const hoveredSkillRef = useRef<string | null>(null);
    const rafIdRef = useRef(0);
    const isMobile = useIsMobile();
    const { lang } = useLang();

    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    const nodeInstancesRef = useRef<NodeInstance[]>([]);
    const lineInstancesRef = useRef<LineInstance[]>([]);

    const connectedMap = useMemo(() => {
        const map = new Map<string, Set<string>>();
        skillNodes.forEach((node) => map.set(node.id, new Set()));
        skillConnections.forEach(([sourceId, targetId]) => {
            map.get(sourceId)?.add(targetId);
            map.get(targetId)?.add(sourceId);
        });
        return map;
    }, []);

    useEffect(() => {
        selectionRef.current = selectedSkill;
    }, [selectedSkill]);

    const animateVisualState = useCallback(() => {
        const nodes = nodeInstancesRef.current;
        const lines = lineInstancesRef.current;

        nodes.forEach(({ node, mesh }) => {
            const baseColor = clusterColorById.get(node.clusterId) ?? 0x5470eb;
            const isSelected = selectedSkill === node.id;
            const isHovered = hoveredSkill === node.id;
            const connectedToSelected = selectedSkill
                ? connectedMap.get(selectedSkill)?.has(node.id) ?? false
                : false;
            const connectedToHovered = hoveredSkill
                ? connectedMap.get(hoveredSkill)?.has(node.id) ?? false
                : false;

            let opacity = 0.78;
            let scale = 1;
            let emissiveIntensity = 0.3;

            if (selectedSkill && !isSelected && !connectedToSelected) {
                opacity = 0.3;
                scale = 0.9;
                emissiveIntensity = 0.08;
            }

            if (connectedToHovered || connectedToSelected) {
                opacity = Math.max(opacity, 0.95);
                scale = Math.max(scale, 1.08);
                emissiveIntensity = Math.max(emissiveIntensity, 0.5);
            }

            if (isHovered) {
                opacity = 1;
                scale = 1.25;
                emissiveIntensity = 0.82;
            }

            if (isSelected) {
                opacity = 1;
                scale = 1.28;
                emissiveIntensity = 0.9;
            }

            mesh.material.color.setHex(isSelected || isHovered ? 0x9cb7ff : baseColor);

            animate(mesh.scale, {
                x: scale,
                y: scale,
                z: scale,
                duration: 300,
                ease: "outBack",
            });

            animate(mesh.material, {
                opacity,
                emissiveIntensity,
                duration: 300,
                ease: "outExpo",
            });

            const label = labelRefs.current.get(node.id);
            if (label) {
                let labelOpacity = 0.76;

                if (selectedSkill && !isSelected && !connectedToSelected) {
                    labelOpacity = 0.26;
                }

                if (connectedToHovered || connectedToSelected) {
                    labelOpacity = Math.max(labelOpacity, 0.9);
                }

                if (isHovered || isSelected) {
                    labelOpacity = 1;
                }

                animate(label, {
                    opacity: labelOpacity,
                    duration: 280,
                    ease: "outExpo",
                });
            }
        });

        lines.forEach(({ sourceId, targetId, material }) => {
            const active =
                hoveredSkill === sourceId ||
                hoveredSkill === targetId ||
                selectedSkill === sourceId ||
                selectedSkill === targetId;
            const dimmed =
                Boolean(selectedSkill) &&
                selectedSkill !== sourceId &&
                selectedSkill !== targetId;

            const targetOpacity = active ? 0.72 : dimmed ? 0.06 : 0.18;
            material.color.setHex(active ? 0x9cb7ff : 0x5470eb);
            animate(material, {
                opacity: targetOpacity,
                duration: 300,
                ease: "outQuad",
            });
        });
    }, [connectedMap, hoveredSkill, selectedSkill]);

    useEffect(() => {
        if (isMobile) return;
        const canvas = canvasRef.current;
        const section = sectionRef.current;
        if (!canvas || !section) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            50,
            canvas.clientWidth / Math.max(canvas.clientHeight, 1),
            0.1,
            100
        );
        camera.position.set(0, 0.1, 7);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const ambient = new THREE.AmbientLight(0xffffff, 0.68);
        const keyLight = new THREE.PointLight(0x5470eb, 1.2, 25);
        keyLight.position.set(2.6, 3, 7);
        scene.add(ambient, keyLight);

        const particleCount = 180;
        const particlePositions = new Float32Array(particleCount * 3);
        const particleVelocity = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i += 1) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * 9;
            particlePositions[i3 + 1] = (Math.random() - 0.5) * 4.8;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 2.8;
            particleVelocity[i] = 0.0015 + Math.random() * 0.003;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x5470eb,
            transparent: true,
            opacity: 0.2,
            size: 0.024,
            sizeAttenuation: true,
        });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        const graphGroup = new THREE.Group();
        scene.add(graphGroup);

        const nodeInstances: NodeInstance[] = [];
        skillNodes.forEach((node) => {
            const color = clusterColorById.get(node.clusterId) ?? 0x5470eb;
            const geometry = new THREE.SphereGeometry(0.12, 18, 18);
            const material = new THREE.MeshStandardMaterial({
                color,
                emissive: color,
                emissiveIntensity: 0.3,
                roughness: 0.35,
                metalness: 0.12,
                transparent: true,
                opacity: 0.78,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...node.position);
            mesh.userData.skillId = node.id;
            graphGroup.add(mesh);
            nodeInstances.push({
                node,
                mesh,
                basePosition: new THREE.Vector3(...node.position),
            });
        });
        nodeInstancesRef.current = nodeInstances;
        const nodeMeshById = new Map(
            nodeInstances.map((instance) => [instance.node.id, instance.mesh])
        );

        const lineInstances: LineInstance[] = [];
        skillConnections.forEach(([sourceId, targetId]) => {
            const source = nodeById.get(sourceId);
            const target = nodeById.get(targetId);
            const sourceMesh = nodeMeshById.get(sourceId);
            const targetMesh = nodeMeshById.get(targetId);
            if (!source || !target) return;
            if (!sourceMesh || !targetMesh) return;

            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(...source.position),
                new THREE.Vector3(...target.position),
            ]);
            const material = new THREE.LineBasicMaterial({
                color: 0x5470eb,
                transparent: true,
                opacity: 0.18,
            });
            const line = new THREE.Line(geometry, material);
            graphGroup.add(line);

            lineInstances.push({
                sourceId,
                targetId,
                sourceMesh,
                targetMesh,
                material,
                geometry,
            });
        });
        lineInstancesRef.current = lineInstances;

        nodeInstances.forEach((instance, index) => {
            instance.mesh.scale.set(0.001, 0.001, 0.001);
            instance.mesh.material.opacity = 0;

            animate(instance.mesh.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 560,
                delay: 80 + index * 85,
                ease: "outBack",
            });

            animate(instance.mesh.material, {
                opacity: 0.78,
                duration: 440,
                delay: 80 + index * 85,
                ease: "outExpo",
            });
        });

        gsap.fromTo(
            camera.position,
            { z: 8.2 },
            {
                z: 6.4,
                duration: 1.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                },
            }
        );

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2(9999, 9999);
        const nodeMeshes = nodeInstances.map((instance) => instance.mesh);

        const setHover = (nextSkillId: string | null) => {
            if (hoveredSkillRef.current === nextSkillId) return;
            hoveredSkillRef.current = nextSkillId;
            setHoveredSkill(nextSkillId);
            onHoverSkill(nextSkillId);
        };

        const handlePointerMove = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObjects(nodeMeshes, false)[0];
            if (!hit) {
                setHover(null);
                return;
            }

            const nextSkillId = (hit.object.userData.skillId as string | undefined) ?? null;
            setHover(nextSkillId);
        };

        const handlePointerLeave = () => {
            setHover(null);
        };

        const handleClick = () => {
            const skillId = hoveredSkillRef.current;
            if (!skillId) return;
            const next = selectionRef.current === skillId ? null : skillId;
            onSelectSkill(next);
        };

        const handleResize = () => {
            const width = canvas.clientWidth;
            const height = Math.max(canvas.clientHeight, 1);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.addEventListener("pointerleave", handlePointerLeave);
        canvas.addEventListener("click", handleClick);
        window.addEventListener("resize", handleResize);

        const particlesPositionAttr = particlesGeometry.getAttribute(
            "position"
        ) as THREE.BufferAttribute;
        const worldPosition = new THREE.Vector3();
        const projectedPosition = new THREE.Vector3();

        const updateLabels = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            nodeInstancesRef.current.forEach((instance) => {
                const label = labelRefs.current.get(instance.node.id);
                if (!label) return;

                instance.mesh.getWorldPosition(worldPosition);
                projectedPosition.copy(worldPosition).project(camera);

                const x = (projectedPosition.x * 0.5 + 0.5) * width;
                const y = (-projectedPosition.y * 0.5 + 0.5) * height;
                const visible = projectedPosition.z > -1 && projectedPosition.z < 1;

                label.style.left = `${x}px`;
                label.style.top = `${y}px`;
                label.style.visibility = visible ? "visible" : "hidden";
            });
        };

        const render = () => {
            const t = performance.now() * 0.001;

            nodeInstancesRef.current.forEach((instance, index) => {
                instance.mesh.position.x =
                    instance.basePosition.x + Math.sin(t * 0.55 + index * 0.4) * 0.045;
                instance.mesh.position.y =
                    instance.basePosition.y + Math.cos(t * 0.7 + index * 0.5) * 0.055;
                instance.mesh.position.z =
                    instance.basePosition.z + Math.sin(t * 0.6 + index * 0.3) * 0.035;
            });

            lineInstancesRef.current.forEach((line) => {
                const positionAttr = line.geometry.getAttribute("position") as THREE.BufferAttribute;
                positionAttr.setXYZ(
                    0,
                    line.sourceMesh.position.x,
                    line.sourceMesh.position.y,
                    line.sourceMesh.position.z
                );
                positionAttr.setXYZ(
                    1,
                    line.targetMesh.position.x,
                    line.targetMesh.position.y,
                    line.targetMesh.position.z
                );
                positionAttr.needsUpdate = true;
            });

            for (let i = 0; i < particleCount; i += 1) {
                const i3 = i * 3;
                particlePositions[i3 + 1] += particleVelocity[i];
                if (particlePositions[i3 + 1] > 2.7) particlePositions[i3 + 1] = -2.7;
            }
            particlesPositionAttr.needsUpdate = true;

            graphGroup.rotation.y += 0.0007;
            particles.rotation.z += 0.00025;
            updateLabels();

            renderer.render(scene, camera);
            rafIdRef.current = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(rafIdRef.current);
            canvas.removeEventListener("pointermove", handlePointerMove);
            canvas.removeEventListener("pointerleave", handlePointerLeave);
            canvas.removeEventListener("click", handleClick);
            window.removeEventListener("resize", handleResize);
            onHoverSkill(null);

            nodeInstances.forEach((instance) => {
                instance.mesh.geometry.dispose();
                instance.mesh.material.dispose();
            });
            lineInstances.forEach((line) => {
                line.geometry.dispose();
                line.material.dispose();
            });

            particlesGeometry.dispose();
            particlesMaterial.dispose();
            renderer.dispose();
        };
    }, [onHoverSkill, onSelectSkill, isMobile]);

    useEffect(() => {
        animateVisualState();
    }, [animateVisualState]);

    /* ── Mobile chip-based fallback ── */
    if (isMobile) {
        const clusterColorCSS: Record<string, string> = {};
        skillClusters.forEach((c) => {
            clusterColorCSS[c.id] = `#${c.color.toString(16).padStart(6, "0")}`;
        });

        const grouped = skillClusters.map((cluster) => ({
            ...cluster,
            nodes: skillNodes.filter((n) => n.clusterId === cluster.id),
        }));

        return (
            <section ref={sectionRef} className="about-dark-section skill-system-section">
                <div className="skill-system-shell">
                    <div className="skill-system-header">
                        <h2>{t(translations.projects.skillSystem, lang)}</h2>
                        <p>{t(translations.projects.skillSystemDescMobile, lang)}</p>
                    </div>

                    <div className="mobile-skill-system">
                        {grouped.map((cluster) => (
                            <div key={cluster.id} className="mobile-skill-cluster">
                                <h3
                                    className="mobile-skill-category"
                                    style={{ color: clusterColorCSS[cluster.id] }}
                                >
                                    {cluster.label}
                                </h3>
                                <div className="mobile-skill-chips">
                                    {cluster.nodes.map((node) => {
                                        const isActive = selectedSkill === node.id;
                                        return (
                                            <button
                                                key={node.id}
                                                type="button"
                                                className={`mobile-skill-chip${isActive ? " is-active" : ""}`}
                                                style={{
                                                    borderColor: clusterColorCSS[cluster.id],
                                                    color: isActive ? "#ffffff" : clusterColorCSS[cluster.id],
                                                    background: isActive
                                                        ? clusterColorCSS[cluster.id]
                                                        : "transparent",
                                                }}
                                                onClick={() =>
                                                    onSelectSkill(isActive ? null : node.id)
                                                }
                                            >
                                                {node.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="skill-system-footer">
                        <div className="skill-selection-state">
                            <span>{t(translations.projects.selectedSkill, lang)}</span>
                            <strong>
                                {selectedSkill ? getSkillLabel(selectedSkill) : t(translations.projects.allSkills, lang)}
                            </strong>
                            {selectedSkill && (
                                <button
                                    type="button"
                                    className="skill-clear-btn"
                                    onClick={() => onSelectSkill(null)}
                                >
                                    {t(translations.projects.clear, lang)}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    /* ── Desktop Three.js view ── */
    return (
        <section ref={sectionRef} className="about-dark-section skill-system-section">
            <div className="skill-system-shell">
                <div className="skill-system-header">
                    <h2>{t(translations.projects.skillSystem, lang)}</h2>
                    <p>{t(translations.projects.skillSystemDesc, lang)}</p>
                </div>

                <div className="skill-system-canvas-wrap">
                    <canvas ref={canvasRef} className="skill-system-canvas" />
                    <div className="skill-system-label-layer" aria-hidden="true">
                        {skillNodes.map((node) => (
                            <span
                                key={node.id}
                                ref={(element) => {
                                    if (element) {
                                        labelRefs.current.set(node.id, element);
                                        return;
                                    }
                                    labelRefs.current.delete(node.id);
                                }}
                                className={`skill-node-label${selectedSkill === node.id ? " is-selected" : ""
                                    }${hoveredSkill === node.id ? " is-hovered" : ""}`}
                            >
                                {node.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="skill-system-footer">
                    <div className="skill-cluster-list">
                        {skillClusters.map((cluster) => (
                            <span key={cluster.id} className="skill-cluster-pill">
                                {cluster.label}
                            </span>
                        ))}
                    </div>

                    <div className="skill-selection-state">
                        <span>{t(translations.projects.selectedSkill, lang)}</span>
                        <strong>{selectedSkill ? getSkillLabel(selectedSkill) : t(translations.projects.allSkills, lang)}</strong>
                        {selectedSkill && (
                            <button
                                type="button"
                                className="skill-clear-btn"
                                onClick={() => onSelectSkill(null)}
                            >
                                {t(translations.projects.clear, lang)}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
