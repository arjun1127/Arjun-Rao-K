"use client";

import { useEffect } from "react";

export default function AnimatedFavicon() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let angle = 0;

    // Create or find link element for favicon
    let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "shortcut icon";
      document.head.appendChild(link);
    }

    const render = () => {
      ctx.clearRect(0, 0, 64, 64);
      angle += 0.04;

      // 1. Glowing Cyber Outer Ring
      ctx.save();
      ctx.translate(32, 32);
      ctx.rotate(angle * 0.5);
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.restore();

      // 2. Developer Silhouette Profile
      ctx.save();
      ctx.translate(26, 32);

      // Head Crown & Cyber Hair
      const pulseGlow = Math.sin(angle * 2) * 4 + 8;
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = pulseGlow;

      ctx.beginPath();
      ctx.arc(0, -6, 12, Math.PI, 0);
      ctx.fillStyle = "#7000FF";
      ctx.fill();

      // Visor / Face Contour
      ctx.beginPath();
      ctx.moveTo(-6, -6);
      ctx.lineTo(8, -6);
      ctx.lineTo(10, 4);
      ctx.lineTo(4, 14);
      ctx.lineTo(-6, 14);
      ctx.closePath();
      ctx.strokeStyle = "#00F0FF";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.stroke();

      // Glowing Eye Node
      ctx.fillStyle = "#FF007A";
      ctx.beginPath();
      ctx.arc(2, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Floating Animated Code Brackets { }
      const floatY = Math.sin(angle * 1.5) * 3;
      ctx.save();
      ctx.font = "900 16px monospace";
      ctx.fillStyle = "#00F0FF";
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 6;
      ctx.fillText("{", 44, 24 + floatY);
      
      ctx.fillStyle = "#FF007A";
      ctx.shadowColor = "#FF007A";
      ctx.fillText("}", 46, 46 - floatY);
      ctx.restore();

      // Update favicon link href
      if (link) {
        link.href = canvas.toDataURL("image/png");
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return null;
}
