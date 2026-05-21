"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";

const navKeys = ["home", "about", "projects", "socials"] as const;
const navHrefs = ["/", "/about", "/projects", "/socials"] as const;

export default function SiteNav() {
    const pathname = usePathname();
    const navRef = useRef<HTMLElement>(null);
    const isMobile = useIsMobile();
    const [menuOpen, setMenuOpen] = useState(false);
    const { lang, toggleLang } = useLang();

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
                {t(translations.nav.logo, lang)}
            </Link>

            {/* Desktop links */}
            <ul className="site-nav-list site-nav-desktop">
                {navKeys.map((key, i) => {
                    const href = navHrefs[i];
                    const isActive = pathname === href;
                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                className={`site-nav-link${isActive ? " site-nav-active" : ""}`}
                            >
                                <span>{t(translations.nav[key], lang)}</span>
                                <span className="site-nav-underline" />
                            </Link>
                        </li>
                    );
                })}

                {/* Language toggle */}
                <li>
                    <button
                        type="button"
                        className="lang-toggle-btn"
                        onClick={toggleLang}
                        aria-label={`Switch to ${lang === "en" ? "Japanese" : "English"}`}
                    >
                        <span className={`lang-toggle-option ${lang === "en" ? "is-active" : ""}`}>EN</span>
                        <span className="lang-toggle-divider">/</span>
                        <span className={`lang-toggle-option ${lang === "ja" ? "is-active" : ""}`}>日本</span>
                    </button>
                </li>
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
                {navKeys.map((key, i) => {
                    const href = navHrefs[i];
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`mobile-menu-link${isActive ? " mobile-menu-active" : ""}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {t(translations.nav[key], lang)}
                        </Link>
                    );
                })}

                {/* Mobile language toggle */}
                <button
                    type="button"
                    className="lang-toggle-btn lang-toggle-mobile"
                    onClick={toggleLang}
                    aria-label={`Switch to ${lang === "en" ? "Japanese" : "English"}`}
                >
                    <span className={`lang-toggle-option ${lang === "en" ? "is-active" : ""}`}>EN</span>
                    <span className="lang-toggle-divider">/</span>
                    <span className={`lang-toggle-option ${lang === "ja" ? "is-active" : ""}`}>日本</span>
                </button>
            </div>
        </nav>
    );
}
