"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/socials", label: "Socials" },
];

export default function SiteNav() {
    const pathname = usePathname();
    const navRef = useRef<HTMLElement>(null);
    const isMobile = useIsMobile();
    const [menuOpen, setMenuOpen] = useState(false);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const nav = navRef.current;
        if (!nav || isMobile) return;

        const links = Array.from(nav.querySelectorAll<HTMLElement>(".site-nav-link"));
        const cleanups: Array<() => void> = [];

        links.forEach((link) => {
            if (link.classList.contains("site-nav-active")) return;

            const underline = link.querySelector<HTMLElement>(".site-nav-underline");

            const onEnter = () => {
                link.animate(
                    [{ color: "rgba(255,255,255,0.55)" }, { color: "#ffffff" }],
                    { duration: 200, fill: "forwards", easing: "cubic-bezier(0.16,1,0.3,1)" }
                );
                underline?.animate(
                    [
                        { transform: "scaleX(0)", opacity: 0 },
                        { transform: "scaleX(1)", opacity: 1 },
                    ],
                    { duration: 200, fill: "forwards", easing: "cubic-bezier(0.16,1,0.3,1)" }
                );
            };

            const onLeave = () => {
                link.animate(
                    [{ color: "#ffffff" }, { color: "rgba(255,255,255,0.55)" }],
                    { duration: 180, fill: "forwards", easing: "ease-out" }
                );
                underline?.animate(
                    [
                        { transform: "scaleX(1)", opacity: 1 },
                        { transform: "scaleX(0)", opacity: 0 },
                    ],
                    { duration: 180, fill: "forwards", easing: "ease-out" }
                );
            };

            link.addEventListener("pointerenter", onEnter);
            link.addEventListener("pointerleave", onLeave);

            cleanups.push(() => {
                link.removeEventListener("pointerenter", onEnter);
                link.removeEventListener("pointerleave", onLeave);
            });
        });

        return () => cleanups.forEach((fn) => fn());
    }, [pathname, isMobile]);

    return (
        <nav ref={navRef} className="site-nav" aria-label="Site navigation">
            <Link href="/" className="site-nav-logo">
                ARJUN RAO
            </Link>

            {/* Desktop links */}
            <ul className="site-nav-list site-nav-desktop">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`site-nav-link${isActive ? " site-nav-active" : ""}`}
                            >
                                <span>{link.label}</span>
                                <span className="site-nav-underline" />
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Mobile hamburger */}
            <button
                type="button"
                className="mobile-menu-btn"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                <span className={`hamburger-line${menuOpen ? " open" : ""}`} />
                <span className={`hamburger-line${menuOpen ? " open" : ""}`} />
                <span className={`hamburger-line${menuOpen ? " open" : ""}`} />
            </button>

            {/* Mobile panel */}
            <div className={`mobile-menu-panel${menuOpen ? " is-open" : ""}`}>
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`mobile-menu-link${isActive ? " mobile-menu-active" : ""}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
