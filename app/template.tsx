"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
    const templateRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        // Initial page load or route change animation
        if (templateRef.current) {
            gsap.fromTo(
                templateRef.current,
                {
                    opacity: 0,
                    y: 20,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                }
            );
        }
    }, [pathname]);

    return (
        <div ref={templateRef} className="opacity-0">
            {children}
        </div>
    );
}
