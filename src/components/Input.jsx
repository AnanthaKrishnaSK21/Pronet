export function Input({ label, className = "", textarea = false, ...props }) {
  const Comp = textarea ? "textarea" : "input";
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{label}</span>}
      <Comp
        className={`w-full rounded-2xl neu focus:neu-pressed px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-500 outline-none border border-transparent focus:border-indigo-400/40 transition-all duration-200 ${
          textarea ? "min-h-[110px] resize-y" : ""
        } ${className}`}
        {...props}
      />
    </label>
  );
}
