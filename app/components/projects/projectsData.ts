export interface Project {
    id: number;
    title: string;
    category: string;
    tech: string[];
    description: string;
    architecture?: string[];
    github?: string;
    live?: string;
}

export const projects: Project[] = [

    // ── Intelligent Systems ──

    {
        id: 1,
        title: "Sign Language Recognition",
        category: "intelligent-systems",
        tech: ["Python", "TensorFlow", "MediaPipe", "OpenCV", "LSTM"],
        description:
            "A deep learning based sign language recognition system using LSTM networks and MediaPipe Holistic tracking. The system captures hand and body landmarks and classifies gestures in real-time using sequence-based neural networks.",
        architecture: ["MediaPipe Holistic", "Landmark Extraction", "LSTM Model", "Gesture Prediction"],
        github: "https://github.com/arjun1127/SLR-deep-learning.git",
    },

    {
        id: 2,
        title: "Drug Repurposing using Graph Neural Networks",
        category: "intelligent-systems",
        tech: ["Python", "PyTorch", "Graph Neural Networks", "AutoDock Vina"],
        description:
            "A Graph Neural Network system built on the PrimeKG biomedical knowledge graph to identify potential drug repurposing candidates. Predictions are validated using molecular docking simulations with AutoDock Vina.",
        architecture: ["PrimeKG Graph", "GNN Model", "Prediction Engine", "Docking Validation"],
        github: "https://github.com/arjun1127/drug_repurpose.git",
    },

    {
        id: 3,
        title: "HEALTHIER – AI Lifestyle Assistant",
        category: "intelligent-systems",
        tech: ["React", "Node.js", "Gemini", "Hugging Face", "Computer Vision"],
        description:
            "A personal AI health assistant that analyzes images, text inputs, and daily activity to generate insights about food, expenses, sleep, productivity, and health patterns. Integrates vision models, LLMs, and machine learning to deliver personalized recommendations.",
        architecture: ["React Frontend", "Node API Gateway", "AI Services", "Data Analytics"],
        github: "https://github.com/arjun1127/HEALTHIER.git",
    },


    // ── Interactive Interfaces ──

    {
        id: 4,
        title: "FutureMart – 3D Animated Web Experience",
        category: "interactive-interfaces",
        tech: ["Three.js", "React", "Tailwind", "JavaScript"],
        description:
            "A futuristic 3D animated shopping experience built with Three.js and React. The site integrates animated 3D models with modern UI design and advanced Tailwind-based motion interactions.",
        architecture: ["React UI", "Three.js Scene", "Animation Engine", "Tailwind Motion"],
        github: "https://github.com/arjun1127/FutureMart.git",
    },

    {
        id: 5,
        title: "Metaball Physics Landing Page",
        category: "interactive-interfaces",
        tech: ["Three.js", "GSAP", "GLSL", "Shaders"],
        description:
            "A visually experimental landing page exploring metaball physics and fluid dynamics using custom GLSL shaders. GSAP is used to orchestrate animation timing and visual transitions.",
        architecture: ["Three.js Renderer", "GLSL Shaders", "Metaball Simulation", "GSAP Animation"],
        live: "https://code-store-1.onrender.com/tutorials/threeGsap",
    },

    {
        id: 6,
        title: "3D Scroll Animation Experience",
        category: "interactive-interfaces",
        tech: ["Three.js", "GSAP", "ScrollTrigger", "GLSL"],
        description:
            "A 3D scroll-driven animation system where objects move and transform based on user scroll position. Built using Three.js and GSAP ScrollTrigger to synchronize camera and scene transitions.",
        architecture: ["Three.js Scene", "ScrollTrigger Controller", "Camera Animation", "Shader Effects"],
        live: "https://code-store-1.onrender.com/tutorials/3D%20Scroll",
    },


    // ── Server Architectures ──

    {
        id: 7,
        title: "CPU-Aware Node.js Load Balancer",
        category: "server-architectures",
        tech: ["Node.js", "JavaScript"],
        description:
            "A custom Node.js load balancer that intelligently distributes incoming requests across backend servers based on real-time CPU usage. Includes a live dashboard displaying request logs, response times, and system metrics.",
        architecture: ["Request Router", "CPU Monitor", "Backend Pool", "Metrics Dashboard"],
        github: "https://github.com/arjun1127/Load-balancer-js",
    },


    // ── Integrated Systems ──

    {
        id: 8,
        title: "CODE[STORE] – 3D Code Marketplace",
        category: "integrated-systems",
        tech: ["React", "Three.js", "GSAP", "Node.js"],
        description:
            "A personal developer platform designed to sell advanced Three.js and GSAP-based web animation systems. Includes tutorials, reusable code snippets, and interactive landing page components.",
        architecture: ["React Frontend", "Code Library", "Tutorial Pages", "Animation Systems"],
        live: "https://code-store-1.onrender.com/",
    },

    {
        id: 9,
        title: "Kanji Kousa – AI Assisted Kanji Learning Platform",
        category: "integrated-systems",
        tech: ["React", "AI Chat", "Quiz Engine", "Flashcards"],
        description:
            "A full-featured kanji learning platform that combines flashcards, quizzes, AI chat assistance, and learning analytics to help users master JLPT kanji effectively.",
        architecture: ["React Frontend", "AI Tutor", "Quiz Engine", "User Analytics"],
        live: "https://kanji-kousa-1.onrender.com/",
    },

    {
        id: 10,
        title: "Appoint Vaidhya – Hospital Appointment System",
        category: "integrated-systems",
        tech: ["Next.js", "Tailwind", "Appwrite"],
        description:
            "A modern healthcare appointment booking platform where patients can schedule doctor visits while hospital administrators manage bookings, approvals, and rescheduling.",
        architecture: ["Next.js Frontend", "Appwrite Backend", "Appointment Manager", "Admin Panel"],
        live: "https://hospital-online-appointment.vercel.app/",
    },
];

export const categories = [
    { id: "intelligent-systems", label: "Intelligent Systems" },
    { id: "interactive-interfaces", label: "Interactive Interfaces" },
    { id: "server-architectures", label: "Server Architectures" },
    { id: "integrated-systems", label: "Integrated Systems" },
];