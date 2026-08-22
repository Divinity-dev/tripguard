/** @type {import('next').NextConfig} */
const nextConfig = {
   allowedDevOrigins: ["192.168.62.209"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
