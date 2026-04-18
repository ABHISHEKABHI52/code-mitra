import { useState } from "react";

const Section = ({ color, label, children }) => (
  <div className={`border-l-4 ${color} py-2 pl-4`}>
    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
    {children}
  </div>
);

export default function ResultCard({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) {
    return null;
  }

  const copy = async () => {
    await navigator.clipboard.writeText(data.example_code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">
        <span>Explanation Ready</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            data.response_mode === "live" ? "bg-emerald-500 text-white" : "bg-amber-400 text-gray-900"
          }`}
        >
          {data.response_mode === "live" ? "Live AI" : "Fallback Mode"}
        </span>
      </div>
      <div className="space-y-5 p-5">
        <Section color="border-blue-500" label="Meaning">
          <p className="text-gray-800">{data.meaning}</p>
        </Section>

        <Section color="border-yellow-400" label="Think of it like this">
          <p className="italic text-gray-700">{data.analogy}</p>
        </Section>

        <Section color="border-red-400" label="Common cause">
          <p className="text-gray-800">{data.cause}</p>
        </Section>

        <Section color="border-green-500" label="How to fix">
          <pre className="whitespace-pre-wrap text-sm text-gray-800">{data.fix_steps}</pre>
        </Section>

        <Section color="border-green-500" label="Fixed code">
          <div className="relative mt-1 rounded-lg bg-gray-900 p-4">
            <button
              onClick={copy}
              type="button"
              className="absolute right-2 top-2 rounded border border-gray-600 px-2 py-1 text-xs text-gray-300 hover:text-white"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-green-300">{data.example_code}</pre>
          </div>
        </Section>

        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
          <p className="mb-1 text-xs font-semibold text-indigo-600">Remember</p>
          <p className="text-sm italic text-indigo-900">{data.summary}</p>
        </div>
      </div>
    </div>
  );
}
