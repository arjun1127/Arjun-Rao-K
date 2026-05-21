export type Lang = "en" | "ja";

export const translations = {
    /* ── Navigation ── */
    nav: {
        home: { en: "Home", ja: "ホーム" },
        about: { en: "About", ja: "自己紹介" },
        projects: { en: "Projects", ja: "プロジェクト" },
        socials: { en: "Socials", ja: "ソーシャル" },
        logo: { en: "ARJUN RAO", ja: "アルジュン・ラオ" },
    },

    /* ── Home Page ── */
    home: {
        kicker: { en: "Interactive Engineering Studio", ja: "インタラクティブエンジニアリングスタジオ" },
        title: { en: "ARJUN RAO", ja: "アルジュン・ラオ" },
        subtitle: { en: "Software Engineer", ja: "ソフトウェアエンジニア" },
        description: {
            en: "Building immersive digital systems with animation-first design and engineering logic.",
            ja: "アニメーションファーストデザインとエンジニアリングロジックを使用して、没入型デジタルシステムを構築します。",
        },
        viewProjects: { en: "View Projects", ja: "プロジェクトを見る" },
        aboutMe: { en: "About Me", ja: "自己紹介" },
        github: { en: "GitHub", ja: "GitHub" },
        linkedin: { en: "LinkedIn", ja: "LinkedIn" },
        resume: { en: "Resume", ja: "履歴書" },
    },

    /* ── Home Portals ── */
    portals: {
        about: {
            title: { en: "ARJUN.RAO", ja: "アルジュン.ラオ" },
            tagline: { en: "About me and My Life-style", ja: "私について＆ライフスタイル" },
        },
        projects: {
            title: { en: "PROJECTS", ja: "プロジェクト" },
            tagline: { en: "Systems I've engineered", ja: "私が設計したシステム" },
        },
        skills: {
            title: { en: "SKILLS", ja: "スキル" },
            tagline: { en: "Technical DNA & stack", ja: "技術DNA＆スタック" },
        },
        contact: {
            title: { en: "CONTACT", ja: "連絡先" },
            tagline: { en: "Start a conversation", ja: "会話を始める" },
        },
    },

    /* ── About Page ── */
    about: {
        heroTitle: { en: "Arjun Rao", ja: "アルジュン・ラオ" },
        heroDesc: {
            en: "ECE Graduate experienced in building AI based Web Applications and Machine Learning systems",
            ja: "AIベースのWebアプリケーションと機械学習システムの構築に経験があるECE卒業生",
        },
        heroDesc2: {
            en: "Currently exploring 3D web engineering, Blender, and Smart ways to improve one's Workflow and Systems.",
            ja: "現在、3Dウェブエンジニアリング、Blender、ワークフローとシステムを改善するスマートな方法を探求中。",
        },
        viewProjects: { en: "View Projects", ja: "プロジェクトを見る" },
        contact: { en: "Contact", ja: "連絡先" },
        status: { en: "STATUS", ja: "ステータス" },
        statusText: { en: "2027 •  TOKYO 🇯🇵", ja: "2027 •  東京 🇯🇵" },
        scrollToExplore: { en: "Scroll to explore", ja: "スクロールして探索" },

        /* Who I Am */
        whoTitle: { en: "Hello !,", ja: "こんにちは！" },
        whoDesc1: {
            en: "I'm currently balancing between learning Japanese and building software systems.",
            ja: "現在、日本語の学習とソフトウェアシステムの構築のバランスを取っています。",
        },
        whoDesc2: {
            en: "I plan to offer services in software development, focusing on advanced 3D websites, portfolio experiences, end-to-end web development, and AI integrations.",
            ja: "高度な3Dウェブサイト、ポートフォリオ体験、エンドツーエンドのウェブ開発、AI統合に焦点を当てたソフトウェア開発サービスを提供する予定です。",
        },
        whoDesc3: {
            en: "For now, explore some of my landing page code snippets.",
            ja: "今のところ、私のランディングページのコードスニペットをご覧ください。",
        },
        viewCodeSnippets: { en: "View Code Snippets", ja: "コードスニペットを見る" },

        /* Hobbies */
        hobbiesKicker: { en: "OFF THE SCREEN", ja: "画面の外で" },
        hobbiesTitle: { en: "Things I Love", ja: "好きなこと" },
        hobbyBadminton: {
            title: { en: "Badminton", ja: "バドミントン" },
            tag: { en: "COMPETITIVE", ja: "競技" },
            desc: {
                en: "As a Hobby I play Badminton almost everyday, It is the best way to refresh my state and let me have a good start to morning , sometimes I participate in local tournamnets for fun!!",
                ja: "趣味としてほぼ毎日バドミントンをしています。リフレッシュして朝のスタートを切るのに最適です。時々楽しみで地元のトーナメントに参加します！",
            },
        },
        hobbyBikeRides: {
            title: { en: "Bike Rides", ja: "バイクライド" },
            tag: { en: "ADVENTURE", ja: "冒険" },
            desc: {
                en: "I like to ride vechicles not just bikes, Cars also but on open roads!! , I go on random small trips solo or with freinds for refreshments .",
                ja: "バイクだけでなく車も、オープンロードで運転するのが好きです！リフレッシュのためにソロや友達とランダムな小旅行に出かけます。",
            },
        },

        /* Journey Timeline */
        journeyTitle: { en: "Developer Journey", ja: "開発者の旅" },
        milestones: [
            {
                year: "2022",
                label: { en: "Started Programming and Engineering in ECE", ja: "ECEでプログラミングとエンジニアリングを開始" },
                desc: {
                    en: "Discovered the world of code began with JAVA, problem-solving, and building small projects.",
                    ja: "JAVAから始まり、問題解決と小さなプロジェクトの構築でコードの世界を発見しました。",
                },
            },
            {
                year: "2024",
                label: { en: "Full-Stack & AI", ja: "フルスタック＆AI" },
                desc: {
                    en: "Built end-to-end applications with React, Node, databases, and built ML systems for college projects on Electronics and Communication Engineering.",
                    ja: "React、Node、データベースでエンドツーエンドアプリケーションを構築し、電子通信工学の大学プロジェクトのためにMLシステムを構築しました。",
                },
            },
            {
                year: "2025-2026",
                label: { en: "Interactive Web Engineering", ja: "インタラクティブウェブエンジニアリング" },
                desc: {
                    en: "Exploring immersive web experiences Three.js, GSAP, animations, and real-time interactive interfaces.",
                    ja: "Three.js、GSAP、アニメーション、リアルタイムインタラクティブインターフェースで没入型ウェブ体験を探求。",
                },
            },
            {
                year: "2026-2027",
                label: { en: "Freelance and Future", ja: "フリーランスと未来" },
                desc: {
                    en: "Plans of doing freelancing and in next year will be reloacting for Tokyo for work.",
                    ja: "フリーランスを行う計画があり、来年は仕事のために東京に移住する予定です。",
                },
            },
        ],

        /* Future Vision */
        futureTitle: { en: "What I'm Exploring", ja: "探求していること" },
        explorations: [
            { en: "Agentic AI use cases, and its applications", ja: "エージェントAIのユースケースとその応用" },
            { en: "Web systems with 3D, sound, and interaction", ja: "3D、サウンド、インタラクションを備えたWebシステム" },
        ],

        /* Connect CTA */
        ctaTitle: { en: "Interested in building something together?", ja: "一緒に何かを作りませんか？" },
        ctaButton: { en: "Let's Talk", ja: "話しましょう" },
    },

    /* ── Projects Page ── */
    projects: {
        heroTitle: { en: "Projects", ja: "プロジェクト" },
        heroSubtitle: {
            en: "Some of projects that I was involved in during my college",
            ja: "大学時代に関わったプロジェクトの一部",
        },
        skillSystem: { en: "Skill System", ja: "スキルシステム" },
        skillSystemDesc: {
            en: "Skills map directly to project evidence. Click any node to filter modules.",
            ja: "スキルはプロジェクトの証拠に直接マッピングされます。ノードをクリックしてモジュールをフィルタリング。",
        },
        skillSystemDescMobile: {
            en: "Tap any skill to filter projects below.",
            ja: "スキルをタップして下のプロジェクトをフィルタリング。",
        },
        selectedSkill: { en: "Selected Skill", ja: "選択したスキル" },
        allSkills: { en: "All Skills", ja: "すべてのスキル" },
        clear: { en: "Clear", ja: "クリア" },
        categories: {
            "intelligent-systems": { en: "Intelligent Systems", ja: "インテリジェントシステム" },
            "interactive-interfaces": { en: "Interactive Interfaces", ja: "インタラクティブインターフェース" },
            "server-architectures": { en: "Server Architectures", ja: "サーバーアーキテクチャ" },
            "integrated-systems": { en: "Integrated Systems", ja: "統合システム" },
        } as Record<string, { en: string; ja: string }>,
        inspect: { en: "INSPECT", ja: "検査" },
        github: { en: "GITHUB", ja: "GITHUB" },
        live: { en: "LIVE", ja: "ライブ" },
    },

    /* ── Socials Page ── */
    socials: {
        connectTitle: { en: "CONNECT", ja: "コネクト" },
        connectSubtitle: { en: "Choose how you want to reach me.", ja: "連絡方法を選んでください。" },
        githubTitle: { en: "github", ja: "GitHub" },
        githubLines: [
            { en: "Open-source contributions", ja: "オープンソースの貢献" },
            { en: "Project repositories", ja: "プロジェクトリポジトリ" },
            { en: "Code experiments", ja: "コード実験" },
        ],
        githubCta: { en: "View Profile", ja: "プロフィールを見る" },
        storeTitle: { en: "CODE[STORE]", ja: "コード[ストア]" },
        storeLines: [
            { en: "Reusable code systems", ja: "再利用可能なコードシステム" },
            { en: "Animation templates", ja: "アニメーションテンプレート" },
            { en: "Production-ready patterns", ja: "本番対応パターン" },
        ],
        storeCta: { en: "Open Store", ja: "ストアを開く" },
        contactTitle: { en: "Direct Contact", ja: "直接連絡" },
        contactLines: [
            { en: "Project inquiry", ja: "プロジェクトの問い合わせ" },
            { en: "Freelance discussion", ja: "フリーランスの相談" },
            { en: "Collaboration kickoff", ja: "コラボレーション開始" },
        ],
        contactCta: { en: "Open Form", ja: "フォームを開く" },
        sendMessage: { en: "Send a Message", ja: "メッセージを送る" },
        formDesc: { en: "Tell me about your idea, scope, and timeline.", ja: "アイデア、範囲、スケジュールを教えてください。" },
        nameLabel: { en: "Name", ja: "名前" },
        emailLabel: { en: "Email", ja: "メール" },
        messageLabel: { en: "Message", ja: "メッセージ" },
        sending: { en: "Sending...", ja: "送信中..." },
        send: { en: "Send", ja: "送信" },
        messageSent: { en: "✓ Message Sent", ja: "✓ メッセージ送信完了" },
        closingCta: { en: "Let us build something with intent.", ja: "意図を持って何かを作りましょう。" },
    },

    /* ── Language Toggle ── */
    langToggle: {
        en: { en: "EN", ja: "EN" },
        ja: { en: "JA", ja: "JA" },
    },
} as const;

/** Helper to get a translated string */
export function t(entry: { en: string; ja: string }, lang: Lang): string {
    return entry[lang];
}
