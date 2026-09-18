"use client";

import ProjectsHero from "../components/projects/ProjectsHero";
import SiteNav from "../components/shared/SiteNav";
import ErrorBoundary from "../components/shared/ErrorBoundary";

export default function Projects() {
    return (
        <main className="projects-page-root" data-page="projects">
            <SiteNav />
            <ErrorBoundary fallback={<div className="min-h-screen bg-[#030303] text-white p-8">Loading Projects...</div>}>
                <ProjectsHero />
            </ErrorBoundary>
        </main>
    );
}
