/** @type {import('next').NextConfig} */
const isProduction = globalThis.process?.env?.NODE_ENV === "production"

const nextConfig = {
  transpilePackages: ["@workspace/ui"],

  // Enable standalone output for Docker builds
  // Comment out or remove for development builds
  ...(isProduction && {
    output: "standalone",
  }),
}

export default nextConfig
