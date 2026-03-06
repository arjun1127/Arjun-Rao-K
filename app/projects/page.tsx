import { Metadata } from "next";
import ProjectsClient from "./page-client";

export const metadata: Metadata = {
    title: "Projects",
    description: "Explore the interactive engineering projects and backend systems developed by Arjun Rao.",
};

export default function Projects() {
    return <ProjectsClient />;
}
