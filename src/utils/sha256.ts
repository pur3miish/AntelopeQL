export default async function sha256(data: Uint8Array): Promise<Uint8Array> {
  // Browser or Edge Runtime
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", data);
    return new Uint8Array(digest);
  }

  // Node.js (uses built-in `crypto`)
  if (typeof process !== "undefined" && process.versions?.node) {
    const { createHash } = await import("node:crypto");
    const hash = createHash("sha256").update(data).digest();
    return new Uint8Array(hash);
  }

  throw new Error("SHA-256 is not supported in this environment.");
}
