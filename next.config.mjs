/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io","ufs.sh", "vqu3gque1q.ufs.sh"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
};

export default nextConfig;
