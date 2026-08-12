import { motion } from "framer-motion";

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium rounded-2xl select-none transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:shadow-[0_10px_32px_rgba(99,102,241,0.55)]",
  glass: "glass text-slate-800 dark:text-slate-100 hover:border-indigo-400/40",
  neu: "neu text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
  ghost: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5",
  danger: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[0_8px_24px_rgba(244,63,94,0.35)]",
  success: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)]",
};

const sizes = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
  icon: "p-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={disabled ? {} : { scale: 1.035 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
