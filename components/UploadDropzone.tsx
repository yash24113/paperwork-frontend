"use client";

import { ChangeEvent, DragEvent, useCallback, useState } from "react";
import { FileUp, Loader2, UploadCloud } from "lucide-react";
import clsx from "clsx";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
  error: string | null;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

export function UploadDropzone({ onFileSelected, isUploading, error }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) return;
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  return (
    <div className="w-full">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={clsx(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-colors",
          isDragging
            ? "border-brand-500 bg-brand-50"
            : "border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50",
          isUploading && "pointer-events-none opacity-70"
        )}
      >
        <input
          type="file"
          className="hidden"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleInputChange}
          disabled={isUploading}
        />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          {isUploading ? <Loader2 size={28} className="animate-spin" /> : <UploadCloud size={28} />}
        </div>
        <div>
          <p className="text-base font-semibold text-slate-800">
            {isUploading ? "Reading your document..." : "Drop a document here, or click to upload"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Bills, forms, letters, IDs - JPG, PNG, or PDF
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-brand-600">
          <FileUp size={14} />
          <span>Analyzed instantly with Gemini</span>
        </div>
      </label>
      {error ? <p className="mt-3 text-center text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
