const { withContentlayer } = require("next-contentlayer");

const prefix =
    process.env.NODE_ENV === "production"
        ? "/myb-blog"
        : "";

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: "export",
    basePath: prefix,
    assetPrefix: prefix,
};

module.exports = withContentlayer(nextConfig);
