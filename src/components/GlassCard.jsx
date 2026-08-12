import { motion } from "framer-motion";

const variants = {
  default: "glass",
  strong: "glass-strong",
};

export default function GlassCard({
  children,
  className = "",
  variant = "default",
  hover = true,
  as: Component = motion.div,
  ...props
}) {
  return (
    <Component
      className={`rounded-3xl ${variants[variant]} shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${className}`}
      whileHover={
        hover
          ? { y: -6, boxShadow: "0 20px 45px rgba(0,0,0,0.45)", borderColor: "rgba(129,140,248,0.35)" }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      {...props}
    >
      {children}
    </Component>
  );
}
