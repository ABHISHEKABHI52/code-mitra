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
  const connectionString = sanitizeConnectionString(process.env.DATABASE_URL);
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  const tableCheck = await client.query("select to_regclass('public.todos') as table_name");
  console.log("table_name:", tableCheck.rows[0].table_name);

  if (!tableCheck.rows[0].table_name) {
    console.log("todos table not found. Run supabase/setup.sql in SQL Editor.");
    await client.end();
    process.exit(0);
  }

  const marker = `codemitra-smoke-${Date.now()}`;

  const ins = await client.query(
    "insert into public.todos (user_id, title, is_done) values ($1, $2, $3) returning id, title, is_done, created_at",
    [null, marker, false]
  );
  console.log("inserted:", ins.rows[0]);

  const sel = await client.query(
    "select id, title, is_done from public.todos where title = $1 order by id desc limit 1",
    [marker]
  );
  console.log("selected:", sel.rows[0]);

  await client.query("delete from public.todos where title = $1", [marker]);
  console.log("cleanup: deleted test row");

  await client.end();
}

run().catch(async (error) => {
  console.error("db test error:", error.message);
  process.exit(1);
});
