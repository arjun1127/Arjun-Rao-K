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
