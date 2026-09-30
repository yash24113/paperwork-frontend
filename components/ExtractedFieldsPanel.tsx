import { ClipboardList, Sparkles } from "lucide-react";
import { Card, CardBody, CardHeader } from "./ui/Card";
import { Badge } from "./ui/Badge";
import type { ExtractedField } from "../lib/types";

interface ExtractedFieldsPanelProps {
  summary: string | null;
  fields: ExtractedField[];
}

function confidenceTone(confidence: number | null): "green" | "amber" | "rose" | "slate" {
  if (confidence === null) return "slate";
  if (confidence >= 0.8) return "green";
  if (confidence >= 0.5) return "amber";
  return "rose";
}

export function ExtractedFieldsPanel({ summary, fields }: ExtractedFieldsPanelProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="flex items-center gap-2">
        <ClipboardList size={16} className="text-slate-400" />
        <p className="text-sm font-medium text-slate-700">Extracted details</p>
      </CardHeader>
      <CardBody className="flex-1 overflow-y-auto">
        {summary ? (
          <div className="mb-4 flex gap-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-900">
            <Sparkles size={16} className="mt-0.5 shrink-0 text-brand-500" />
            <p>{summary}</p>
          </div>
        ) : null}

        {fields.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-slate-400">
            <ClipboardList size={32} />
            <p className="text-sm">No fields were extracted from this document.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <tbody>
                {fields.map((field, index) => (
                  <tr
                    key={`${field.field_name}-${index}`}
                    className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                  >
                    <td className="w-1/3 px-3 py-2.5 align-top font-medium text-slate-500">
                      {field.field_name}
                    </td>
                    <td className="px-3 py-2.5 align-top text-slate-800">
                      {field.field_value || "-"}
                    </td>
                    <td className="w-16 px-3 py-2.5 text-right align-top">
                      {field.confidence !== null ? (
                        <Badge tone={confidenceTone(field.confidence)}>
                          {Math.round(field.confidence * 100)}%
                        </Badge>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
