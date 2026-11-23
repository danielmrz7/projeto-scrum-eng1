// better-sqlite3 é um módulo nativo: precisa rodar fora do bundle do Next.js.
export default {
  experimental: { serverComponentsExternalPackages: ["better-sqlite3"] },
};
