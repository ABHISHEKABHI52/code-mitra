import express from "express";
import { explain } from "../controllers/explainController.js";

const router = express.Router();

router.get("/explain", (_req, res) => {
	res.status(405).json({
		error: "Use POST /api/explain with JSON body: { input, lang }",
		allowed_methods: ["POST"],
		example: {
			input: "NameError: name 'x' is not defined",
			lang: "Hinglish"
		}
	});
});

router.post("/explain", explain);

export default router;
