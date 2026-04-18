import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

function sanitizeConnectionString(rawUrl) {
  if (!rawUrl) return rawUrl;
  try {
    const parsed = new URL(rawUrl);
    parsed.searchParams.delete("sslmode");
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

async function run() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sqlPath = path.resolve(__dirname, "..", "..", "supabase", "setup.sql");
  const sqlText = await fs.readFile(sqlPath, "utf8");

  const client = new Client({
    connectionString: sanitizeConnectionString(process.env.DATABASE_URL),
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  await client.query(sqlText);
  await client.end();

  console.log("Applied setup.sql successfully.");
}

run().catch((error) => {
  console.error("apply setup.sql error:", error.message);
  process.exit(1);
});
