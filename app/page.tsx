import { Metadata } from "next";
import HomeClient from "./page-client";

export const metadata: Metadata = {
    title: {
        absolute: "ARJUN RAO | HOME"
    },
    description: "Welcome to the portfolio of Arjun Rao. Interactive web experiences built with Next.js, Three.js, and GSAP, Anime.js",
};

export default function Home() {
    return <HomeClient />;
}
