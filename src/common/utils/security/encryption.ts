import { env } from "@services";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
const ENCRYPTION_KEY = Buffer.from(env.encryptionKey, "hex");
const IV_LENGTH = 16;

class EncryptionService {
  encrypt(text: string): string {
    const iv = randomBytes(IV_LENGTH);

    const cipher = createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(text, "utf8", "hex");

    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return iv.toString("hex") + ":" + encrypted + ":" + authTag.toString("hex");
  }

  decrypt(text: string): string {
    const [ivHex, encryptedText, authTagHex] = text.split(":");

    const iv = Buffer.from(ivHex!, "hex");

    const authTag = Buffer.from(authTagHex!, "hex");

    const decipher = createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv, {
      authTagLength: IV_LENGTH,
    });

    decipher.setAuthTag(authTag);

    let decrypted: string = decipher.update(encryptedText!, "hex", "utf8");

    decrypted += decipher.final("utf8");

    return decrypted;
  }
}

export default new EncryptionService();
