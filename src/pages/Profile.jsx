import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Code2, Users2, FolderGit2, Activity, CheckCircle2 } from "lucide-react";
import GlassCard from "../components/GlassCard";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import { TechPill } from "../components/Pill";
import PageTransition, { staggerContainer, staggerItem } from "../components/PageTransition";
import { useEffect, useState } from "react";

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
  { icon: FolderGit2, key: "projects", label: "Projects" },
  { icon: Users2, key: "connections", label: "Connections" },
  { icon: Activity, key: "contributions", label: "Contributions" },
  { icon: CheckCircle2, key: "requestsAccepted", label: "Requests Accepted" },
];

export default function Profile() {
  const grid = useContributionData();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");

    if (!storedUser) {
        setLoading(false);
        return;
    }

    const loggedInUser = JSON.parse(storedUser);

    setUser(loggedInUser);

    fetch(
        `http://localhost:5000/api/users/${loggedInUser.user_name}/projects`
    )
        .then((response) => response.json())
        .then((data) => {
            setProjects(data);
            setLoading(false);
        })
        .catch((error) => {
            console.error(error);
            setLoading(false);
        });
  }, []);

  return (
    <PageTransition className="max-w-5xl mx-auto px-6 py-10">
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
        <GlassCard variants={staggerItem} variant="strong" className="p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar src={currentUser.avatar} online size="xl" ring />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user ? user.user_name : "Loading..."}</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{user ? user.email : ""}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{currentUser.location}</span>
                <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5" />{currentUser.github}</span>
              </div>
            </div>
            <Button variant="glass">Edit Profile</Button>
          </div>
          <p className="relative text-sm text-slate-700 dark:text-slate-300 mt-6 leading-relaxed max-w-2xl">{currentUser.bio}</p>
        </GlassCard>

        <motion.div variants={staggerItem} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map(({ icon: Icon, key, label }) => (
            <GlassCard key={key} className="p-5 text-center" hover>
              <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-300 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{currentUser.stats[key]}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
            </GlassCard>
          ))}
        </motion.div>

        <GlassCard variants={staggerItem} className="p-7">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.skills.map((s) => (
              <TechPill key={s} label={s} />
            ))}
          </div>
        </GlassCard>

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

        <GlassCard variants={staggerItem} className="p-7">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">Posted Projects</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/project/${p.id}`}
                className="block p-4 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 hover:border-indigo-400/30 hover:bg-slate-900/8 dark:hover:bg-white/8 transition-colors"
              >
                <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">{p.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{p.tagline}</p>
              </Link>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </PageTransition>
  );
}
