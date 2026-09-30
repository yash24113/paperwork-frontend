import Link from "next/link";
import { FileStack } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
            <FileStack size={18} strokeWidth={2.25} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-slate-900">Paperwork Buddy</p>
            <p className="text-xs leading-none text-slate-400 mt-1">powered by Gemini</p>
          </div>
        </Link>
        <a
          href="https://ai.google.dev/gemini-api"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
        >
          built for a hackathon
        </a>
      </div>
    </header>
  );
}
