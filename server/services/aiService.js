import OpenAI from "openai";
import { buildPrompt } from "./promptService.js";

const DEFAULT_FALLBACKS = {
  Hinglish: {
    response_mode: "fallback",
    meaning: "Program us line ko samajh nahi paaya jahan error aaya.",
    analogy: "Jaise galat address likhne par parcel deliver nahi hota.",
    cause: "Input me exact context ya variable setup missing lag raha hai.",
    fix_steps: "1. Error line dhyan se dekho\n2. Missing variable ya syntax add karo\n3. Dubara run karke next error fix karo",
    example_code: "let x = 10;\nconsole.log(x);",
    summary: "Use karne se pehle cheez define karo.",
    pro_tip: "Browser console (F12) kholo aur exact line number dekho jahan error aaya."
  },
  Hindi: {
    response_mode: "fallback",
    meaning: "प्रोग्राम उस लाइन को समझ नहीं पाया जहां त्रुटि आई है।",
    analogy: "जैसे गलत पते पर पार्सल नहीं पहुंचता।",
    cause: "इनपुट में संदर्भ, वैरिएबल या सिंटैक्स सही नहीं है।",
    fix_steps: "1. त्रुटि वाली लाइन देखें\n2. मिसिंग वैरिएबल या सिंटैक्स ठीक करें\n3. दोबारा रन करके अगली त्रुटि देखें",
    example_code: "let x = 10;\nconsole.log(x);",
    summary: "इस्तेमाल से पहले वैरिएबल सही तरह से परिभाषित करें।",
    pro_tip: "F12 खोलकर console में exact line number देखें।"
  },
  English: {
    response_mode: "fallback",
    meaning: "The program could not understand what to execute at the error line.",
    analogy: "It is like trying to deliver a package to the wrong address.",
    cause: "The code likely has missing context, variable setup, or incorrect syntax.",
    fix_steps: "1. Read the exact error line\n2. Add missing variable/syntax\n3. Run again and fix the next error",
    example_code: "let x = 10;\nconsole.log(x);",
    summary: "Define things before using them.",
    pro_tip: "Open browser/terminal logs and focus on the first failing line."
  }
};

