import axios from "axios";

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000" : "/api");
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");
const API_BASE_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

const fallbackResponse = {
  response_mode: "fallback",
  meaning: "Backend se live explanation aati hai. Agar OpenAI quota/permission issue ho, app safe fallback JSON dikhata hai taaki demo kabhi break na ho.",
  analogy: "Jaise internet slow ho to app lite mode me kaam karta rehta hai.",
  cause: "OpenAI service quota, permission, ya temporary network issue face kar rahi ho sakti hai.",
  fix_steps: "1. OpenAI billing/usage check karo\n2. API key verify karo\n3. Server restart karke dubara try karo",
  example_code: "// Retry request after validating API key and quota",
  summary: "App ne safe fallback response dikhaya hai taaki flow continue rahe.",
  pro_tip: "Agar repeatedly fallback aaye to OpenAI dashboard me usage limits zarur check karo."
};

export const explainCode = async (input, lang) => {
  try {
    return await axios.post(`${API_BASE_URL}/explain`, { input, lang });
  } catch (error) {
    // Keep UI resilient even when backend is unreachable or route is misconfigured.
    return { data: fallbackResponse };
  }
};