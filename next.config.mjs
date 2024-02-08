/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY: process.envNEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
