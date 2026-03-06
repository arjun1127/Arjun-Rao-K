"use client";

import HomeAmbientEnvironment from "./components/home/HomeAmbientEnvironment";
import HomeStudioShell from "./components/home/HomeStudioShell";

export default function Home() {
    return (
        <main
            className="home-root animate-gradient"
            data-barba="container"
            data-barba-namespace="home"
        >
            <HomeAmbientEnvironment />
            <HomeStudioShell />
        </main>
    );
}
