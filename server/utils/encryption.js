import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// AES-256-GCM settings
const ivLength = 16; // 128 bits
const algorithm = "aes-256-gcm";

// Validate and load encryption key from environment
if (!process.env.DATA_ENC_KEY) {
  throw new Error("❌ Missing DATA_ENC_KEY in environment variables.");
}

const ENC_KEY = Buffer.from(process.env.DATA_ENC_KEY, "hex");

if (ENC_KEY.length !== 32) {
  throw new Error(
    "❌ DATA_ENC_KEY must be a 64-character hex string (32 bytes)."
  );
}

/**
 * Encrypts plain text using AES-256-GCM
 * @param {string} plain - Plain text to encrypt
 * @returns {string} Encrypted string: iv:authTag:cipherText
 */
export const encrypt = (plain = "") => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, ENC_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
};

/**
 * Decrypts AES-256-GCM encrypted string
 * @param {string} enc - Encrypted string (iv:authTag:data)
 * @returns {string} Decrypted plain text
 */
export const decrypt = (enc = "") => {
  const [ivHex, tagHex, dataHex] = enc.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const encryptedText = Buffer.from(dataHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, ENC_KEY, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
