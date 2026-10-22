import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    // আপনার মেইন ডোমেইন (www ছাড়া)
    NEXTAUTH_URL: "https://jahid.host",
    NEXTAUTH_SECRET: "super_secret_jahid_host_2026_xyz123",
  },
  // redirects() অংশটি মুছে দেওয়া হয়েছে যাতে Vercel-এর সাথে কনফ্লিক্ট না হয়
};

export default nextConfig;
