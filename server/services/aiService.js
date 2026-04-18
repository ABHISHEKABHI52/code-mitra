import OpenAI from "openai";
import { buildPrompt } from "./promptService.js";

const fallbackResponse = {
  meaning: "Program us line ko samajh nahi paaya jahan error aaya.",
  analogy: "Jaise galat address likhne par parcel deliver nahi hota.",
  cause: "Input me exact context ya variable setup missing lag raha hai.",
  fix_steps: "1. Error line dhyan se dekho\n2. Missing variable ya syntax add karo\n3. Dubara run karke next error fix karo",
  example_code: "let x = 10;\nconsole.log(x);",
  summary: "Use karne se pehle cheez define karo."
};

export const generateExplanation = async (input, lang) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing in server/.env.local");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = buildPrompt(input, lang);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 700,
    messages: [{ role: "user", content: prompt }]
  });

  const raw = response.choices?.[0]?.message?.content || "";
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      meaning: parsed.meaning || fallbackResponse.meaning,
      analogy: parsed.analogy || fallbackResponse.analogy,
      cause: parsed.cause || fallbackResponse.cause,
      fix_steps: parsed.fix_steps || fallbackResponse.fix_steps,
      example_code: parsed.example_code || fallbackResponse.example_code,
      summary: parsed.summary || fallbackResponse.summary
    };
  } catch {
    return fallbackResponse;
  }
};
