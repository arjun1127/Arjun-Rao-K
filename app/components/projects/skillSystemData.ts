export interface SkillCluster {
    id: string;
    label: string;
    color: number;
}

export interface SkillNode {
    id: string;
    label: string;
    clusterId: string;
    position: [number, number, number];
}

export const skillClusters: SkillCluster[] = [
    { id: "languages", label: "Languages", color: 0x6f8dff },
    { id: "frontend", label: "Frontend", color: 0x5470eb },
    { id: "backend", label: "Backend", color: 0x4d8dff },
    { id: "ai", label: "AI", color: 0x3f74de },
    { id: "infrastructure", label: "Infrastructure", color: 0x4d70cf },
];

export const skillNodes: SkillNode[] = [
    // Languages
    { id: "javascript", label: "JavaScript", clusterId: "languages", position: [-2.8, 1.8, -0.2] },
    { id: "python", label: "Python", clusterId: "languages", position: [-3.2, 1.0, 0.3] },
    { id: "java", label: "Java", clusterId: "languages", position: [-2.4, 0.5, -0.3] },

    // Frontend
    { id: "react", label: "React", clusterId: "frontend", position: [-0.8, 2.1, 0.3] },
    { id: "threejs", label: "Three.js", clusterId: "frontend", position: [-0.1, 1.5, -0.3] },
    { id: "gsap", label: "GSAP", clusterId: "frontend", position: [-1.2, 1.2, 0.6] },
    { id: "tailwind", label: "Tailwind", clusterId: "frontend", position: [0.1, 0.9, 0.1] },

    // Backend
    { id: "nodejs", label: "Node.js", clusterId: "backend", position: [1.2, 1.9, 0.2] },
    { id: "express", label: "Express", clusterId: "backend", position: [2.1, 1.4, -0.2] },
    { id: "MongoDB", label: "MongoDB", clusterId: "backend", position: [1.5, 0.9, 0.5] },

    // AI
    { id: "tensorflow", label: "TensorFlow", clusterId: "ai", position: [-2.2, -1.1, 0.2] },
    { id: "keras", label: "Keras", clusterId: "ai", position: [-1.4, -1.4, -0.3] },
    { id: "lstm", label: "LSTM", clusterId: "ai", position: [-2.4, -1.9, 0.4] },

    // Infrastructure
    { id: "aws", label: "AWS", clusterId: "infrastructure", position: [1.6, -0.8, -0.2] },
    { id: "docker", label: "Docker", clusterId: "infrastructure", position: [2.4, -1.2, 0.4] },
    { id: "git", label: "Git", clusterId: "infrastructure", position: [1.8, -1.9, -0.1] },
];

export const skillConnections: Array<[string, string]> = [
    ["javascript", "react"],
    ["javascript", "nodejs"],
    ["python", "tensorflow"],
    ["python", "keras"],
    ["react", "threejs"],
    ["react", "gsap"],
    ["threejs", "gsap"],
    ["tailwind", "react"],
    ["nodejs", "express"],
    ["nodejs", "MongoDB"],
    ["tensorflow", "keras"],
    ["keras", "lstm"],
    ["aws", "docker"],
    ["docker", "git"],
    ["nodejs", "docker"],
    ["MongoDB", "aws"],
];

const skillAliases: Record<string, string[]> = {
    javascript: ["Node.js", "React", "Next.js", "GSAP", "Anime.js", "Express", "WebSocket"],
    python: ["Python", "FastAPI", "PyTorch", "LangChain", "OpenAI", "HuggingFace"],
    java: ["Java"],
    react: ["React"],
    threejs: ["Three.js", "WebGL"],
    gsap: ["GSAP"],
    tailwind: ["Tailwind", "TailwindCSS"],
    nodejs: ["Node.js"],
    express: ["Express"],
    MongoDB: ["MongoDB"],
    tensorflow: ["TensorFlow"],
    keras: ["Keras", "TensorFlow"],
    lstm: ["LSTM"],
    aws: ["AWS"],
    docker: ["Docker"],
    git: ["Git"],
};

const labelBySkill = new Map(skillNodes.map((node) => [node.id, node.label]));

function normalize(value: string): string {
    return value.trim().toLowerCase();
}

export function getSkillLabel(skillId: string): string {
    return labelBySkill.get(skillId) ?? skillId;
}

export function projectMatchesSkill(projectTech: string[], skillId: string | null): boolean {
    if (!skillId) return true;

    const aliases = (skillAliases[skillId] ?? [getSkillLabel(skillId)]).map(normalize);
    const normalizedTech = projectTech.map(normalize);

    return aliases.some((alias) => normalizedTech.includes(alias));
}
