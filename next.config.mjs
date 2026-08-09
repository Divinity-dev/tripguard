/** @type {import('next').NextConfig} */
const nextConfig = {
   allowedDevOrigins: ["192.168.75.209"],
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
