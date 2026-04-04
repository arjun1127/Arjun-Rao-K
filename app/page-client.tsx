"use client";

import VoidScene from "./components/home/VoidScene";
import HomeHeroCopy from "./components/home/HomeHeroCopy";
import PortalGrid from "./components/home/PortalGrid";

export default function HomeClient() {
    return (
        <main className="void-landing" data-barba="container" data-barba-namespace="home">
            {/* Three.js void background */}
            <VoidScene />

            {/* Foreground content */}
            <div className="void-content">
                <HomeHeroCopy />
                <PortalGrid />
            </div>
        </main>
    );
}
