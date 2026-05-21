import React from "react";  

export const FormField = ({ label, name, type = "text", value, onChange, placeholder, as = "input", options = [] }) => {
  const baseClass = "w-full p-3 bg-black/40 border border-white/20 text-white placeholder-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{label}</label>
      {as === "select" ? (
        <select name={name} value={value} onChange={onChange} className={baseClass}>
          <option value="" className="text-gray-900">Select...</option>
          {options.map(opt => <option key={opt} value={opt} className="text-gray-900">{opt}</option>)}
        </select>
      ) : as === "textarea" ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} className={`${baseClass} min-h-[80px]`} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={baseClass} />
      )}
    </div>
  );
};

