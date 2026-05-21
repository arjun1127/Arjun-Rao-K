"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CategoryChips from "./CategoryChips";
import ProjectCard from "./ProjectCard";
import { categories, projects } from "./projectsData";
import { getSkillLabel, projectMatchesSkill } from "./skillSystemData";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

interface ProjectsExplorerProps {
    selectedSkill: string | null;
    hoveredSkill: string | null;
}

interface PendingLayoutTransition {
    previousRects: Map<number, DOMRect>;
    previousIds: number[];
    nextIds: number[];
    resolve: () => void;
}

const filterCategories = [{ id: "all", label: "All" }, ...categories];

function getFilteredIds(categoryId: string, selectedSkill: string | null): number[] {
    return projects
        .filter((project) => (categoryId === "all" ? true : project.category === categoryId))
        .filter((project) => projectMatchesSkill(project.tech, selectedSkill))
        .map((project) => project.id);
}

export default function ProjectsExplorer({ selectedSkill, hoveredSkill }: ProjectsExplorerProps) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [visibleIds, setVisibleIds] = useState<number[]>(() => getFilteredIds("all", selectedSkill));
    const { lang } = useLang();

    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const focusRef = useRef<HTMLParagraphElement>(null);
    const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const pendingLayoutRef = useRef<PendingLayoutTransition | null>(null);
    const isTransitioningRef = useRef(false);
    const queueRef = useRef<{ category: string; skill: string | null } | null>(null);
    const runFilterTransitionRef = useRef<(categoryId: string, skill: string | null) => void>(() => undefined);
    const activeCategoryRef = useRef("all");
    const selectedSkillRef = useRef<string | null>(selectedSkill);
    const visibleIdsRef = useRef<number[]>(getFilteredIds("all", selectedSkill));

    const filterCategoriesLocalized = useMemo(() => [
        { id: "all", label: lang === "ja" ? "すべて" : "All" },
        ...categories.map((c) => {
            const tr = translations.projects.categories[c.id];
            return { id: c.id, label: tr ? t(tr, lang) : c.label };
        }),
    ], [lang]);

    const visibleProjects = useMemo(() => {
        const visibleIdSet = new Set(visibleIds);
        return projects.filter((project) => visibleIdSet.has(project.id));
    }, [visibleIds]);

    const activeCategoryLabel = useMemo(() => {
        const active = filterCategoriesLocalized.find((category) => category.id === activeCategory);
        return active?.label ?? (lang === "ja" ? "すべて" : "All");
    }, [activeCategory, filterCategoriesLocalized, lang]);

    const focusLabel = useMemo(() => {
        if (selectedSkill) return `${lang === "ja" ? "スキルフォーカス" : "Skill Focus"}: ${getSkillLabel(selectedSkill)}`;
        if (activeCategory !== "all") return `${lang === "ja" ? "カテゴリフォーカス" : "Category Focus"}: ${activeCategoryLabel}`;
        return lang === "ja" ? "すべてのシステム" : "All Systems";
    }, [activeCategory, activeCategoryLabel, selectedSkill, lang]);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {
            all: projects.filter((project) => projectMatchesSkill(project.tech, selectedSkill)).length,
        };

        categories.forEach((category) => {
            counts[category.id] = projects
                .filter((project) => project.category === category.id)
                .filter((project) => projectMatchesSkill(project.tech, selectedSkill)).length;
        });

        return counts;
    }, [selectedSkill]);

    useEffect(() => {
        activeCategoryRef.current = activeCategory;
    }, [activeCategory]);




    useEffect(() => {
        visibleIdsRef.current = visibleIds;
    }, [visibleIds]);

    useEffect(() => {
        const section = sectionRef.current;
        const grid = gridRef.current;
        if (!section || !grid) return;

        const chips = section.querySelector(".chip-bar");
        if (chips) {
            gsap.from(chips, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 82%",
                },
            });
        }

        gsap.from(".project-module", {
            y: 60,
            opacity: 0,
            stagger: 0.18,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: grid,
                start: "top 80%",
            },
        });
    }, []);

    useEffect(() => {
        const focus = focusRef.current;
        if (!focus) return;

        animate(focus, {
            opacity: [0, 1],
            translateY: [14, 0],
            duration: 380,
            ease: "outExpo",
        });
    }, [focusLabel]);

    const runFilterTransition = useCallback(async (nextCategory: string, nextSkill: string | null) => {
        if (
            nextCategory === activeCategoryRef.current &&
            nextSkill === selectedSkillRef.current &&
            !isTransitioningRef.current
        ) {
            return;
        }

        if (isTransitioningRef.current) {
            queueRef.current = { category: nextCategory, skill: nextSkill };
            return;
        }

        isTransitioningRef.current = true;
        setActiveCategory(nextCategory);
        activeCategoryRef.current = nextCategory;
        selectedSkillRef.current = nextSkill;

        const currentVisibleIds = visibleIdsRef.current;
        const nextVisibleIds = getFilteredIds(nextCategory, nextSkill);
        const nextVisibleSet = new Set(nextVisibleIds);
        const leavingIds = currentVisibleIds.filter((id) => !nextVisibleSet.has(id));
        const stayingIds = currentVisibleIds.filter((id) => nextVisibleSet.has(id));

        const previousRects = new Map<number, DOMRect>();
        stayingIds.forEach((id) => {
            const card = itemRefs.current.get(id);
            if (card) previousRects.set(id, card.getBoundingClientRect());
        });

        const leavingCards = leavingIds
            .map((id) => itemRefs.current.get(id))
            .filter((card): card is HTMLDivElement => Boolean(card));

        if (leavingCards.length > 0) {
            await animate(leavingCards, {
                opacity: [1, 0],
                scale: [1, 0.9],
                translateY: [0, 22],
                duration: 400,
                delay: stagger(80),
                ease: "inExpo",
            });
        }

        await new Promise<void>((resolve) => {
            pendingLayoutRef.current = {
                previousRects,
                previousIds: currentVisibleIds,
                nextIds: nextVisibleIds,
                resolve,
            };
            setVisibleIds(nextVisibleIds);
        });

        isTransitioningRef.current = false;

        const queued = queueRef.current;
        if (
            queued &&
            (queued.category !== activeCategoryRef.current ||
                queued.skill !== selectedSkillRef.current)
        ) {
            queueRef.current = null;
            runFilterTransitionRef.current(queued.category, queued.skill);
            return;
        }

        queueRef.current = null;
    }, []);

    useEffect(() => {
        runFilterTransitionRef.current = (categoryId: string, skill: string | null) => {
            void runFilterTransition(categoryId, skill);
        };
    }, [runFilterTransition]);

    useEffect(() => {
        const nextCategory = selectedSkill ? "all" : activeCategoryRef.current;
        void runFilterTransition(nextCategory, selectedSkill);
    }, [runFilterTransition, selectedSkill]);

    useLayoutEffect(() => {
        const pending = pendingLayoutRef.current;
        if (!pending) return;

        const { previousRects, previousIds, nextIds, resolve } = pending;
        const previousSet = new Set(previousIds);
        const enteringIds = nextIds.filter((id) => !previousSet.has(id));
        const stayingIds = nextIds.filter((id) => previousSet.has(id));

        const movingCards: HTMLDivElement[] = [];
        const enteringCards: HTMLDivElement[] = [];

        stayingIds.forEach((id) => {
            const card = itemRefs.current.get(id);
            if (!card) return;

            const firstRect = previousRects.get(id);
            const lastRect = card.getBoundingClientRect();
            if (!firstRect) return;

            const deltaX = firstRect.left - lastRect.left;
            const deltaY = firstRect.top - lastRect.top;

            card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            card.style.willChange = "transform";
            movingCards.push(card);
        });

        enteringIds.forEach((id) => {
            const card = itemRefs.current.get(id);
            if (!card) return;
            card.style.opacity = "0";
            card.style.transform = "translateY(40px) scale(0.92)";
            card.style.willChange = "transform, opacity";
            enteringCards.push(card);
        });

        requestAnimationFrame(async () => {
            const animations: Array<Promise<void>> = [];

            if (movingCards.length > 0) {
                animations.push(
                    animate(movingCards, {
                        translateX: 0,
                        translateY: 0,
                        duration: 560,
                        delay: stagger(70),
                        ease: "outExpo",
                    }).then(() => undefined)
                );
            }

            if (enteringCards.length > 0) {
                animations.push(
                    animate(enteringCards, {
                        translateY: [40, 0],
                        opacity: [0, 1],
                        scale: [0.92, 1],
                        duration: 520,
                        delay: stagger(120),
                        ease: "outExpo",
                    }).then(() => undefined)
                );
            }

            if (animations.length > 0) {
                await Promise.all(animations);
            }

            Array.from(itemRefs.current.values()).forEach((card) => {
                card.style.willChange = "";
            });

            pendingLayoutRef.current = null;
            resolve();
        });
    }, [visibleIds]);

    useEffect(() => {
        const cards = visibleIds
            .map((id) => itemRefs.current.get(id))
            .filter((card): card is HTMLDivElement => Boolean(card));
        if (!cards.length) return;

        if (!hoveredSkill) {
            animate(cards, {
                opacity: 1,
                scale: 1,
                duration: 250,
                ease: "outQuad",
            });
            return;
        }

        const matched: HTMLDivElement[] = [];
        const dimmed: HTMLDivElement[] = [];

        cards.forEach((card) => {
            if (card.dataset.skillMatch === "true") {
                matched.push(card);
                return;
            }
            dimmed.push(card);
        });

        if (matched.length > 0) {
            animate(matched, {
                opacity: 1,
                scale: 1.02,
                duration: 250,
                ease: "outExpo",
            });
        }

        if (dimmed.length > 0) {
            animate(dimmed, {
                opacity: 0.28,
                scale: 0.94,
                duration: 250,
                ease: "outExpo",
            });
        }
    }, [hoveredSkill, visibleIds]);

    return (
        <section ref={sectionRef} className="about-dark-section projects-explorer-section">
            <div className="projects-explorer-shell">
                <div className="projects-explorer-header">
                    <h2>{lang === "ja" ? "プロジェクトエクスプローラー" : "Projects Explorer"}</h2>
                    <p ref={focusRef}>{focusLabel}</p>
                </div>

                <CategoryChips
                    active={activeCategory}
                    onChange={(nextCategory) =>
                        void runFilterTransition(nextCategory, selectedSkillRef.current)
                    }
                    categories={filterCategoriesLocalized}
                    counts={categoryCounts}
                />

                <div ref={gridRef} className="projects-module-grid">
                    {visibleProjects.map((project, index) => {
                        const skillMatch = projectMatchesSkill(project.tech, hoveredSkill);
                        return (
                            <div
                                key={project.id}
                                ref={(element) => {
                                    if (element) {
                                        itemRefs.current.set(project.id, element);
                                        return;
                                    }
                                    itemRefs.current.delete(project.id);
                                }}
                                className="project-module"
                                data-skill-match={String(skillMatch)}
                            >
                                <ProjectCard project={project} index={index} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
