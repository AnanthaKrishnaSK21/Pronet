import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserPlus2 } from "lucide-react";
import GlassCard from "../components/GlassCard";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import PageTransition, { staggerContainer, staggerItem } from "../components/PageTransition";
import { connections } from "../data/mock";

export default function Connections() {
  return (
    <PageTransition className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your Connections</h1>
        <p className="text-slate-600 dark:text-slate-400">{connections.length} developers in your network.</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {connections.map((u) => (
          <GlassCard key={u.id} variants={staggerItem} className="p-6 flex flex-col items-center text-center">
            <Avatar src={u.avatar} online={u.online} size="xl" ring className="mb-4" />
            <Link to="/profile" className="font-semibold text-slate-900 dark:text-white hover:text-gradient transition-all">
              {u.name}
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{u.handle}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">{u.title}</p>
            <div className="flex gap-2 w-full">
              <Button size="sm" variant="glass" className="flex-1">
                Message
              </Button>
              <Button size="sm" variant="ghost" className="flex-1">
                <UserPlus2 className="w-4 h-4" /> View
              </Button>
            </div>
          </GlassCard>
        ))}
      </motion.div>
    </PageTransition>
  );
}
