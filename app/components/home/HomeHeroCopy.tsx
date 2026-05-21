"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { animate, stagger } from "animejs";
import { Github, Linkedin, Download } from "lucide-react";
import { useLang } from "../../i18n/LangContext";
import { translations, t } from "../../i18n/translations";
/* ── timing ── */
const CYCLE_INTERVAL = 5000;
const CHAR_OUT_DUR = 420;
const CHAR_IN_DUR = 520;
const DESC_OUT_DUR = 600;
const DESC_IN_DUR = 700;

/* ── B&W theme palette for character hover colors ── */
const THEME_COLORS = ["#ffffff", "#999999", "#cccccc", "#666666", "#e0e0e0"];

function splitToChars(text: string) {
    return text.split("").map((ch) => (ch === " " ? "\u00A0" : ch));
}

export default function HomeHeroCopy() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isJPRef = useRef(false);
    const { lang, toggleLang } = useLang();


    const enTitle = t(translations.home.title, "en");
    const jaTitle = t(translations.home.title, "ja");

    const [titleChars, setTitleChars] = useState(() => splitToChars(enTitle));

    /* ── character hover effect ── */
    useEffect(() => {
        const title = titleRef.current;
        if (!title) return;

        const chars = Array.from(title.querySelectorAll<HTMLElement>(".home-title-char"));
        const cleanups: Array<() => void> = [];

        chars.forEach((el) => {
            const original = el.style.color || "";

            const onEnter = () => {
                const c = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
                animate(el, {
                    color: c,
                    scale: [1, 1.18],
                    duration: 200,
                    ease: "outExpo",
                });
            };

            const onLeave = () => {
                animate(el, {
                    color: original || "#ffffff",
                    scale: [1.18, 1],
                    duration: 300,
                    ease: "outExpo",
                });
            };

            el.addEventListener("pointerenter", onEnter);
            el.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
                el.removeEventListener("pointerenter", onEnter);
                el.removeEventListener("pointerleave", onLeave);
            });
        });

        return () => cleanups.forEach((fn) => fn());
    }, [titleChars]);

    /* ── alternating EN ↔ JP swap ── */
    const swapText = useCallback(() => {
        const title = titleRef.current;
        const desc = descRef.current;
        if (!title || !desc) return;

        const chars = title.querySelectorAll<HTMLElement>(".home-title-char");

        animate(chars, {
            opacity: [1, 0],
            translateY: [0, -20],
            delay: stagger(35),
            duration: CHAR_OUT_DUR,
            ease: "inQuad",
            onComplete: () => {
                const next = !isJPRef.current;
                isJPRef.current = next;
                setTitleChars(splitToChars(next ? jaTitle : enTitle));
            },
        });

        animate(desc, {
            opacity: [1, 0],
            translateY: [0, -14],
            duration: DESC_OUT_DUR,
            ease: "inQuad",
            onComplete: () => {
                desc.textContent = isJPRef.current
                    ? t(translations.home.description, "ja")
                    : t(translations.home.description, "en");
                animate(desc, {
                    opacity: [0, 1],
                    translateY: [14, 0],
                    duration: DESC_IN_DUR,
                    ease: "outExpo",
                });
            },
        });
    }, [enTitle, jaTitle]);

    /* ── Animate chars in after React re-renders ── */
    useEffect(() => {
        const title = titleRef.current;
        if (!title) return;

        const chars = title.querySelectorAll<HTMLElement>(".home-title-char");
        if (!chars.length) return;

        animate(chars, {
            opacity: [0, 1],
            translateY: [20, 0],
            delay: stagger(40),
            duration: CHAR_IN_DUR,
            ease: "outExpo",
        });
    }, [titleChars]);

    /* ── cycle timer ── */
    useEffect(() => {
        const startCycle = () => {
            timerRef.current = setTimeout(() => {
                swapText();
                startCycle();
            }, CYCLE_INTERVAL);
        };

        const initialDelay = setTimeout(() => {
            startCycle();
        }, 3200);

        return () => {
            clearTimeout(initialDelay);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [swapText]);

    return (
        <section className="hero-copy-void">
            {/* Scan-line overlay */}
            <div className="scan-line-overlay" aria-hidden="true" />

            <p className="void-kicker">{t(translations.home.kicker, lang)}</p>

            <h1 ref={titleRef} className="void-title sekuya-regular">
                {titleChars.map((char, i) => (
                    <span key={`${char}-${i}`} className="home-title-char">
                        {char}
                    </span>
                ))}
            </h1>

            <h2 className="void-subtitle">{t(translations.home.subtitle, lang)}</h2>

            <p ref={descRef} className="void-description">
                {t(translations.home.description, lang)}
            </p>

            <div className="hero-social-links" style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', justifyContent: 'center', opacity: 0.8 }}>
                <a href="https://github.com/arjun1127" target="_blank" rel="noreferrer" className="hero-social-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                    <Github size={20} />
                    <span>{t(translations.home.github, lang)}</span>
                </a>
                <a href="https://www.linkedin.com/in/arjun-rao-1520a424a/" target="_blank" rel="noreferrer" className="hero-social-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                    <Linkedin size={20} />
                    <span>{t(translations.home.linkedin, lang)}</span>
                </a>
                <a href="/Arjun_resume.pdf" target="_blank" rel="noreferrer" className="hero-social-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                    <Download size={20} />
                    <span>{t(translations.home.resume, lang)}</span>
                </a>
            </div>
            <button className="lang-toggle-btn lang-toggle-mobile" onClick={() => toggleLang()}>
                {lang === "en" ? (
                    <>
                        <span className="lang-toggle-option is-active">EN</span>
                        <span className="lang-toggle-divider">/</span>
                        <span className="lang-toggle-option">日本</span>
                    </>
                ) : (
                    <>
                        <span className="lang-toggle-option">EN</span>
                        <span className="lang-toggle-divider">/</span>
                        <span className="lang-toggle-option is-active">日本</span>
                    </>
                )}
            </button>
            <h4>{lang == "ja" ? (<p className="jap-mistake">日本語がまちがっていたらすみません。</p>) : (<p></p>)}</h4>
        </section>
    );
}
