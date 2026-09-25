import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return ["/entrance-frames/:path*", "/room-stream-v2/:path*", "/room-hd-frames/:path*", "/showcase-frames/:path*", "/project-photos/:path*", "/entrance-poster.webp"].map((source) => ({
      source,
      // Unversioned media can refresh daily; repeat visits reuse downloaded frames.
      headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
    }));
  },
};

export default nextConfig;
