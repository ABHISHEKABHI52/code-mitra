import { useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import ResultCard from "../components/ResultCard";
import { EXAMPLE_ERRORS } from "../utils/constants";
import { explainCode } from "../services/api";

function Home() {
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("Hindi");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExplain = async () => {
    if (!input.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await explainCode(input.trim(), lang);
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Backend se live explanation aati hai. Agar OpenAI quota/permission issue ho, app safe fallback JSON dikhata hai taaki demo kabhi break na ho."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-3xl font-bold text-gray-900">Local Language Code Explainer</h1>
        <p className="mb-6 text-gray-500">
          Explains errors in your <strong>thinking language</strong>.
        </p>

        <LanguageSelector selected={lang} onChange={setLang} />

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-32 w-full rounded-xl border border-gray-300 p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Paste your error message or code here..."
        />

        <div className="my-3 flex flex-wrap gap-2">
          {EXAMPLE_ERRORS.map((ex) => (
            <button
              key={ex.label}
              onClick={() => setInput(ex.error)}
              type="button"
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-600 hover:border-indigo-400"
            >
              {ex.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleExplain}
          disabled={loading || !input.trim()}
          className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-40"
          type="button"
        >
          {loading ? "Thinking..." : "Explain this error"}
        </button>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</div>}
        {result && <ResultCard data={result} />}
      </div>
    </div>
  );
}

export default Home;
