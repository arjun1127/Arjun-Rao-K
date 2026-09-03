"use client";

import { TempleNightScene } from "@/src/shaders/temple-night/TempleNightScene";
import "@/src/shaders/threeui.css";

/**
 * VoidScene — Full-viewport background for the landing page using TempleNightScene.
 */
export default function VoidScene() {
    return (
        <div className="shader-frame">
            <TempleNightScene variant="temple-night" />
        </div>
    );
}
