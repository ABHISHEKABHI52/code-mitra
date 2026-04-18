import { generateExplanation } from "../server/services/aiService.js";
import { json, preflight, readJsonBody } from "./_utils.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return preflight(res);
  }

  if (req.method !== "POST") {
    return json(res, 405, {
      error: "Use POST /api/explain with JSON body: { input, lang }",
      allowed_methods: ["POST"],
      example: {
        input: "NameError: name 'x' is not defined",
        lang: "Hinglish"
      }
    });
  }

  try {
    const body = await readJsonBody(req);
    const { input, lang } = body;

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return json(res, 400, {
        error: "input is required and must be a non-empty string"
      });
    }

    if (!lang || !["Hindi", "Hinglish", "English"].includes(lang)) {
      return json(res, 400, {
        error: "lang must be Hindi, Hinglish, or English"
      });
    }

    const result = await generateExplanation(input.trim(), lang);
    return json(res, 200, result);
  } catch (error) {
    console.error("Vercel explain error:", error.message);
    return json(res, 200, {
      response_mode: "fallback",
      meaning: "AI explanation generate nahi ho payi, lekin basic help yahan hai.",
      analogy: "Jaise offline mode mein basic features chalte hain.",
      cause: "Backend service temporary issue ho rahi hai.",
      fix_steps: "1. Apna error message phir se paste karo\n2. Kuch seconds wait karke dobara try karo\n3. Agar dobara fail ho to browser console (F12) dekho",
      example_code: "// Apna code yahan paste karo",
      summary: "Server busy hai, dubara try karo."
    });
  }
}