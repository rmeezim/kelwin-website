import type { NextConfig } from "next";

// Static export so the site can be hosted on GitHub Pages.
// NEXT_PUBLIC_BASE_PATH is set by the Pages workflow (e.g. "/kelwin-website")
// so assets and links resolve under the repo subpath; locally it stays "".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
