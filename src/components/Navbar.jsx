import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Braces, Compass, Inbox, Users, PlusCircle, User as UserIcon, Menu, X } from "lucide-react";
import Avatar from "./Avatar";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { currentUser } from "../data/mock";

const links = [
  { to: "/feed", label: "Explore", icon: Compass },
  { to: "/requests", label: "Requests", icon: Inbox },
  { to: "/connections", label: "Connections", icon: Users },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      animate={{
        paddingTop: scrolled ? 8 : 18,
        paddingBottom: scrolled ? 8 : 18,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 px-4 sm:px-8"
    >
      <motion.div
        animate={{
          backgroundColor: isDark
            ? scrolled ? "rgba(15,17,23,0.72)" : "rgba(15,17,23,0.3)"
            : scrolled ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.35)",
          boxShadow: scrolled
            ? isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(15,23,42,0.12)"
            : "0 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-4 sm:px-5 py-2.5 backdrop-blur-xl border border-slate-900/10 dark:border-white/10"
      >
        <Link to="/feed" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-[0_4px_16px_rgba(99,102,241,0.5)]"
          >
            <Braces className="w-5 h-5 text-white" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white hidden sm:inline">
            Pro<span className="text-gradient">net</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-slate-900/6 dark:bg-white/8 border border-slate-900/10 dark:border-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button size="sm" variant="glass" onClick={() => navigate("/create")}>
            <PlusCircle className="w-4 h-4" />
            New Project
          </Button>
          <Link to="/profile">
            <Avatar src={currentUser.avatar} online size="sm" ring />
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="text-slate-700 dark:text-slate-300 p-1"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden max-w-6xl mx-auto mt-2 glass-strong rounded-2xl p-3 flex flex-col gap-1"
        >
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? "bg-slate-900/8 text-slate-900 dark:bg-white/10 dark:text-white" : "text-slate-600 dark:text-slate-300"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <UserIcon className="w-4 h-4" />
            Profile
          </NavLink>
          <Button size="sm" variant="primary" className="mt-1" onClick={() => { setMobileOpen(false); navigate("/create"); }}>
            <PlusCircle className="w-4 h-4" />
            New Project
          </Button>
        </motion.div>
      )}
    </motion.header>
  );
}
