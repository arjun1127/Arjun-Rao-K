"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { homeNavLinks } from "./homeData";
import useIsMobile from "../../hooks/useIsMobile";

interface HomeNavigationProps {
    onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
}

export default function HomeNavigation({ onNavigate }: HomeNavigationProps) {
    const navRef = useRef<HTMLElement>(null);
    const isMobile = useIsMobile();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const nav = navRef.current;
        if (!nav || isMobile) return;

        const targets = Array.from(nav.querySelectorAll<HTMLElement>(".home-nav-link"));
        const cleanups: Array<() => void> = [];

        targets.forEach((target) => {
            const underline = target.querySelector<HTMLElement>(".home-nav-underline");

            const onEnter = () => {
                target.animate(
                    [
                        { opacity: 0.65, color: "rgba(12,12,12,0.65)" },
                        { opacity: 1, color: "#5470eb" },
                    ],
                    {
                        duration: 220,
                        fill: "forwards",
                        easing: "cubic-bezier(0.16,1,0.3,1)",
                    }
                );

                underline?.animate(
                    [{ transform: "scaleX(0.1)", opacity: 0.2 }, { transform: "scaleX(1)", opacity: 1 }],
                    {
                        duration: 220,
                        fill: "forwards",
                        easing: "cubic-bezier(0.16,1,0.3,1)",
                    }
                );
            };

            const onLeave = () => {
                target.animate(
                    [
                        { opacity: 1, color: "#5470eb" },
                        { opacity: 0.65, color: "rgba(12,12,12,0.65)" },
                    ],
                    {
                        duration: 180,
                        fill: "forwards",
                        easing: "ease-out",
                    }
                );

                underline?.animate(
                    [{ transform: "scaleX(1)", opacity: 1 }, { transform: "scaleX(0)", opacity: 0 }],
                    {
                        duration: 180,
                        fill: "forwards",
                        easing: "ease-out",
                    }
                );
            };

            target.addEventListener("pointerenter", onEnter);
            target.addEventListener("pointerleave", onLeave);
            target.addEventListener("focus", onEnter);
            target.addEventListener("blur", onLeave);

            cleanups.push(() => {
                target.removeEventListener("pointerenter", onEnter);
                target.removeEventListener("pointerleave", onLeave);
                target.removeEventListener("focus", onEnter);
                target.removeEventListener("blur", onLeave);
            });
        });

        return () => {
            cleanups.forEach((cleanup) => cleanup());
        };
    }, [isMobile]);

    return (
        <nav ref={navRef} className="home-nav" aria-label="Primary">
            <div className="home-logo">
                <Link href="/" onClick={(event) => onNavigate(event, "/")}>
                    Portfolio
                </Link>
            </div>

            {/* Desktop links */}
            <ul className="home-nav-list home-nav-desktop">
                {homeNavLinks.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="home-nav-link"
                            onClick={(event) => onNavigate(event, link.href)}
                        >
                            <span>{link.label}</span>
                            <span className="home-nav-underline" />
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Mobile hamburger */}
            <button
                type="button"
                className="home-mobile-menu-btn"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                <span className={`hamburger-line-dark${menuOpen ? " open" : ""}`} />
                <span className={`hamburger-line-dark${menuOpen ? " open" : ""}`} />
                <span className={`hamburger-line-dark${menuOpen ? " open" : ""}`} />
            </button>

            {/* Mobile panel */}
            <div className={`home-mobile-menu-panel${menuOpen ? " is-open" : ""}`}>
                {homeNavLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="home-mobile-menu-link"
                        onClick={(event) => {
                            setMenuOpen(false);
                            onNavigate(event, link.href);
                        }}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
