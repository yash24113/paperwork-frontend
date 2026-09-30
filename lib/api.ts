import type { ChatResponse, DocumentListItem, DocumentResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(body.detail ?? "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function uploadDocument(file: File, language?: string): Promise<DocumentResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (language) formData.append("language", language);

  const response = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<DocumentResponse>(response);
}

export async function getDocument(documentId: string): Promise<DocumentResponse> {
  const response = await fetch(`${API_URL}/documents/${documentId}`);
  return handleResponse<DocumentResponse>(response);
}

export async function listDocuments(): Promise<DocumentListItem[]> {
  const response = await fetch(`${API_URL}/documents`);
  return handleResponse<DocumentListItem[]>(response);
}

export async function askQuestion(
  documentId: string,
  question: string,
  language?: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId, question, language }),
  });
  return handleResponse<ChatResponse>(response);
}
