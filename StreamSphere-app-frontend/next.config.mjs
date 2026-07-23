/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    domains: [
      "d1s22etkak2nxm.cloudfront.net",
      "54.234.119.192",
      "13.232.73.126",
    ],
  },
};

export default nextConfig;