/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  devIndicators: false,
  output: "standalone",
}

export default nextConfig
