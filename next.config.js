/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_KEY: "", // PINATA API KEY
    NEXT_PUBLIC_API_SECRET: "", // PINATA API SECRET
    NEXT_PUBLIC_CYBERCONNECT_API_KEY: "", // CyberConnect API KEY
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: "https://api.cyberconnect.dev/testnet/",
    NEXT_PUBLIC_CHAIN_ID: 97
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

module.exports = nextConfig