const ERROR_PATTERNS = [
  {
    type: "undefined_property",
    test: (text) => /cannot read (properties|property) of undefined|undefined.*(map|filter|length|push|id|name)/i.test(text),
    byLang: {
      Hinglish: {
        meaning: "Tum undefined value se property read karne ki koshish kar rahe ho.",
        analogy: "Jaise khaali shelf se book nikaalne jao.",
        cause: "Data load hone se pehle access ho raha hai ya variable assign nahi hua.",
        fix_steps: "1. Optional chaining use karo: obj?.prop\n2. Null/undefined guard lagao\n3. API response aane ke baad hi render karo",
        example_code: "const items = data?.items ?? [];\nitems.map((item) => console.log(item.name));",
        summary: "Undefined check ke bina property access mat karo.",
        pro_tip: "Console me access se just pehle value log karo: console.log(data)."
      },
      Hindi: {
        meaning: "आप undefined वैल्यू से property पढ़ने की कोशिश कर रहे हैं।",
        analogy: "जैसे खाली शेल्फ से किताब निकालना।",
        cause: "डेटा आने से पहले access हो रहा है या वैरिएबल assign नहीं हुआ।",
        fix_steps: "1. Optional chaining करें: obj?.prop\n2. Null/undefined guard लगाएं\n3. API के बाद ही render करें",
        example_code: "const items = data?.items ?? [];\nitems.map((item) => console.log(item.name));",
        summary: "Undefined check के बिना property access न करें।",
        pro_tip: "Access से पहले console.log(data) जरूर देखें।"
      },
      English: {
        meaning: "You are trying to read a property from an undefined value.",
        analogy: "Like trying to pick a book from an empty shelf.",
        cause: "Data is being accessed before it is loaded, or the variable was never assigned.",
        fix_steps: "1. Use optional chaining: obj?.prop\n2. Add null/undefined guards\n3. Render only after data is available",
        example_code: "const items = data?.items ?? [];\nitems.map((item) => console.log(item.name));",
        summary: "Never access properties without checking for undefined.",
        pro_tip: "Log the value right before access to confirm runtime shape."
      }
    }
  },
  {
    type: "reference_error",
    test: (text) => /referenceerror|is not defined/i.test(text),
    byLang: {
      Hinglish: {
        meaning: "Code kisi aise variable/function ko use kar raha hai jo define nahi hua.",
        analogy: "Jaise phone contact list me naam save hi nahi hai aur call karne ki koshish karo.",
        cause: "Spelling mismatch, scope issue, ya declaration missing.",
        fix_steps: "1. Variable declare karo (let/const)\n2. Name spelling exactly match karo\n3. Scope ke andar use karo",
        example_code: "const total = 10;\nconsole.log(total);",
        summary: "Pehle define, phir use.",
        pro_tip: "Autocompletion use karo taaki naming typo kam ho."
      },
      Hindi: {
        meaning: "कोड ऐसे variable/function का उपयोग कर रहा है जो define नहीं है।",
        analogy: "जैसे contact list में नाम सेव न हो और कॉल करने की कोशिश करें।",
        cause: "Spelling mismatch, scope समस्या, या declaration missing।",
        fix_steps: "1. Variable declare करें (let/const)\n2. नाम की spelling मैच करें\n3. सही scope में उपयोग करें",
        example_code: "const total = 10;\nconsole.log(total);",
        summary: "पहले define करें, फिर use करें।",
        pro_tip: "Naming mistakes पकड़ने के लिए autocomplete इस्तेमाल करें।"
      },
      English: {
        meaning: "Your code is using a variable/function that is not defined.",
        analogy: "Like dialing a contact that was never saved.",
        cause: "Name typo, scope issue, or missing declaration.",
        fix_steps: "1. Declare the variable first (let/const)\n2. Match spelling exactly\n3. Use it in the correct scope",
        example_code: "const total = 10;\nconsole.log(total);",
        summary: "Define first, use later.",
        pro_tip: "Use editor suggestions to avoid naming typos."
      }
    }
  },
  {
    type: "syntax_error",
    test: (text) => /syntaxerror|unexpected token|unexpected end of input|missing\s*[)\]}]/i.test(text),
    byLang: {
      Hinglish: {
        meaning: "Code grammar (syntax) toot gaya hai, isliye parser ruk gaya.",
        analogy: "Jaise sentence me bracket ya punctuation missing ho jaye.",
        cause: "Bracket/quote/semicolon mismatch ya incomplete code block.",
        fix_steps: "1. Brackets pair check karo\n2. Quotes close karo\n3. Error line ke just upar wali lines bhi check karo",
        example_code: "function greet(name) {\n  console.log('Hi ' + name);\n}",
        summary: "Syntax errors me mostly punctuation mismatch hota hai.",
        pro_tip: "Editor formatting (Prettier) run karo, mismatch jaldi pakadta hai."
      },
      Hindi: {
        meaning: "कोड का syntax टूट गया है, इसलिए parser आगे नहीं बढ़ रहा।",
        analogy: "जैसे वाक्य में bracket या punctuation अधूरा रह जाए।",
        cause: "Bracket/quote/semicolon mismatch या code block अधूरा है।",
        fix_steps: "1. Bracket pair जांचें\n2. Quotes close करें\n3. Error line से ऊपर की lines भी जांचें",
        example_code: "function greet(name) {\n  console.log('Hi ' + name);\n}",
        summary: "Syntax errors अक्सर punctuation mismatch से आते हैं।",
        pro_tip: "Auto-format चलाकर mismatch जल्दी पकड़ें।"
      },
      English: {
        meaning: "The code syntax is broken, so the parser cannot continue.",
        analogy: "Like a sentence with missing punctuation or brackets.",
        cause: "Bracket/quote/semicolon mismatch or an incomplete code block.",
        fix_steps: "1. Check bracket pairs\n2. Close all quotes\n3. Inspect lines above the reported line",
        example_code: "function greet(name) {\n  console.log('Hi ' + name);\n}",
        summary: "Syntax errors usually come from punctuation mismatches.",
        pro_tip: "Run auto-format to quickly expose structural issues."
      }
    }
  },
  {
    type: "module_not_found",
    test: (text) => /cannot find module|module not found|failed to resolve module/i.test(text),
    byLang: {
      Hinglish: {
        meaning: "Project requested package/file ko locate nahi kar pa raha.",
        analogy: "Jaise address sahi ho par building ka flat number galat ho.",
        cause: "Dependency install nahi, path typo, ya wrong import path.",
        fix_steps: "1. npm install / npm i <package>\n2. Import path check karo\n3. File name case-sensitivity verify karo",
        example_code: "import axios from 'axios';\n// Ensure: npm i axios",
        summary: "Sahi package + sahi import path dono zaroori hai.",
        pro_tip: "Relative imports me ./ aur ../ carefully use karo."
      },
      Hindi: {
        meaning: "प्रोजेक्ट requested package/file को नहीं ढूंढ पा रहा।",
        analogy: "जैसे पता सही हो पर फ्लैट नंबर गलत हो।",
        cause: "Dependency install नहीं है, path typo है, या import path गलत है।",
        fix_steps: "1. npm install / npm i <package>\n2. Import path जांचें\n3. File name case-sensitivity जांचें",
        example_code: "import axios from 'axios';\n// Ensure: npm i axios",
        summary: "सही package और सही import path दोनों चाहिए।",
        pro_tip: "Relative imports में ./ और ../ सही रखें।"
      },
      English: {
        meaning: "The project cannot locate the requested package/file.",
        analogy: "Like having the right street but wrong apartment number.",
        cause: "Dependency not installed, import path typo, or wrong relative path.",
        fix_steps: "1. Run npm install / npm i <package>\n2. Verify import path\n3. Check file name case sensitivity",
        example_code: "import axios from 'axios';\n// Ensure: npm i axios",
        summary: "You need both the correct package and correct path.",
        pro_tip: "Be careful with ./ and ../ in relative imports."
      }
    }
  }
];

