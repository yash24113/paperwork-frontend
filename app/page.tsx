"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, MessageSquareText, Mic, ShieldCheck } from "lucide-react";
import { UploadDropzone } from "../components/UploadDropzone";
import { uploadDocument } from "../lib/api";

const FEATURES = [
  {
    icon: FileText,
    title: "Understands any document",
    description: "Bills, forms, letters, and IDs are read directly by Gemini - no OCR pipeline needed.",
  },
  {
    icon: MessageSquareText,
    title: "Answers your questions",
    description: "Ask what a due date means or what you owe, and get a plain-language answer.",
  },
  {
    icon: Mic,
    title: "Hands-free by voice",
    description: "Speak your question and hear the answer read back out loud.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const document = await uploadDocument(file);
      router.push(`/workspace/${document.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed, please try again");
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-14 px-6 pb-24 pt-16 sm:pt-24">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
          <ShieldCheck size={14} /> Built with Gemini 2.0 Flash
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Paperwork, finally explained.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
          Upload any bill, form, or letter. Paperwork Buddy reads it, extracts what matters,
          and answers your questions - even by voice.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <UploadDropzone onFileSelected={handleFileSelected} isUploading={isUploading} error={error} />
      </div>

      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon size={20} />
            </div>
            <p className="text-sm font-semibold text-slate-800">{title}</p>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
