import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, GitFork, Code2, ArrowLeft, Send, ExternalLink } from "lucide-react";
import GlassCard from "../components/GlassCard";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import { TechPill, RolePill } from "../components/Pill";
import { Input } from "../components/Input";
import CollaborateModal from "../components/CollaborateModal";
import PageTransition, { staggerContainer, staggerItem } from "../components/PageTransition";
import { projects } from "../data/mock";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id) ?? projects[0];
  const [modalOpen, setModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(project.comments);

  const postComment = () => {
    if (!comment.trim()) return;
    setComments((c) => [
      { id: Date.now(), user: projects[0].owner, text: comment, time: "just now" },
      ...c,
    ]);
    setComment("");
  };

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
                <p className="text-slate-600 dark:text-slate-400">{project.tagline}</p>
              </div>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 shrink-0">
                <span className="flex items-center gap-1.5 text-sm">
                  <Star className="w-4 h-4" /> {project.stars}
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <GitFork className="w-4 h-4" /> {project.forks}
                </span>
              </div>
            </div>

            <Link
              to={project.github}
              onClick={(e) => e.preventDefault()}
              className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-black/30 border border-white/10 mb-6 group hover:border-indigo-400/40 transition-colors"
            >
              <span className="flex items-center gap-2.5 text-sm text-slate-300 truncate">
                <Code2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{project.github.replace("https://", "")}</span>
              </span>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-300 transition-colors shrink-0" />
            </Link>

            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">About this project</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{project.description}</p>

            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>

            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Roles Needed</h3>
            <div className="flex flex-wrap gap-2">
              {project.rolesNeeded.map((r) => (
                <RolePill key={r} label={r} />
              ))}
            </div>
          </GlassCard>

          <GlassCard variants={staggerItem} className="p-7 sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
              Discussion <span className="text-slate-500 dark:text-slate-400 font-normal">({comments.length})</span>
            </h3>

            <div className="flex gap-3 mb-6">
              <Avatar src={project.owner.avatar} size="sm" />
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
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <Avatar src={c.user.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{c.user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{c.time}</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{c.text}</p>
                  </div>
                </motion.div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No comments yet. Start the discussion!</p>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard variants={staggerItem} className="p-6 sticky top-24">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Owned by</p>
            <Link to="/profile" className="flex items-center gap-3 mb-5 group">
              <Avatar src={project.owner.avatar} online={project.owner.online} size="lg" ring />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white group-hover:text-gradient transition-all truncate">
                  {project.owner.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{project.owner.title}</p>
              </div>
            </Link>
            <Button className="w-full" onClick={() => setModalOpen(true)}>
              Request to Collaborate
            </Button>
          </GlassCard>

          <GlassCard variants={staggerItem} className="p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
              Collaborators ({project.collaborators.length})
            </p>
            <div className="space-y-3">
              {project.collaborators.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <Avatar src={c.avatar} online={c.online} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-800 dark:text-slate-100 truncate">{c.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.title}</p>
                  </div>
                </div>
              ))}
              {project.collaborators.length === 0 && (
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
