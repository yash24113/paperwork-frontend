export type DocumentStatus = "processing" | "ready" | "failed";

export interface ExtractedField {
  field_name: string;
  field_value: string | null;
  confidence: number | null;
}

export interface DocumentResponse {
  id: string;
  file_name: string;
  mime_type: string;
  document_type: string | null;
  summary: string | null;
  status: DocumentStatus;
  storage_path: string;
  created_at: string;
  updated_at: string;
  extracted_fields: ExtractedField[];
}

export interface DocumentListItem {
  id: string;
  file_name: string;
  document_type: string | null;
  status: DocumentStatus;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export interface ChatResponse {
  answer: string;
  history: ChatMessage[];
}
