/** @type {import('next').NextConfig} */
const nextConfig = {
   allowedDevOrigins: ["192.168.62.209"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:"res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
