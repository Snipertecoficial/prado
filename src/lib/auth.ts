const DEFAULT_SECRET_HASH = "16175223c8ddce5ace0493c948569c211b03c4c6bb3d3e484434999448cffe01";

// Admin user credentials - configured via environment variables
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

const getSecretHash = () => {
  const configured = import.meta.env.VITE_ADMIN_SHARED_SECRET_HASH;
  if (typeof configured === "string" && configured.trim().length > 0) {
    return configured.trim().toLowerCase();
  }

  return DEFAULT_SECRET_HASH;
};

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const hashSecret = async (secret: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret.trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return toHex(hashBuffer);
};

export const verifyAdminSecret = async (secret: string) => {
  if (!secret.trim()) return false;

  const secretHash = await hashSecret(secret);
  return secretHash === getSecretHash();
};

// New email + password authentication
export const verifyAdminCredentials = async (email: string, password: string) => {
  if (!email.trim() || !password.trim()) return false;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) return false;

  // Hash the input password and compare with stored hash
  const passwordHash = await hashSecret(password);

  // Check if email and password hash match the configured admin credentials
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && 
         passwordHash === ADMIN_PASSWORD_HASH.toLowerCase();
};
