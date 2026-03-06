import { Metadata } from "next";
import HomeClient from "./page-client";

export const metadata: Metadata = {
    title: "Home",
    description: "Welcome to the portfolio of Arjun Rao. Interactive web experiences built with Next.js, Three.js, and GSAP.",
};

export default function Home() {
    return <HomeClient />;
}
