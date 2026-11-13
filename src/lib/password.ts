import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";

function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    nodeScrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key));
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(32).toString("hex");
  const key = await derive(password, salt);
  return `scrypt:${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, salt, encoded, extra] = stored.split(":");
  if (algorithm !== "scrypt" || !salt || !encoded || extra || !/^[a-f0-9]{64}$/.test(salt) || !/^[a-f0-9]{128}$/.test(encoded)) return false;
  const candidate = await derive(password, salt);
  return timingSafeEqual(candidate, Buffer.from(encoded, "hex"));
}
