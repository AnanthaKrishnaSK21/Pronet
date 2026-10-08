import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Heart, GitFork, Users } from "lucide-react";
import GlassCard from "./GlassCard";
import Avatar from "./Avatar";
import Button from "./Button";
import { TechPill, RolePill } from "./Pill";
import { staggerItem } from "./PageTransition";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";

export default function ProjectCard({ project: initialProject, onCollaborate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [project, setProject] = useState(initialProject);
  const [forking, setForking] = useState(false);

  if (!project) return null;

  const currentUsername = user?.user_name;
  const projectOwnerUsername = project.owner?.user_name;
  const isOwnProject = currentUsername && projectOwnerUsername && currentUsername === projectOwnerUsername;

  const likedByUsers = Array.isArray(project.liked_by_users) ? project.liked_by_users : [];
  const isLiked = currentUsername && likedByUsers.includes(currentUsername);

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

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUsername) { showToast("Log in to like projects", "error"); return; }

    const wasLiked = isLiked;
    // Optimistic update
    setProject((p) => ({
      ...p,
      stars: wasLiked ? Math.max(0, (p.stars ?? 0) - 1) : (p.stars ?? 0) + 1,
      liked_by_users: wasLiked
        ? (p.liked_by_users || []).filter((u) => u !== currentUsername)
        : [...(p.liked_by_users || []), currentUsername],
    }));

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${project.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: currentUsername }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure
      setProject((p) => ({
        ...p,
        stars: wasLiked ? (p.stars ?? 0) + 1 : Math.max(0, (p.stars ?? 0) - 1),
        liked_by_users: wasLiked
          ? [...(p.liked_by_users || []), currentUsername]
          : (p.liked_by_users || []).filter((u) => u !== currentUsername),
      }));
      showToast("Failed to update like", "error");
    }
  };

  const handleFork = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUsername) { showToast("Log in to fork projects", "error"); return; }
    if (isOwnProject) { showToast("You cannot fork your own project", "error"); return; }
    setForking(true);
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${project.id}/fork`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: currentUsername }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Fork failed", "error");
      } else {
        setProject((p) => ({ ...p, forks: (p.forks ?? 0) + 1 }));
        showToast("Project forked! Check your profile.", "success");
        setTimeout(() => navigate(`/project/${data.id}`), 1200);
      }
    } catch {
      showToast("Fork failed", "error");
    } finally {
      setForking(false);
    }
  };

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
        <div className="flex items-center gap-2 shrink-0">
          {/* Like button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
              isLiked
                ? "text-rose-500 bg-rose-500/10 border border-rose-500/25"
                : "text-slate-500 dark:text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
            }`}
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500" : ""}`} />
            {project.stars ?? 0}
          </motion.button>

          {/* Fork button */}
          {!isOwnProject && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleFork}
              disabled={forking}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors disabled:opacity-50"
              title="Fork project"
            >
              <GitFork className="w-3.5 h-3.5" />
              {project.forks ?? 0}
            </motion.button>
          )}

          {isOwnProject && (
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <GitFork className="w-3.5 h-3.5" /> {project.forks ?? 0}
            </span>
          )}
        </div>
      </div>

      <Link to={`/project/${project.id}`} className="block">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-snug mb-1.5 group-hover:text-gradient transition-all">
          {project.title}
        </h3>
        {project.forked_from && (
          <p className="text-xs text-indigo-400 mb-1 flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            Forked from <span className="font-medium">{project.forked_from.title}</span>
            {" "}by @{project.forked_from.owner_username}
          </p>
        )}
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
