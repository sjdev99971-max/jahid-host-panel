import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: "https://www.jahid.host",
    NEXTAUTH_SECRET: "super_secret_jahid_host_2026_xyz123",
  },
};

export default nextConfig;
