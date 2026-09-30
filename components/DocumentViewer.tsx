import { FileText } from "lucide-react";
import { Card, CardHeader } from "./ui/Card";
import { Badge } from "./ui/Badge";
import type { DocumentResponse } from "../lib/types";

interface DocumentViewerProps {
  document: DocumentResponse;
  fileUrl: string | null;
}

export function DocumentViewer({ document, fileUrl }: DocumentViewerProps) {
  const isPdf = document.mime_type === "application/pdf";

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <FileText size={16} className="shrink-0 text-slate-400" />
          <p className="truncate text-sm font-medium text-slate-700">{document.file_name}</p>
        </div>
        {document.document_type ? <Badge tone="brand">{document.document_type}</Badge> : null}
      </CardHeader>
      <div className="flex flex-1 items-center justify-center bg-slate-50 p-4">
        {!fileUrl ? (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <FileText size={40} />
            <p className="text-sm">Preview unavailable</p>
          </div>
        ) : isPdf ? (
          <iframe src={fileUrl} title={document.file_name} className="h-[560px] w-full rounded-lg border border-slate-200 bg-white" />
        ) : (
          <img
            src={fileUrl}
            alt={document.file_name}
            className="max-h-[560px] w-auto rounded-lg border border-slate-200 object-contain shadow-sm"
          />
        )}
      </div>
    </Card>
  );
}
