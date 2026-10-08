import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, GitFork, Code2, ArrowLeft, Send, ExternalLink, Users } from "lucide-react";
import GlassCard from "../components/GlassCard";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import { TechPill, RolePill } from "../components/Pill";
import { Input } from "../components/Input";
import CollaborateModal from "../components/CollaborateModal";
import PageTransition, { staggerContainer, staggerItem } from "../components/PageTransition";
import { projects as mockProjects } from "../data/mock";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const showToast = useToast();
  const fallbackProject = mockProjects.find((p) => p.id === id) ?? mockProjects[0];
  const [project, setProject] = useState(fallbackProject);
  const [modalOpen, setModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(fallbackProject.comments || []);
  const [forking, setForking] = useState(false);

  const currentUsername = user?.user_name;

  useEffect(() => {
    fetch(`http://localhost:5000/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (data && data.title) {
          setProject(data);
          if (Array.isArray(data.comments)) {
            setComments(data.comments);
          }
        }
      })
      .catch(() => {});
  }, [id]);

  const likedByUsers = Array.isArray(project.liked_by_users) ? project.liked_by_users : [];
  const isLiked = currentUsername && likedByUsers.includes(currentUsername);
  const isOwnProject = currentUsername && project.owner?.user_name && currentUsername === project.owner.user_name;

  const handleLike = async () => {
    if (!currentUsername) { showToast("Log in to like projects", "error"); return; }
    const wasLiked = isLiked;
    setProject((p) => ({
      ...p,
      stars: wasLiked ? Math.max(0, (p.stars ?? 0) - 1) : (p.stars ?? 0) + 1,
      liked_by_users: wasLiked
        ? (p.liked_by_users || []).filter((u) => u !== currentUsername)
        : [...(p.liked_by_users || []), currentUsername],
    }));
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: currentUsername }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert
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

  const handleFork = async () => {
    if (!currentUsername) { showToast("Log in to fork projects", "error"); return; }
    if (isOwnProject) { showToast("You cannot fork your own project", "error"); return; }
    setForking(true);
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/fork`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: currentUsername }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Fork failed", "error");
      } else {
        setProject((p) => ({ ...p, forks: (p.forks ?? 0) + 1 }));
        showToast("Project forked successfully! Redirecting…", "success");
        setTimeout(() => navigate(`/project/${data.id}`), 1500);
      }
    } catch {
      showToast("Fork failed", "error");
    } finally {
      setForking(false);
    }
  };

  const postComment = async () => {
    if (!comment.trim()) return;
    const commentText = comment.trim();
    const activeUsername = currentUsername || "aaravk";
    setComment("");
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: activeUsername, text: commentText }),
      });
      if (res.ok) {
        const savedComment = await res.json();
        setComments((c) => [...c, savedComment]);
      } else {
        setComments((c) => [...c, {
          id: Date.now(), user: { name: activeUsername, user_name: activeUsername,
            avatar: user?.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${activeUsername}&backgroundColor=b6e3f4,c0aede,d1d4f9` },
          text: commentText, time: "Just now"
        }]);
      }
    } catch {
      setComments((c) => [...c, {
        id: Date.now(), user: { name: activeUsername, user_name: activeUsername,
          avatar: user?.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${activeUsername}&backgroundColor=b6e3f4,c0aede,d1d4f9` },
        text: commentText, time: "Just now"
      }]);
    }
  };

  const userAvatar = user?.avatar ||
    (user?.user_name ? `https://api.dicebear.com/9.x/notionists/svg?seed=${user.user_name}&backgroundColor=b6e3f4,c0aede,d1d4f9`
      : `https://api.dicebear.com/9.x/notionists/svg?seed=user&backgroundColor=b6e3f4,c0aede,d1d4f9`);

  const ownerName = project.owner?.user_name || project.owner?.name || "Developer";
  const ownerAvatar = project.owner?.avatar ||
    `https://api.dicebear.com/9.x/notionists/svg?seed=${ownerName}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  const ownerTitle = project.owner?.title || "Full-Stack Developer";
  const techList = Array.isArray(project.tech) ? project.tech : [];
  const roles = Array.isArray(project.roles_needed) ? project.roles_needed
    : Array.isArray(project.rolesNeeded) ? project.rolesNeeded : [];
  const collabs = Array.isArray(project.collaborators) ? project.collaborators : [];
  const githubLink = project.github || "https://github.com/pronet";

  return (
    <PageTransition className="max-w-5xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid lg:grid-cols-[1fr_320px] gap-6"
      >
        <div className="space-y-6">
          <GlassCard variants={staggerItem} className="p-7 sm:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h1>
                {project.forked_from && (
                  <Link
                    to={`/project/${project.forked_from.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mb-2 transition-colors"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    Forked from <span className="font-semibold">{project.forked_from.title}</span>
                    &nbsp;by @{project.forked_from.owner_username}
                  </Link>
                )}
                <p className="text-slate-600 dark:text-slate-400">{project.tagline}</p>
              </div>

              {/* Like & Fork buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                    isLiked
                      ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                      : "bg-slate-900/5 dark:bg-white/5 border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-400" : ""}`} />
                  <span>{project.stars ?? 0}</span>
                </motion.button>

                {!isOwnProject && (
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handleFork}
                    disabled={forking}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border bg-slate-900/5 dark:bg-white/5 border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all disabled:opacity-50"
                  >
                    <GitFork className="w-4 h-4" />
                    <span>{forking ? "Forking…" : (project.forks ?? 0)}</span>
                  </motion.button>
                )}

                {isOwnProject && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 px-3 py-2">
                    <GitFork className="w-4 h-4" /> {project.forks ?? 0}
                  </span>
                )}
              </div>
            </div>

            <Link
              to={githubLink}
              onClick={(e) => {
                if (githubLink.startsWith("http")) window.open(githubLink, "_blank");
                else e.preventDefault();
              }}
              className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-black/30 border border-white/10 mb-6 group hover:border-indigo-400/40 transition-colors"
            >
              <span className="flex items-center gap-2.5 text-sm text-slate-300 truncate">
                <Code2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{githubLink.replace("https://", "")}</span>
              </span>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-300 transition-colors shrink-0" />
            </Link>

            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">About this project</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{project.description}</p>

            {techList.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {techList.map((t) => <TechPill key={t} label={t} />)}
                </div>
              </>
            )}

            {roles.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Roles Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => <RolePill key={r} label={r} />)}
                </div>
              </>
            )}
          </GlassCard>

          {/* Discussion */}
          <GlassCard variants={staggerItem} className="p-7 sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
              Discussion <span className="text-slate-500 dark:text-slate-400 font-normal">({comments.length})</span>
            </h3>

            <div className="flex gap-3 mb-6">
              <Avatar src={userAvatar} size="sm" />
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && postComment()}
                  className="flex-1"
                />
                <Button size="icon" onClick={postComment}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              {comments.map((c) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <Avatar
                    src={c.user?.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${c.user?.name || 'user'}`}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {c.user?.name || c.user?.user_name || "Developer"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{c.time || "Recently"}</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{c.text}</p>
                  </div>
                </motion.div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
                  No comments yet. Start the discussion!
                </p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <GlassCard variants={staggerItem} className="p-6 sticky top-24">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Owned by</p>
            <Link to="/profile" className="flex items-center gap-3 mb-5 group">
              <Avatar src={ownerAvatar} online size="lg" ring />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white group-hover:text-gradient transition-all truncate">
                  {ownerName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{ownerTitle}</p>
              </div>
            </Link>
            {isOwnProject ? (
              <div className="w-full py-2.5 text-center text-sm font-medium rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                You own this project
              </div>
            ) : currentUsername && collabs.some((c) => (c.user_name && c.user_name === currentUsername) || (c.name && c.name === currentUsername)) ? (
              <div className="w-full py-2.5 text-center text-sm font-medium rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                You are a collaborator
              </div>
            ) : (
              <Button className="w-full" onClick={() => setModalOpen(true)}>
                Request to Collaborate
              </Button>
            )}
          </GlassCard>

          {/* Collaborators */}
          <GlassCard variants={staggerItem} className="p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
              Collaborators ({collabs.length})
            </p>
            <div className="space-y-3">
              {collabs.map((c) => (
                <div key={c.id || c.user_name} className="flex items-center gap-3">
                  <Avatar
                    src={c.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${c.user_name || 'user'}`}
                    online size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-800 dark:text-slate-100 truncate">{c.user_name || c.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.title || "Contributor"}</p>
                  </div>
                </div>
              ))}
              {collabs.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">No collaborators yet.</p>
              )}
            </div>
          </GlassCard>
        </div>
      </motion.div>

      <CollaborateModal project={project} open={modalOpen} onClose={() => setModalOpen(false)} />
    </PageTransition>
  );
}
