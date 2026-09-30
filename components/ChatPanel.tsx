"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send, Volume2 } from "lucide-react";
import clsx from "clsx";
import { Card, CardBody, CardHeader } from "./ui/Card";
import { Button } from "./ui/Button";
import { VoiceButton } from "./VoiceButton";
import { useSpeechRecognition } from "../lib/useSpeechRecognition";
import { useSpeechSynthesis } from "../lib/useSpeechSynthesis";
import { askQuestion } from "../lib/api";
import { speechLangFor } from "../lib/languages";
import type { ChatMessage } from "../lib/types";

interface ChatPanelProps {
  documentId: string;
  language?: string;
}

export function ChatPanel({ documentId, language = "en" }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const speechLang = speechLangFor(language);

  const { isSupported, isListening, transcript, startListening, stopListening, resetTranscript } =
    useSpeechRecognition(speechLang);
  const { isSupported: speechOutSupported, isSpeaking, speak } = useSpeechSynthesis();

  useEffect(() => {
    if (!isListening && transcript) {
      setInput(transcript);
      resetTranscript();
    }
  }, [isListening, transcript, resetTranscript]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submitQuestion = async (event: FormEvent) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || isSending) return;

    setError(null);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setIsSending(true);

    try {
      const response = await askQuestion(documentId, question, language);
      setMessages((prev) => [...prev, { role: "assistant", content: response.answer }]);
      speak(response.answer, speechLang);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="flex items-center gap-2">
        <MessageCircle size={16} className="text-slate-400" />
        <p className="text-sm font-medium text-slate-700">Ask about this document</p>
        {isSpeaking ? (
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-brand-600">
            <Volume2 size={14} className="animate-pulse" /> speaking
          </span>
        ) : null}
      </CardHeader>

      <CardBody ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center text-slate-400">
            <MessageCircle size={32} />
            <p className="text-sm">
              Try asking &ldquo;When is this due?&rdquo; or &ldquo;What do I need to send back?&rdquo;
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={clsx("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={clsx(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-brand-600 text-white rounded-br-sm"
                    : "bg-slate-100 text-slate-800 rounded-bl-sm"
                )}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        {isSending ? (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-500">
              <Loader2 size={14} className="animate-spin" /> thinking...
            </div>
          </div>
        ) : null}
      </CardBody>

      {error ? <p className="px-5 pb-1 text-xs text-rose-600">{error}</p> : null}

      <form onSubmit={submitQuestion} className="flex items-center gap-2 border-t border-slate-100 p-3">
        <VoiceButton
          isListening={isListening}
          isSupported={isSupported}
          onStart={startListening}
          onStop={stopListening}
        />
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={isListening ? "Listening..." : "Type or use the mic..."}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400 focus:bg-white"
        />
        <Button type="submit" size="md" disabled={isSending || !input.trim()} aria-label="Send">
          <Send size={16} />
        </Button>
      </form>
      {!speechOutSupported ? null : null}
    </Card>
  );
}
