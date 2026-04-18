import dns from "node:dns/promises";
import { URL } from "node:url";
import { Client } from "pg";

function readDatabaseUrl() {
  return process.env.DATABASE_URL || "";
}

function sanitizeDatabaseUrl(databaseUrl) {
  if (!databaseUrl) {
    return "";
  }

  try {
    const parsedUrl = new URL(databaseUrl);
    if (parsedUrl.password) {
      parsedUrl.password = "[hidden]";
    }
    return parsedUrl.toString();
  } catch {
    return databaseUrl.replace(/:[^:@/]*@/, ":[hidden]@");
  }
}

function parseDatabaseUrl(databaseUrl) {
  if (!databaseUrl) {
    return null;
  }

  try {
    return new URL(databaseUrl);
  } catch {
    return null;
  }
}

function buildPgConnectionString(databaseUrl) {
  const parsed = parseDatabaseUrl(databaseUrl);
  if (!parsed) {
    return databaseUrl;
  }

  // If sslmode is present in URL, pg may ignore explicit ssl options.
  parsed.searchParams.delete("sslmode");
  return parsed.toString();
}

export async function getDatabaseStatus() {
  const databaseUrl = readDatabaseUrl();

  if (!databaseUrl) {
    return {
      configured: false,
      connected: false,
      dnsResolved: false,
      host: null,
      message: "DATABASE_URL is missing in server/.env.local"
    };
  }

  const parsedUrl = parseDatabaseUrl(databaseUrl);
  if (!parsedUrl) {
    return {
      configured: true,
      connected: false,
      dnsResolved: false,
      host: null,
      message: "DATABASE_URL is not a valid connection string"
    };
  }

  const host = parsedUrl.hostname;
  const hasPlaceholderPassword = parsedUrl.password.includes("YOUR-PASSWORD") || parsedUrl.password.includes("[YOUR-PASSWORD]");

  if (hasPlaceholderPassword) {
    return {
      configured: true,
      connected: false,
      dnsResolved: false,
      host,
      message: "DATABASE_URL still has a placeholder password. Replace it with the real Supabase database password."
    };
  }

  try {
    const dnsResult = await dns.lookup(host);
    const pgConnectionString = buildPgConnectionString(databaseUrl);
    const client = new Client({
      connectionString: pgConnectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });

    try {
      await client.connect();
      const result = await client.query("select now() as server_time");
      await client.end();

      return {
        configured: true,
        connected: true,
        dnsResolved: true,
        host,
        address: dnsResult.address,
        message: "Database connection is working",
        serverTime: result.rows?.[0]?.server_time || null,
        connectionString: sanitizeDatabaseUrl(databaseUrl)
      };
    } catch (error) {
      await client.end().catch(() => {});
      return {
        configured: true,
        connected: false,
        dnsResolved: true,
        host,
        address: dnsResult.address,
        message: error.message,
        connectionString: sanitizeDatabaseUrl(databaseUrl)
      };
    }
  } catch (error) {
    return {
      configured: true,
      connected: false,
      dnsResolved: false,
      host,
      message: `DNS lookup failed for ${host}: ${error.message}`,
      connectionString: sanitizeDatabaseUrl(databaseUrl)
    };
  }
}