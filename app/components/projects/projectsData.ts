export type LocalizedString = {
    en: string;
    ja: string;
};

export interface Project {
    id: number;
    title: string;
    shortTitle: string[];
    category: LocalizedString | string;
    tech: string[];
    description: LocalizedString | string;
    type: LocalizedString | string;
    status: string;
    year: string;
    image: string;
    architecture?: string[];
    github?: string;
    live?: string;
}

export const projects: Project[] = [
    {
        id: 1,
        title: "Yoga-Portfolio",
        shortTitle: ["SHUBHA", "YOGA"],
        category: { en: "Front-end", ja: "フロントエンド" },
        tech: ["Next.js", "Tailwind CSS", "three.js"],
        description: {
            en: "A gig that I did for a yoga instructor, where I made a portfolio website for her.",
            ja: "ヨガインストラクターのために制作したポートフォリオウェブサイト。"
        },
        type: { en: "experience", ja: "エクスペリエンス" },
        status: "active",
        year: "2025",
        image: "/yoga-portfolio.png",
        live: "https://toyourselfyoga.com/"
    },
    {
        id: 2,
        title: "Kotoba.Score",
        shortTitle: ["KOTOBA", ".SCORE"],
        category: { en: "Full-stack", ja: "フルスタック" },
        tech: ["Next.js", "PostgreSQL", "Tailwind CSS", "three.js"],
        description: {
            en: "A platform for Japanese Language Learners.",
            ja: "日本語学習者のための対話型学習プラットフォーム。"
        },
        type: { en: "platform", ja: "プラットフォーム" },
        status: "active",
        year: "2026",
        image: "/kotoba-score.png",
        live: "https://kotoba-score.vercel.app/"
    },
    {
        id: 3,
        title: "Anime Suisen",
        shortTitle: ["ANIME", "SUISEN"],
        category: { en: "Front-end", ja: "フロントエンド" },
        tech: ["Next.js", "Tailwind CSS"],
        description: {
            en: "A personal project that I did for an anime community.",
            ja: "アニメコミュニティ向けに作成した個人プロジェクト。"
        },
        type: { en: "product", ja: "プロダクト" },
        status: "active",
        year: "2025",
        image: "/anime_suisen.png",
        live: "https://anime-suisen.vercel.app/"
    },
    {
        id: 4,
        title: "Arjun Finance",
        shortTitle: ["Finance", "System"],
        category: { en: "Full stack", ja: "フルスタック" },
        tech: ["Next", "Gemini", "PostgreSQL", "Electron"],
        description: {
            en: "It's a personal private desktop finance management app using LLM. This is a Linux OS desktop application running locally using Electron.",
            ja: "LLMを活用した個人向けのプライベートデスクトップ資産管理アプリ。Electronを使用してLinuxでローカル動作。"
        },
        type: { en: "ai-system", ja: "AIシステム" },
        status: "active",
        year: "2026",
        image: "/finance.png",
        live: "https://github.com/arjun1127/finance-"
    },
    {
        id: 5,
        title: "Drug Repurposing",
        shortTitle: ["DRUG", "REPURPOSE"],
        category: { en: "AI/ML", ja: "AI/ML" },
        tech: ["Python", "PyTorch", "NumPy", "FastAPI", "React"],
        description: {
            en: "Repurposing Drug means finding new useful ways to use already existing drugs for the treatment of various diseases, helping researchers find new drugs for diseases that don't have proper medication.",
            ja: "既存の医薬品の新しい有効な適応症を発見し、適切な治療法がない疾病の研究・創薬を支援するAI/創薬システム。"
        },
        type: { en: "ai-system", ja: "AIシステム" },
        status: "experiment",
        year: "2024",
        image: "/drug_repurpose.png",
        live: "https://github.com/arjun1127/drug_repurpose"
    }
];

export const categories = [
    { id: "AI/ML", label: { en: "AI/ML", ja: "AI/ML" } },
    { id: "Front-end", label: { en: "Front-end", ja: "フロントエンド" } },
    { id: "Back-end", label: { en: "Back-end", ja: "バックエンド" } },
    { id: "Full-stack", label: { en: "Full-stack", ja: "フルスタック" } },
];