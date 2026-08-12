import { motion } from "framer-motion";
import { techColors } from "../data/mock";

export function TechPill({ label, className = "" }) {
  const cls = techColors[label] || techColors.default;
  return (
    <motion.span
      whileHover={{ scale: 1.08, y: -1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-gradient-to-br ${cls} ${className}`}
    >
      {label}
    </motion.span>
  );
}

export function RolePill({ label, className = "" }) {
  return (
    <motion.span
      whileHover={{ scale: 1.08, y: -1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/10 dark:bg-teal-400/20 text-teal-700 dark:text-teal-300 border border-teal-400/30 ${className}`}
    >
      {label}
    </motion.span>
  );
}

export function SkillPill({ label, onRemove, className = "" }) {
  const cls = techColors[label] || techColors.default;
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-gradient-to-br ${cls} ${className}`}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:text-slate-900 dark:hover:text-white opacity-70 hover:opacity-100 transition-opacity leading-none"
        >
          ×
        </button>
      )}
    </motion.span>
  );
}
