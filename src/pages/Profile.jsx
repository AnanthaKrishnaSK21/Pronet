import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Code2, Users2, FolderGit2, Activity, CheckCircle2, Edit3, Save, PlusCircle, Inbox } from "lucide-react";
import GlassCard from "../components/GlassCard";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import { TechPill } from "../components/Pill";
import Modal from "../components/Modal";
import { Input } from "../components/Input";
import { useToast } from "../components/Toast";
import PageTransition, { staggerContainer, staggerItem } from "../components/PageTransition";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

const contributionWeeks = 24;
function useContributionData() {
  const seedRand = (i) => {
    const x = Math.sin(i * 999) * 10000;
    return x - Math.floor(x);
  };
  return Array.from({ length: contributionWeeks }).map((_, w) =>
    Array.from({ length: 7 }).map((_, d) => {
      const r = seedRand(w * 7 + d);
      return r > 0.75 ? 3 : r > 0.55 ? 2 : r > 0.35 ? 1 : 0;
    })
  );
}

const levelColors = [
  "bg-slate-900/8 dark:bg-white/8",
  "bg-indigo-500/30",
  "bg-indigo-500/60",
  "bg-indigo-400",
];

const statCards = [
  { icon: FolderGit2, key: "projects", label: "Projects Posted" },
  { icon: Users2, key: "connections", label: "Connections" },
  { icon: Activity, key: "contributions", label: "Contributions" },
  { icon: CheckCircle2, key: "requestsAccepted", label: "Requests Accepted" },
];

export default function Profile() {
  const grid = useContributionData();
  const { user: authUser, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(authUser);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  // Edit Profile Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    github_url: "",
    bio: "",
    skills: "",
  });

  const currentUsername = authUser?.user_name || "aaravk";

  useEffect(() => {
    if (!currentUsername) return;

    // 1. Fetch real user profile from DB
    fetch(`http://localhost:5000/api/users/${currentUsername}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => {
        if (data && data.user_name) {
          setProfileData(data);
          updateUser(data);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch user profile from DB", err);
      });

    // 2. Fetch real projects owned by this user from DB
    fetch(`http://localhost:5000/api/users/${currentUsername}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error("Projects fetch error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
        }
      })
      .catch(() => {
        setProjects([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUsername]);

  const user = profileData || authUser;
  const displayName = user?.user_name || currentUsername;
  const displayEmail = user?.email || `${currentUsername}@example.com`;
  const avatarUrl =
    user?.avatar ||
    `https://api.dicebear.com/9.x/notionists/svg?seed=${currentUsername}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  const locationText = user?.location || "Location not specified";
  const githubText = user?.github_url || currentUsername;
  const bioText = user?.bio || "No bio yet. Click 'Edit Profile' to add your bio.";

  const statsData = {
    projects: projects.length,
    connections: user?.stats?.connections ?? 0,
    contributions: user?.stats?.contributions ?? 0,
    requestsAccepted: user?.stats?.requestsAccepted ?? 0,
  };

  const skillsList = Array.isArray(user?.skills) && user.skills.length > 0 ? user.skills : [];

  const handleOpenEdit = () => {
    setEditForm({
      title: user?.title || "",
      location: user?.location || "",
      github_url: user?.github_url || "",
      bio: user?.bio || "",
      skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
    });
    setEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const skillsArray = editForm.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`http://localhost:5000/api/users/${currentUsername}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          location: editForm.location,
          github_url: editForm.github_url,
          bio: editForm.bio,
          skills: skillsArray,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedData = await res.json();
      setProfileData((prev) => ({ ...prev, ...updatedData }));
      updateUser(updatedData);

      showToast("Profile updated in database!", "success");
      setEditModalOpen(false);
    } catch (err) {
      showToast("Failed to save changes to database", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition className="max-w-5xl mx-auto px-6 py-10">
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
        <GlassCard variants={staggerItem} variant="strong" className="p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar src={avatarUrl} online size="xl" ring />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{displayName}</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                <span className="font-medium text-indigo-500 dark:text-indigo-400">
                  {user?.title || "Developer"}
                </span>{" "}
                · {displayEmail}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {locationText}
                </span>
                <span className="flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5" />
                  {githubText}
                </span>
              </div>
            </div>
            <Button variant="glass" onClick={handleOpenEdit}>
              <Edit3 className="w-4 h-4" /> Edit Profile
            </Button>
          </div>
          <p className="relative text-sm text-slate-700 dark:text-slate-300 mt-6 leading-relaxed max-w-2xl">
            {bioText}
          </p>
        </GlassCard>

        {/* Real Stats Grid */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map(({ icon: Icon, key, label }) => (
            <GlassCard key={key} className="p-5 text-center" hover>
              <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-300 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{statsData[key]}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Skills from Database */}
        <GlassCard variants={staggerItem} className="p-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Skills</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {skillsList.length} technologies listed
            </span>
          </div>
          {skillsList.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No skills added yet. Click &quot;Edit Profile&quot; to add your technical skills.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skillsList.map((s) => (
                <TechPill key={s} label={s} />
              ))}
            </div>
          )}
        </GlassCard>

        {/* Activity Heatmap */}
        <GlassCard variants={staggerItem} className="p-7">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">Contribution Activity</h3>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-max">
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((level, di) => (
                    <motion.div
                      key={di}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (wi * 7 + di) * 0.002 }}
                      whileHover={{ scale: 1.4 }}
                      className={`w-3 h-3 rounded-sm ${levelColors[level]}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end mt-3 text-xs text-slate-500 dark:text-slate-400">
            Less
            {levelColors.map((c, i) => (
              <span key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            More
          </div>
        </GlassCard>

        {/* Real Projects Owned by this user */}
        <GlassCard variants={staggerItem} className="p-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Posted Projects ({projects.length})
            </h3>
            <Link to="/create">
              <Button size="xs" variant="glass">
                <PlusCircle className="w-3.5 h-3.5" /> New Project
              </Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-700/50 rounded-2xl">
              <Inbox className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400 mb-3">You haven&apos;t posted any projects yet.</p>
              <Link to="/create">
                <Button size="sm" variant="primary">
                  Publish Your First Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  to={`/project/${p.id}`}
                  className="block p-4 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 hover:border-indigo-400/30 hover:bg-slate-900/8 dark:hover:bg-white/8 transition-colors"
                >
                  <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">{p.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{p.tagline}</p>
                  {Array.isArray(p.tech) && p.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {p.tech.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Edit Profile Interactive Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <Input
            label="Professional Title"
            placeholder="e.g. Full-Stack Developer · DBMS Specialist"
            value={editForm.title}
            onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Input
            label="Location"
            placeholder="e.g. Bengaluru, India"
            value={editForm.location}
            onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
          />
          <Input
            label="GitHub Profile / Handle"
            placeholder="e.g. yourhandle"
            value={editForm.github_url}
            onChange={(e) => setEditForm((f) => ({ ...f, github_url: e.target.value }))}
          />
          <Input
            label="Skills (comma separated)"
            placeholder="React, Node.js, Python, PostgreSQL, Docker"
            value={editForm.skills}
            onChange={(e) => setEditForm((f) => ({ ...f, skills: e.target.value }))}
          />
          <Input
            textarea
            label="Bio"
            placeholder="Tell the community about yourself and what you love building..."
            value={editForm.bio}
            onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
