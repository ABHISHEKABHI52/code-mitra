import { generateExplanation } from "../services/aiService.js";

export const explain = async (req, res) => {
  try {
    const { input, lang } = req.body;

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return res.status(400).json({
        error: "input is required and must be a non-empty string"
      });
    }

    if (!lang || !["Hindi", "Hinglish", "English"].includes(lang)) {
      return res.status(400).json({
        error: "lang must be Hindi, Hinglish, or English"
      });
    }

    const result = await generateExplanation(input.trim(), lang);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Controller error:", err.message);
    if (err.message.includes("OPENAI_API_KEY is missing")) {
      // Return fallback on missing API key
      return res.status(200).json({
        response_mode: "fallback",
        meaning: "Apke backend me OpenAI API key nahi hai.",
        analogy: "Jaise lock ke bina door khol na sakte.",
        cause: "OPENAI_API_KEY environment variable missing hai.",
        fix_steps: "1. Server folder mein .env.local file check karo\n2. OPENAI_API_KEY add karo\n3. Server restart karo",
        example_code: "OPENAI_API_KEY=sk-xxxxx",
        summary: "API key add karke server restart karo."
      });
    }
    // Return fallback for any error instead of 500
    console.warn("Returning fallback explanation due to error:", err.message);
    return res.status(200).json({
      response_mode: "fallback",
      meaning: "AI explanation generate nahi ho payi, lekin basic help yahan hai.",
      analogy: "Jaise offline mode mein basic features chalte hain.",
      cause: "Backend service temporary issue ho rahi hai.",
      fix_steps: "1. Apna error message phir se paste karo\n2. Kuch seconds wait karke dobara try karo\n3. Agar dobara fail ho to browser console (F12) dekho",
      example_code: "// Apna code yahan paste karo",
      summary: "Server busy hai, dubara try karo."
    });
  }
};
