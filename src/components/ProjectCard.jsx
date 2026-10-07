import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, GitFork, Users } from "lucide-react";
import GlassCard from "./GlassCard";
import Avatar from "./Avatar";
import Button from "./Button";
import { TechPill, RolePill } from "./Pill";
import { staggerItem } from "./PageTransition";
import { useAuth } from "../context/AuthContext";

export default function ProjectCard({ project, onCollaborate }) {
  const { user } = useAuth();
  if (!project) return null;

  const currentUsername = user?.user_name;
  const projectOwnerUsername = project.owner?.user_name;
  const isOwnProject = currentUsername && projectOwnerUsername && currentUsername === projectOwnerUsername;

  const collabs = Array.isArray(project.collaborators) ? project.collaborators : [];
  const isCollaborator = currentUsername && collabs.some(
    (c) => (c.user_name && c.user_name === currentUsername) || (c.name && c.name === currentUsername)
  );

  const ownerName = project.owner?.name || project.owner?.user_name || "Developer";
  const ownerHandle = project.owner?.handle || (project.owner?.user_name ? `@${project.owner.user_name}` : "@developer");
  const ownerAvatar = project.owner?.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${ownerName}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  const roles = Array.isArray(project.roles_needed)
    ? project.roles_needed
    : (Array.isArray(project.rolesNeeded) ? project.rolesNeeded : []);
  const techList = Array.isArray(project.tech) ? project.tech : [];

  return (
    <GlassCard as={motion.div} variants={staggerItem} className="p-6 flex flex-col gap-4 group">
      <div className="flex items-center justify-between">
        <Link to={`/project/${project.id}`} className="flex items-center gap-3 min-w-0">
          <Avatar src={ownerAvatar} online size="md" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{ownerName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{ownerHandle}</p>
          </div>
        </Link>
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 shrink-0">
          <span className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5" /> {project.stars ?? 0}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <GitFork className="w-3.5 h-3.5" /> {project.forks ?? 0}
          </span>
        </div>
      </div>

      <Link to={`/project/${project.id}`} className="block">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-snug mb-1.5 group-hover:text-gradient transition-all">
          {project.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{project.tagline}</p>
      </Link>

      {techList.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {techList.slice(0, 4).map((t) => (
            <TechPill key={t} label={t} />
          ))}
        </div>
      )}

      {roles.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {roles.map((r) => (
            <RolePill key={r} label={r} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-900/8 dark:border-white/8">
        <div className="flex items-center -space-x-2">
          {collabs.slice(0, 3).map((c) => (
            <Avatar
              key={c.id || c.user_name}
              src={c.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${c.user_name || 'collab'}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
              size="xs"
              className="ring-2 ring-[#f8f9fd] dark:ring-[#0f1117]"
            />
          ))}
          {collabs.length > 0 && (
            <span className="ml-3 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Users className="w-3 h-3" /> {collabs.length}
            </span>
          )}
        </div>
        {isOwnProject ? (
          <span className="text-xs px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
            Your Project
          </span>
        ) : isCollaborator ? (
          <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            Collaborator
          </span>
        ) : (
          <Button size="sm" onClick={() => onCollaborate?.(project)}>
            Collaborate
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
