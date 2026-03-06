"use client";

import { useCallback, useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { animate, stagger } from "animejs";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import HomeNavigation from "./HomeNavigation";
import HomeHeroImages from "./HomeHeroImages";
import HomeHeroCopy from "./HomeHeroCopy";
import useIsMobile from "../../hooks/useIsMobile";

function isModifiedClick(event: ReactMouseEvent<HTMLAnchorElement>): boolean {
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export default function HomeStudioShell() {
    const shellRef = useRef<HTMLDivElement>(null);
    const transitionLockRef = useRef(false);
    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useIsMobile();

    const handleNavigate = useCallback(
        (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
            if (isModifiedClick(event) || href === pathname || transitionLockRef.current) return;

            event.preventDefault();
            transitionLockRef.current = true;

            const shell = shellRef.current;
            if (!shell) {
                router.push(href);
                transitionLockRef.current = false;
                return;
            }

            gsap
                .timeline({
                    defaults: { ease: "power2.inOut" },
                    onComplete: () => {
                        router.push(href);
                        transitionLockRef.current = false;
                    },
                })
                .to(
                    shell.querySelectorAll(".hero-image"),
                    {
                        opacity: 0,
                        scale: 0.92,
                        y: 20,
                        stagger: 0.06,
                        duration: 0.24,
                    },
                    0
                )
                .to(
                    shell,
                    {
                        opacity: 0,
                        y: 18,
                        duration: 0.38,
                    },
                    0.08
                );
        },
        [pathname, router]
    );

    useEffect(() => {
        const shell = shellRef.current;
        if (!shell) return;

        const nav = shell.querySelector(".home-nav");
        const heroImages = shell.querySelectorAll(".hero-image");
        const titleChars = shell.querySelectorAll(".home-title-char");
        const subtitle = shell.querySelector(".home-subtitle");
        const description = shell.querySelector(".home-description");
        const ctaButtons = shell.querySelectorAll(".home-cta-btn");

        const intro = async () => {
            if (nav) {
                await animate(nav, {
                    opacity: [0, 1],
                    translateY: [-28, 0],
                    duration: 560,
                    ease: "outExpo",
                });
            }

            if (heroImages.length > 0) {
                await animate(heroImages, {
                    opacity: [0, 1],
                    scale: [0.92, 1],
                    translateY: [34, 0],
                    delay: stagger(160),
                    duration: 720,
                    ease: "outExpo",
                });
            }

            if (titleChars.length > 0) {
                animate(titleChars, {
                    opacity: [0, 1],
                    translateY: [42, 0],
                    delay: stagger(55),
                    duration: 560,
                    ease: "outExpo",
                });
            }

            if (subtitle) {
                animate(subtitle, {
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 740,
                    delay: 360,
                    ease: "outExpo",
                });
            }

            if (description) {
                animate(description, {
                    opacity: [0, 1],
                    translateY: [18, 0],
                    duration: 680,
                    delay: 520,
                    ease: "outExpo",
                });
            }

            if (ctaButtons.length > 0) {
                animate(ctaButtons, {
                    opacity: [0, 1],
                    translateY: [20, 0],
                    delay: stagger(120, { start: 680 }),
                    duration: 480,
                    ease: "outExpo",
                });
            }
        };

        void intro();
    }, []);

    useEffect(() => {
        if (isMobile) return;
        const shell = shellRef.current;
        if (!shell) return;

        const heroImages = Array.from(shell.querySelectorAll<HTMLElement>(".hero-image"));
        if (!heroImages.length) return;

        const movers = heroImages.map((element, index) => {
            const depth = 9 + index * 7;
            return {
                x: gsap.quickTo(element, "x", { duration: 0.7, ease: "power3.out" }),
                y: gsap.quickTo(element, "y", { duration: 0.7, ease: "power3.out" }),
                depth,
            };
        });

        const handleMove = (event: PointerEvent) => {
            const rect = shell.getBoundingClientRect();
            const normX = (event.clientX - rect.left) / rect.width - 0.5;
            const normY = (event.clientY - rect.top) / rect.height - 0.5;

            movers.forEach((mover) => {
                mover.x(normX * mover.depth * 2.2);
                mover.y(normY * mover.depth * 1.6);
            });
        };

        const handleLeave = () => {
            movers.forEach((mover) => {
                mover.x(0);
                mover.y(0);
            });
        };

        shell.addEventListener("pointermove", handleMove);
        shell.addEventListener("pointerleave", handleLeave);

        return () => {
            shell.removeEventListener("pointermove", handleMove);
            shell.removeEventListener("pointerleave", handleLeave);
        };
    }, [isMobile]);

    return (
        <div ref={shellRef} className="content-div home-studio-shell">
            <HomeNavigation onNavigate={handleNavigate} />
            <HomeHeroImages />
            <HomeHeroCopy onNavigate={handleNavigate} />
        </div>
    );
}
