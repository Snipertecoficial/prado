// Temporary utility to generate password hash
// This will log the correct hash to the console

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const generatePasswordHash = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password.trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return toHex(hashBuffer);
};

// Auto-execute to generate the hash for "Admin213021#"
(async () => {
  const hash = await generatePasswordHash("Admin213021#");
  console.log("=== HASH CORRETO PARA A SENHA Admin213021# ===");
  console.log(hash);
  console.log("==============================================");
})();
