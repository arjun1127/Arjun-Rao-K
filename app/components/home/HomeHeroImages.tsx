"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animate } from "animejs";

export default function HomeHeroImages() {
    const hero1FloatRef = useRef<HTMLDivElement>(null);
    const hero2FloatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (hero1FloatRef.current) {
            animate(hero1FloatRef.current, {
                translateY: [-8, 8],
                rotate: [-0.5, 0.5],
                duration: 3500,
                ease: "inOutSine",
                alternate: true,
                loop: true,
            });
        }

        if (hero2FloatRef.current) {
            animate(hero2FloatRef.current, {
                translateY: [6, -6],
                translateX: [-3, 3],
                rotate: [0.5, -0.5],
                duration: 2800,
                ease: "inOutSine",
                alternate: true,
                loop: true,
            });
        }
    }, []);

    return (
        <>
            <div
                className="hero-image hero2-wrapper"
                style={{
                    position: "absolute",
                    left: `${(877 / 1444) * 100}%`,
                    top: `${(160 / 657) * 100}%`,
                    width: `${(243 / 1444) * 100}%`,
                    zIndex: 5,
                }}
            >
                <div ref={hero2FloatRef} className="hero-image-float">
                    <Image
                        src="/Hero2.png"
                        alt="Hero accent"
                        width={243}
                        height={243}
                        className="object-contain drop-shadow-xl"
                    />
                </div>
            </div>

            <div
                className="hero-image hero1-wrapper"
                style={{
                    position: "absolute",
                    left: `${(914 / 1444) * 100}%`,
                    top: `${(240 / 657) * 100}%`,
                    width: `${(662 / 1444) * 100}%`,
                    zIndex: 10,
                }}
            >
                <div ref={hero1FloatRef} className="hero-image-float">
                    <Image
                        src="/Hero1.png"
                        alt="Hero"
                        width={662}
                        height={595}
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </div>
            </div>
        </>
    );
}
