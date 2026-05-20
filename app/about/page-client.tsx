"use client";

import AboutHero from "../components/about/AboutHero";
import WhoIAm from "../components/about/WhoIAm";
import Hobbies from "../components/about/Hobbies";
import JourneyTimeline from "../components/about/JourneyTimeline";
import FutureVision from "../components/about/FutureVision";
import ConnectCTA from "../components/about/ConnectCTA";
import SiteNav from "../components/shared/SiteNav";

export default function About() {
    return (
        <main className="w-full bg-[#0c0c0c]">
            <SiteNav />
            {/* ── Section 1: Hero (dark) ── */}
            <AboutHero />

            {/* ── Glossy sections: Who I Am → Hobbies → Journey+Future ── */}
            <div className="about-glossy-container">
                <WhoIAm />
            </div>

            <div className="about-glossy-container-hobbies">
                <Hobbies />
            </div>

            <div className="about-glossy-container">
                <JourneyTimeline />
                <div style={{ height: 60 }} />
                <FutureVision />
            </div>

            {/* ── Section 6: Connect CTA (dark) ── */}
            <ConnectCTA />
        </main>
    );
}
