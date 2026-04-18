import { LANGUAGES } from "../utils/constants";

export default function LanguageSelector({ selected, onChange }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
            selected === lang
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:border-indigo-400"
          }`}
          type="button"
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
