"use client";

import { useEffect } from "react";

interface CustomizationOptions {
    containerRef: React.RefObject<HTMLElement | null>;
    text?: string;
    color?: string;
    lang?: string;
}

export function useIframeButtonCustomization({
    containerRef,
    text,
    color,
    lang,
}: CustomizationOptions) {
    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        const postCustomization = () => {
            const iframe = container.querySelector("iframe");
            if (!iframe || !iframe.contentWindow) return false;

            const payload: Record<string, any> = {};
            if (text) {
                payload.btnText = text;
                payload.label = text;
                payload.text = text;
            }
            if (color) {
                payload.color = color;
                payload.textColor = color;
            }

            try {
                iframe.contentWindow.postMessage(payload, "*");
                iframe.contentWindow.postMessage({ threeuiRuntime: payload }, "*");
                return true;
            } catch (err) {
                return false;
            }
        };

        // 1. Send immediately
        postCustomization();

        // 2. Attach load handler
        const handleLoad = () => {
            postCustomization();
        };

        let activeIframe: HTMLIFrameElement | null = null;
        const attachIframe = () => {
            const iframe = container.querySelector("iframe");
            if (iframe && iframe !== activeIframe) {
                if (activeIframe) {
                    activeIframe.removeEventListener("load", handleLoad);
                }
                activeIframe = iframe;
                activeIframe.addEventListener("load", handleLoad);
                postCustomization();
            }
        };

        attachIframe();

        // 3. MutationObserver to capture iframe as soon as React Suspense mounts it in production
        const observer = new MutationObserver(() => {
            attachIframe();
            postCustomization();
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
        });

        // 4. Staggered retry schedule for production script initialization timing
        const delays = [50, 150, 300, 600, 1000, 1800, 3000];
        const timers = delays.map((delay) =>
            setTimeout(() => {
                attachIframe();
                postCustomization();
            }, delay)
        );

        return () => {
            observer.disconnect();
            timers.forEach((t) => clearTimeout(t));
            if (activeIframe) {
                activeIframe.removeEventListener("load", handleLoad);
            }
        };
    }, [containerRef, text, color, lang]);
}
