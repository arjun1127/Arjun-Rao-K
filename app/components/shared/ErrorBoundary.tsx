"use client";

import React, { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.warn("[ErrorBoundary caught error]:", error, errorInfo);
    }

    public componentDidMount() {
        if (typeof window !== "undefined") {
            window.addEventListener("unhandledrejection", this.handleUnhandledRejection);
        }
    }

    public componentWillUnmount() {
        if (typeof window !== "undefined") {
            window.removeEventListener("unhandledrejection", this.handleUnhandledRejection);
        }
    }

    private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const reason = event.reason;
        const msg = typeof reason === "string" ? reason : reason?.message || "";

        if (
            msg.includes("A listener indicated an asynchronous response") ||
            msg.includes("message channel closed") ||
            msg.includes("The message port closed before a response was received")
        ) {
            event.preventDefault();
        }
    };

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || null;
        }

        return this.props.children;
    }
}
