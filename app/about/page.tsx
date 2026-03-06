"use client";

import AboutHero from "../components/about/AboutHero";
import WhoIAm from "../components/about/WhoIAm";
import Philosophy from "../components/about/Philosophy";
import JourneyTimeline from "../components/about/JourneyTimeline";
import TechnicalDNA from "../components/about/TechnicalDNA";
import FutureVision from "../components/about/FutureVision";
import ConnectCTA from "../components/about/ConnectCTA";
import SiteNav from "../components/shared/SiteNav";

export default function About() {
    return (
        <main className="w-full bg-[#0c0c0c]">
            <SiteNav />
            {/* ── Section 1: Hero (dark) ── */}
            <AboutHero />

            {/* ── Section 2: Who I Am (glossy container) ── */}
            <section className="py-20">
                <div className="about-glossy-container">
                    <WhoIAm />
                </div>
            </section>

            {/* ── Section 3: Philosophy (dark — contrast break) ── */}
            <Philosophy />

            {/* ── Sections 4 & 6: Journey + Future (glossy container) ── */}
            <section className="py-20">
                <div className="about-glossy-container">
                    <JourneyTimeline />
                    <div style={{ height: 60 }} />
                    <FutureVision />
                </div>
            </section>

            {/* ── Section 5: Technical DNA (dark) ── */}
            <TechnicalDNA />

            {/* ── Section 7: Connect CTA (dark) ── */}
            <ConnectCTA />
        </main>
    );
}
