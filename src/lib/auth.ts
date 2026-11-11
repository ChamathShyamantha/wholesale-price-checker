export const AUTH_COOKIE = "wpc_auth";

/** Token stored in the cookie: a hash of the shared password, so the password itself is never stored. */
export async function authToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`wholesale-price-checker:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}
