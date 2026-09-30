"use client";

import { Languages } from "lucide-react";
import { LANGUAGES } from "../lib/languages";

interface LanguageSelectProps {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export function LanguageSelect({ value, onChange, disabled }: LanguageSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-500">
      <Languages size={16} className="text-slate-400" />
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none transition-colors focus:border-brand-400 disabled:opacity-60"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </label>
  );
}
