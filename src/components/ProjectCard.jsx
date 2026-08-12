import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, GitFork, Users } from "lucide-react";
import GlassCard from "./GlassCard";
import Avatar from "./Avatar";
import Button from "./Button";
import { TechPill, RolePill } from "./Pill";
import { staggerItem } from "./PageTransition";

export default function ProjectCard({ project, onCollaborate }) {
  return (
    <GlassCard as={motion.div} variants={staggerItem} className="p-6 flex flex-col gap-4 group">
      <div className="flex items-center justify-between">
        <Link to={`/project/${project.id}`} className="flex items-center gap-3 min-w-0">
          <Avatar src={project.owner.avatar} online={project.owner.online} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{project.owner.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{project.owner.handle}</p>
          </div>
        </Link>
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 shrink-0">
          <span className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5" /> {project.stars}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <GitFork className="w-3.5 h-3.5" /> {project.forks}
          </span>
        </div>
      </div>

      <Link to={`/project/${project.id}`} className="block">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-snug mb-1.5 group-hover:text-gradient transition-all">
          {project.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{project.tagline}</p>
      </Link>

      <div className="flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((t) => (
          <TechPill key={t} label={t} />
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.rolesNeeded.map((r) => (
          <RolePill key={r} label={r} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-900/8 dark:border-white/8">
        <div className="flex items-center -space-x-2">
          {project.collaborators.slice(0, 3).map((c) => (
            <Avatar key={c.id} src={c.avatar} size="xs" className="ring-2 ring-[#f8f9fd] dark:ring-[#0f1117]" />
          ))}
          {project.collaborators.length > 0 && (
            <span className="ml-3 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Users className="w-3 h-3" /> {project.collaborators.length}
            </span>
          )}
        </div>
        <Button size="sm" onClick={() => onCollaborate?.(project)}>
          Collaborate
        </Button>
      </div>
    </GlassCard>
  );
}
