/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // transformers.js depends on onnxruntime-node (native binary) and sharp (image
  // processing) on the server side, but in our app it only ever runs in the
  // browser. Tell webpack to leave those alone on the server build, and ignore
  // the .node binary files entirely on the client build.
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't try to bundle native node modules on the server.
      config.externals = [
        ...(config.externals || []),
        "onnxruntime-node",
        "sharp",
      ];
    } else {
      // Client-side fallbacks for node built-ins that transformers.js references.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Ignore .node binary files in any bundle context.
    config.module.rules.push({
      test: /\.node$/,
      loader: "ignore-loader",
    });

    return config;
  },

  // transformers.js's onnxruntime-web uses SharedArrayBuffer for multithreaded
  // WASM, which requires these COOP/COEP headers. Safe to keep on always.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;