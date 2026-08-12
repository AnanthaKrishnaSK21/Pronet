import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { ProjectCardSkeleton } from "../components/Skeleton";
import CollaborateModal from "../components/CollaborateModal";
import PageTransition, { staggerContainer } from "../components/PageTransition";
import { Input } from "../components/Input";
import { projects } from "../data/mock";

const allTech = [...new Set(projects.flatMap((p) => p.tech))];

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTech, setActiveTech] = useState(null);
  const [modalProject, setModalProject] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.tagline.toLowerCase().includes(query.toLowerCase());
      const matchesTech = !activeTech || p.tech.includes(activeTech);
      return matchesQuery && matchesTech;
    });
  }, [query, activeTech]);

  return (
    <PageTransition className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Projects</h1>
        <p className="text-slate-600 dark:text-slate-400">Discover what developers are building and find your next collaboration.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
          <Input
            placeholder="Search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setActiveTech(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            !activeTech
              ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-700 dark:text-indigo-300"
              : "border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          All
        </motion.button>
        {allTech.map((t) => (
          <motion.button
            key={t}
            whileTap={{ scale: 0.94 }}
            onClick={() => setActiveTech(t === activeTech ? null : t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeTech === t
                ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-700 dark:text-indigo-300"
                : "border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {t}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-slate-500 dark:text-slate-400">No projects match your search.</div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onCollaborate={setModalProject} />
          ))}
        </motion.div>
      )}

      <CollaborateModal project={modalProject} open={!!modalProject} onClose={() => setModalProject(null)} />
    </PageTransition>
  );
}
