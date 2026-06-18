import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const clientRoot = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = dirname(clientRoot);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
