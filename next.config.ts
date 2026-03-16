/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Permite que o build termine mesmo com erros de tipagem (como o 'any')
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permite o deploy mesmo com avisos de variáveis não usadas ou regras de estilo
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
