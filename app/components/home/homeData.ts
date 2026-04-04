export const homeNavLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/socials", label: "Socials" },
] as const;

export const homeTitle = "ARJUN RAO";
export const homeTitleJP = "アルジュン・ラオ";

export const homeCopy = {
    kicker: "Interactive Engineering Studio",
    subtitle: "Interactive Systems Engineer",
    description:
        "Building immersive digital systems with animation-first design and engineering logic.",
    descriptionJP:
        "アニメーションファーストデザインとエンジニアリングロジックを使用して、浸没型デジタルシステムを構築します。",
    ctas: [
        { href: "/projects", label: "View Projects", variant: "primary" as const },
        { href: "/about", label: "About Me", variant: "secondary" as const },
    ],
};

/* ── Portal data for the Void Landing ── */
export type PortalShape = "icosahedron" | "octahedron" | "dodecahedron" | "torus";

export interface PortalInfo {
    id: string;
    title: string;
    tagline: string;
    href: string;
    shape: PortalShape;
}

export const portals: PortalInfo[] = [
    {
        id: "about",
        title: "About",
        tagline: "Who I am & how I think",
        href: "/about",
        shape: "icosahedron",
    },
    {
        id: "projects",
        title: "Projects",
        tagline: "Systems I've engineered",
        href: "/projects",
        shape: "octahedron",
    },
    {
        id: "skills",
        title: "Skills",
        tagline: "Technical DNA & stack",
        href: "/projects#skills",
        shape: "dodecahedron",
    },
    {
        id: "contact",
        title: "Contact",
        tagline: "Start a conversation",
        href: "/socials",
        shape: "torus",
    },
];
