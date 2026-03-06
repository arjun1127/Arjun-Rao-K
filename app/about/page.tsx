import { Metadata } from "next";
import AboutClient from "./page-client";

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about Arjun Rao, a creative developer blending interactive designs with solid backend systems.",
};

export default function About() {
    return <AboutClient />;
}
