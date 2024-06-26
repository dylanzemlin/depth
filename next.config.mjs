/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ui-avatars.com"
            },
            {
                protocol: "https",
                hostname: "lh*.googleusercontent.com"
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com"
            }
        ]
    }
};

export default nextConfig;
