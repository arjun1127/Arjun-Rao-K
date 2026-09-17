"use client";

import { useEffect } from "react";

export function useIframeButtonText(
    containerRef: React.RefObject<HTMLElement | null>,
    text: string,
    lang?: string
) {
    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        const sendMsg = () => {
            const iframe = container.querySelector("iframe");
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(
                    { btnText: text, label: text, text: text },
                    "*"
                );
            }
        };

        // Firing sequence to guarantee message delivery across dev and production builds
        sendMsg();

        const delays = [50, 150, 300, 600, 1000, 2000, 3500];
        const timers = delays.map((delay) => setTimeout(sendMsg, delay));

        const iframe = container.querySelector("iframe");
        if (iframe) {
            iframe.addEventListener("load", sendMsg);
        }

        return () => {
            timers.forEach((t) => clearTimeout(t));
            if (iframe) {
                iframe.removeEventListener("load", sendMsg);
            }
        };
    }, [containerRef, text, lang]);
}
