const sizes = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-11 h-11",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const dotSizes = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3.5 h-3.5",
  xl: "w-5 h-5",
};

export default function Avatar({ src, alt = "", online, size = "md", ring = false, className = "" }) {
  return (
    <span className={`relative inline-block shrink-0 ${sizes[size]} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full rounded-full object-cover bg-slate-200 dark:bg-slate-700 ${
          ring ? "ring-2 ring-indigo-400/50 ring-offset-2 ring-offset-[#f8f9fd] dark:ring-offset-[#0f1117]" : ""
        }`}
      />
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-[#f8f9fd] dark:border-[#0f1117] ${dotSizes[size]} ${
            online ? "bg-emerald-400" : "bg-slate-500"
          }`}
        />
      )}
    </span>
  );
}
