"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const hobbies = [
    {
        title: "Badminton",
        tag: "COMPETITIVE",
        description:
            "As a Hobby I play Badminton almost everyday, It is the best way to refresh my state and let me have a good start to morning , sometimes I participate in local tournamnets for fun!!",
        images: ["/hobby2.png", "/hobby1.png"],
        layout: "duo" as const,
    },
    {
        title: "Bike Rides",
        tag: "ADVENTURE",
        description:
            "I like to ride vechicles not just bikes, Cars also but on open roads!! , I go on random small trips solo or with freinds for refreshments .",
        images: ["/hobby3.png"],
        layout: "solo" as const,
    },
];

export default function Hobbies() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            // Title reveal
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: "top 85%",
                        once: true,
                    },
                }
            );

            // Cards staggered reveal
            cardsRef.current.forEach((card, i) => {
                if (!card) return;
                gsap.fromTo(
                    card,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power3.out",
                        delay: i * 0.15,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 88%",
                            once: true,
                        },
                    }
                );
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="hobbies-section">
            <div className="hobbies-container">
                {/* Section header */}
                <div className="hobbies-header">
                    <span className="hobbies-kicker">OFF THE SCREEN</span>
                    <h2 ref={titleRef} className="hobbies-title">
                        Things I Love
                    </h2>
                </div>

                {/* Hobby cards */}
                <div className="hobbies-cards">
                    {hobbies.map((hobby, idx) => (
                        <div
                            key={hobby.title}
                            ref={(el) => { cardsRef.current[idx] = el; }}
                            className={`hobby-card ${hobby.layout === "duo" ? "hobby-card--duo" : "hobby-card--solo"}`}
                        >
                            {/* Image gallery */}
                            <div className={`hobby-gallery ${hobby.layout === "duo" ? "hobby-gallery--duo" : "hobby-gallery--solo"}`}>
                                {hobby.images.map((src, imgIdx) => (
                                    <div
                                        key={imgIdx}
                                        className={`hobby-img-wrap ${hobby.layout === "duo" && imgIdx === 0 ? "hobby-img-wrap--portrait" : ""} ${hobby.layout === "duo" && imgIdx === 1 ? "hobby-img-wrap--square" : ""}`}
                                    >
                                        <Image
                                            src={src}
                                            alt={`${hobby.title} ${imgIdx + 1}`}
                                            width={800}
                                            height={800}
                                            className="hobby-img"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Text content */}
                            <div className="hobby-text">
                                <span className="hobby-tag">{hobby.tag}</span>
                                <h3 className="hobby-name">{hobby.title}</h3>
                                <p className="hobby-desc">{hobby.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
