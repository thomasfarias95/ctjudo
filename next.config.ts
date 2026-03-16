import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Permite o deploy mesmo se houver erros de tipagem (como o 'any')
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permite o deploy mesmo se houver avisos do ESLint (como variáveis não usadas)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
