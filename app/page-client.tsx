"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SiteNav from "./components/shared/SiteNav";
import HomeHero from "./components/home/HomeHero";
import HomeWorksPreview from "./components/home/HomeWorksPreview";
import HomeContact from "./components/home/HomeContact";

gsap.registerPlugin(ScrollTrigger);

export default function HomeClient() {
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mainRef.current) return;

        // Master ScrollTrigger context to sync all 3 scenes
        const ctx = gsap.context(() => {
            // Refresh ScrollTrigger to account for dynamic image and font loading
            ScrollTrigger.refresh();
        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={mainRef} className="w-full bg-[#030303] min-h-screen relative selection:bg-[#5470eb] selection:text-white">
            {/* Top Navigation */}
            <SiteNav />

            {/* ── Scene 1: About Me (Hero Preview) ── */}
            <HomeHero />

            {/* ── Scene 2: My Works (Yoga Portfolio Preview) ── */}
            <HomeWorksPreview />

            {/* ── Scene 3: Contact (GitHub & Email Links) ── */}
            <HomeContact />
        </main>
    );
}
