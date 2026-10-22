import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: "https://jahid.host", 
    NEXTAUTH_SECRET: "super_secret_jahid_host_2026_xyz123",
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.jahid.host" }],
        destination: "https://jahid.host/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
