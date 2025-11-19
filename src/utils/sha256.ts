export async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const cryptoObj = globalThis.crypto;

  if (!cryptoObj?.subtle)
    throw new Error("WebCrypto SHA-256 is not available in this environment.");

  const digest = await cryptoObj.subtle.digest(
    "SHA-256",
    data as unknown as BufferSource
  );

  return new Uint8Array(digest);
}