const getSafeLanguage = (lang) => {
  if (lang === "Hindi" || lang === "Hinglish" || lang === "English") return lang;
  return "Hinglish";
};

const buildFallbackResponse = (input, lang) => {
  const safeLang = getSafeLanguage(lang);
  const raw = String(input || "");

  const matched = ERROR_PATTERNS.find((item) => item.test(raw));
  if (!matched) {
    return {
      ...DEFAULT_FALLBACKS[safeLang],
      pro_tip:
        safeLang === "English"
          ? `Original error captured: ${raw.slice(0, 140) || "No input provided"}`
          : `Original error captured: ${raw.slice(0, 140) || "Input missing"}`
    };
  }

  return {
    response_mode: "fallback",
    ...matched.byLang[safeLang]
  };
};

let hasLoggedQuotaWarning = false;

export const generateExplanation = async (input, lang) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing in server/.env.local");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = buildPrompt(input, lang);

  let response;

  try {
    response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 700,
      messages: [{ role: "user", content: prompt }]
    });
  } catch (error) {
    const isQuotaError = error?.status === 429 || error?.code === 429;
    if (isQuotaError) {
      if (!hasLoggedQuotaWarning) {
        hasLoggedQuotaWarning = true;
        console.warn("OpenAI quota reached. Falling back to local explanation responses.");
      }
    } else {
      console.error("OpenAI API error:", error.message);
    }
    return buildFallbackResponse(input, lang);
  }

  const raw = response.choices?.[0]?.message?.content || "";
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    const fallback = buildFallbackResponse(input, lang);
    return {
      response_mode: "live",
      meaning: parsed.meaning || fallback.meaning,
      analogy: parsed.analogy || fallback.analogy,
      cause: parsed.cause || fallback.cause,
      fix_steps: parsed.fix_steps || fallback.fix_steps,
      example_code: parsed.example_code || fallback.example_code,
      summary: parsed.summary || fallback.summary,
      pro_tip: parsed.pro_tip || fallback.pro_tip
    };
  } catch {
    console.warn("JSON parse failed, returning input-aware fallback");
    return buildFallbackResponse(input, lang);
  }
};
