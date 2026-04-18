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
      return res.status(500).json({
        error: "OPENAI_API_KEY is missing. Add it in server/.env.local and restart server."
      });
    }
    return res.status(500).json({
      error: "Internal server error. Please try again."
    });
  }
};
