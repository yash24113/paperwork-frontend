"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { DocumentViewer } from "../../../components/DocumentViewer";
import { ExtractedFieldsPanel } from "../../../components/ExtractedFieldsPanel";
import { ChatPanel } from "../../../components/ChatPanel";
import { getDocument } from "../../../lib/api";
import { getPublicFileUrl } from "../../../lib/supabaseClient";
import type { DocumentResponse } from "../../../lib/types";

const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "paperwork-documents";

export default function WorkspacePage({ params }: { params: { documentId: string } }) {
  const [document, setDocument] = useState<DocumentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getDocument(params.documentId);
        if (!cancelled) setDocument(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load document");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params.documentId]);

  if (error) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 px-6 py-24 text-center">
        <AlertTriangle className="text-rose-500" size={32} />
        <p className="text-slate-700">{error}</p>
        <Link href="/" className="text-sm font-medium text-brand-600 hover:underline">
          Back to upload
        </Link>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 size={28} className="animate-spin" />
        <p className="text-sm">Loading document...</p>
      </div>
    );
  }

  const fileUrl = getPublicFileUrl(STORAGE_BUCKET, document.storage_path);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={15} /> Upload another document
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="lg:col-span-1 lg:min-h-[640px]">
          <DocumentViewer document={document} fileUrl={fileUrl} />
        </div>
        <div className="lg:col-span-1 lg:min-h-[640px]">
          <ExtractedFieldsPanel summary={document.summary} fields={document.extracted_fields} />
        </div>
        <div className="lg:col-span-1 lg:min-h-[640px]">
          <ChatPanel documentId={document.id} language={document.language} />
        </div>
      </div>
    </div>
  );
}
