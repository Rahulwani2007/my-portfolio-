// Minimal MCP client stub for secure server-side flows.
// Fill in MCP server URL and endpoints in env.

const MCP_BASE = process.env.NEXT_PUBLIC_MCP_BASE || "https://mcp.example.com";

export async function exchangeToken(idToken: string) {
  // Example: send idToken to MCP server for secure session creation
  const res = await fetch(`${MCP_BASE}/api/auth/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("MCP exchange failed");
  return res.json();
}

export async function createProfileOnMCP(profile: any) {
  const res = await fetch(`${MCP_BASE}/api/profile/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("MCP profile create failed");
  return res.json();
}
