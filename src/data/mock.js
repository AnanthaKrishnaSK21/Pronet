const AV = (seed) => `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

export const currentUser = {
  id: "u1",
  name: "Aarav Kapoor",
  handle: "@aaravk",
  avatar: AV("aarav"),
  online: true,
  title: "Full-Stack Developer · DBMS Enthusiast",
  bio: "Building developer tools by day, breaking them by night. Into distributed systems, Postgres internals, and clean UI.",
  location: "Bengaluru, India",
  skills: ["React", "Node.js", "PostgreSQL", "Python", "Docker", "System Design", "TypeScript", "GraphQL"],
  stats: { projects: 12, connections: 348, contributions: 1204, requestsAccepted: 27 },
  github: "aaravk",
};

export const users = [
  currentUser,
  { id: "u2", name: "Meera Iyer", handle: "@meerai", avatar: AV("meera"), online: true, title: "ML Engineer" },
  { id: "u3", name: "Rohan Verma", handle: "@rohanv", avatar: AV("rohan"), online: false, title: "Backend Engineer" },
  { id: "u4", name: "Sara Chen", handle: "@sarac", avatar: AV("sara"), online: true, title: "Product Designer" },
  { id: "u5", name: "Devika Nair", handle: "@devikan", avatar: AV("devika"), online: false, title: "Mobile Developer" },
  { id: "u6", name: "Kabir Malhotra", handle: "@kabirm", avatar: AV("kabir"), online: true, title: "DevOps Engineer" },
  { id: "u7", name: "Ishaan Rao", handle: "@ishaanr", avatar: AV("ishaan"), online: false, title: "Frontend Engineer" },
  { id: "u8", name: "Ananya Gupta", handle: "@ananyag", avatar: AV("ananya"), online: true, title: "Data Scientist" },
];

export const techColors = {
  React: "from-cyan-400/20 to-cyan-400/5 text-cyan-700 dark:text-cyan-300 border-cyan-400/30",
  "Node.js": "from-emerald-400/20 to-emerald-400/5 text-emerald-700 dark:text-emerald-300 border-emerald-400/30",
  PostgreSQL: "from-blue-400/20 to-blue-400/5 text-blue-700 dark:text-blue-300 border-blue-400/30",
  Python: "from-yellow-400/20 to-yellow-400/5 text-yellow-700 dark:text-yellow-300 border-yellow-400/30",
  Docker: "from-sky-400/20 to-sky-400/5 text-sky-700 dark:text-sky-300 border-sky-400/30",
  TypeScript: "from-indigo-400/20 to-indigo-400/5 text-indigo-700 dark:text-indigo-300 border-indigo-400/30",
  GraphQL: "from-pink-400/20 to-pink-400/5 text-pink-700 dark:text-pink-300 border-pink-400/30",
  "System Design": "from-violet-400/20 to-violet-400/5 text-violet-700 dark:text-violet-300 border-violet-400/30",
  "Next.js": "from-slate-300/20 to-slate-300/5 text-slate-700 dark:text-slate-300 border-slate-300/30",
  TailwindCSS: "from-teal-400/20 to-teal-400/5 text-teal-700 dark:text-teal-300 border-teal-400/30",
  Redis: "from-red-400/20 to-red-400/5 text-red-700 dark:text-red-300 border-red-400/30",
  "Vue.js": "from-green-400/20 to-green-400/5 text-green-700 dark:text-green-300 border-green-400/30",
  Rust: "from-orange-400/20 to-orange-400/5 text-orange-700 dark:text-orange-300 border-orange-400/30",
  Kubernetes: "from-blue-500/20 to-blue-500/5 text-blue-700 dark:text-blue-300 border-blue-500/30",
  default: "from-fuchsia-400/20 to-fuchsia-400/5 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-400/30",
};

export const projects = [
  {
    id: "p1",
    title: "PulseDB — Realtime Analytics Engine",
    tagline: "A blazing-fast realtime analytics DB built on top of Postgres logical replication.",
    description:
      "PulseDB streams row-level changes from Postgres into a columnar cache for sub-second analytics dashboards. Looking for people who love query planners, WAL internals, and building rock-solid infra. Currently has a working ingestion pipeline and a basic query API — needs a front-end dashboard and more ingestion connectors.",
    owner: users[0],
    tech: ["PostgreSQL", "Rust", "Redis", "Docker"],
    rolesNeeded: ["Frontend Dev", "DevOps"],
    stars: 214,
    forks: 38,
    collaborators: [users[1], users[2], users[5]],
    github: "https://github.com/aaravk/pulsedb",
    comments: [
      { id: "c1", user: users[1], text: "Love the ingestion architecture — happy to help with the Grafana-style dashboard.", time: "2h ago" },
      { id: "c2", user: users[3], text: "Is the query API REST or gRPC?", time: "5h ago" },
    ],
    createdAt: "2026-07-28",
  },
  {
    id: "p2",
    title: "CampusConnect",
    tagline: "A LinkedIn-for-students platform to find hackathon teammates on campus.",
    description:
      "CampusConnect helps university students discover teammates by skill and interest for hackathons, side projects, and study groups. MVP has auth, profile, and matching algorithm done. We need help with the chat feature and mobile responsiveness.",
    owner: users[3],
    tech: ["React", "Node.js", "GraphQL", "TailwindCSS"],
    rolesNeeded: ["Mobile Dev", "Backend Dev"],
    stars: 96,
    forks: 21,
    collaborators: [users[4], users[6]],
    github: "https://github.com/sarac/campusconnect",
    comments: [
      { id: "c3", user: users[0], text: "This is exactly what our college needs, great idea!", time: "1d ago" },
    ],
    createdAt: "2026-07-20",
  },
  {
    id: "p3",
    title: "ShelfSense",
    tagline: "Computer-vision powered inventory tracking for small retail stores.",
    description:
      "ShelfSense uses a lightweight CV model to detect stock levels from shelf photos and auto-generates restock alerts. Backend and model pipeline are done; we need a polished merchant dashboard and onboarding flow.",
    owner: users[7],
    tech: ["Python", "React", "Docker", "PostgreSQL"],
    rolesNeeded: ["Frontend Dev", "UI/UX Designer"],
    stars: 152,
    forks: 30,
    collaborators: [users[0], users[3]],
    github: "https://github.com/ananyag/shelfsense",
    comments: [],
    createdAt: "2026-08-01",
  },
  {
    id: "p4",
    title: "Nimbus CLI",
    tagline: "A delightfully fast, plugin-based CLI for managing multi-cloud infra.",
    description:
      "Nimbus wraps AWS/GCP/Azure CLIs behind one unified plugin architecture with a TUI. Core plugin loader and AWS support are stable. Looking for folks to build GCP/Azure plugins and improve the TUI.",
    owner: users[5],
    tech: ["Rust", "Kubernetes", "Docker"],
    rolesNeeded: ["Systems Engineer"],
    stars: 341,
    forks: 64,
    collaborators: [users[2]],
    github: "https://github.com/kabirm/nimbus-cli",
    comments: [
      { id: "c4", user: users[6], text: "Been waiting for something like this, subscribed!", time: "3d ago" },
    ],
    createdAt: "2026-07-10",
  },
  {
    id: "p5",
    title: "EchoNotes",
    tagline: "Voice-first note-taking app with on-device transcription and semantic search.",
    description:
      "EchoNotes transcribes voice memos on-device using Whisper.cpp and lets you semantically search past notes. iOS app is in beta. We need an Android build and a web companion app.",
    owner: users[4],
    tech: ["TypeScript", "Next.js", "TailwindCSS"],
    rolesNeeded: ["Mobile Dev", "Frontend Dev"],
    stars: 88,
    forks: 12,
    collaborators: [users[1]],
    github: "https://github.com/devikan/echonotes",
    comments: [],
    createdAt: "2026-08-05",
  },
  {
    id: "p6",
    title: "GraphForge",
    tagline: "Visual query builder for GraphQL APIs with live schema introspection.",
    description:
      "GraphForge lets you drag-and-drop build GraphQL queries against any schema, with live validation and codegen for React hooks. Core builder UI works; we need help with the codegen module and docs site.",
    owner: users[1],
    tech: ["React", "GraphQL", "TypeScript", "Node.js"],
    rolesNeeded: ["Backend Dev", "Technical Writer"],
    stars: 176,
    forks: 45,
    collaborators: [users[0], users[7], users[3]],
    github: "https://github.com/meerai/graphforge",
    comments: [
      { id: "c5", user: users[5], text: "The introspection speed is impressive, great work.", time: "6h ago" },
    ],
    createdAt: "2026-07-15",
  },
];

export const collabRequests = [
  {
    id: "r1",
    user: users[2],
    project: projects[0],
    message: "I've worked extensively with Postgres WAL and logical decoding — would love to help build the connectors.",
    time: "10m ago",
  },
  {
    id: "r2",
    user: users[6],
    project: projects[0],
    message: "I'm a frontend dev with dashboard experience (built 3 Grafana plugins). Can jump in on the UI.",
    time: "1h ago",
  },
  {
    id: "r3",
    user: users[4],
    project: projects[5],
    message: "I write technical docs for a living. Happy to help document GraphForge's codegen module.",
    time: "3h ago",
  },
  {
    id: "r4",
    user: users[7],
    project: projects[0],
    message: "DevOps here — I can help containerize the ingestion pipeline and set up CI.",
    time: "1d ago",
  },
];

export const connections = users.slice(1);

export const skillSuggestions = [
  "React", "Node.js", "PostgreSQL", "Python", "Docker", "TypeScript", "GraphQL",
  "Next.js", "TailwindCSS", "Redis", "Vue.js", "Rust", "Kubernetes", "MongoDB",
  "System Design", "Go", "Swift", "Kotlin", "AWS", "Firebase",
];
