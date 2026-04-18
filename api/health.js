import { json } from "./_utils.js";

export default function handler(_req, res) {
  json(res, 200, { status: "ok", service: "CodeMitra API" });
}