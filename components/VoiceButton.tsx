"use client";

import { Mic, Square } from "lucide-react";
import clsx from "clsx";

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function VoiceButton({ isListening, isSupported, onStart, onStop }: VoiceButtonProps) {
  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={isListening ? onStop : onStart}
      title={isListening ? "Stop listening" : "Ask by voice"}
      className={clsx(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
        isListening ? "bg-rose-600 text-white" : "bg-brand-100 text-brand-600 hover:bg-brand-200"
      )}
    >
      {isListening ? <Square size={16} /> : <Mic size={18} />}
      {isListening ? (
        <span className="absolute inset-0 rounded-full bg-rose-500 animate-pulse-ring" />
      ) : null}
    </button>
  );
}
