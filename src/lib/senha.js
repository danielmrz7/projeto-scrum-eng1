import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Senhas nunca são gravadas em texto puro: armazenamos "salt:hash" (scrypt).
export function gerarHash(senha) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(senha, salt, 64).toString("hex")}`;
}

export function conferirSenha(senha, armazenado) {
  const [salt, hash] = String(armazenado).split(":");
  if (!salt || !hash) return false;
  const esperado = Buffer.from(hash, "hex");
  const calculado = scryptSync(String(senha), salt, esperado.length);
  return timingSafeEqual(esperado, calculado);
}
