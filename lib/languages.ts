export interface Language {
  code: string;
  label: string;
  speechLang: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", speechLang: "en-US" },
  { code: "hi", label: "Hindi", speechLang: "hi-IN" },
  { code: "gu", label: "Gujarati", speechLang: "gu-IN" },
  { code: "es", label: "Spanish", speechLang: "es-ES" },
  { code: "fr", label: "French", speechLang: "fr-FR" },
  { code: "de", label: "German", speechLang: "de-DE" },
  { code: "zh", label: "Chinese (Simplified)", speechLang: "zh-CN" },
  { code: "ar", label: "Arabic", speechLang: "ar-SA" },
  { code: "pt", label: "Portuguese", speechLang: "pt-BR" },
  { code: "ja", label: "Japanese", speechLang: "ja-JP" },
  { code: "ru", label: "Russian", speechLang: "ru-RU" },
];

export const DEFAULT_LANGUAGE_CODE = "en";

export function speechLangFor(code: string | null | undefined): string {
  return LANGUAGES.find((lang) => lang.code === code)?.speechLang ?? "en-US";
}

const STORAGE_KEY = "paperwork-buddy-language";

export function getStoredLanguage(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE_CODE;
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_LANGUAGE_CODE;
  } catch {
    return DEFAULT_LANGUAGE_CODE;
  }
}

export function storeLanguage(code: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // ignore write failures (private browsing, storage disabled, etc.)
  }
}
