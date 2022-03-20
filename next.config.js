const withPWA = require("next-pwa");

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // {
  //   key: "Content-Security-Policy",
  //   value: "default-src; self'",
  // },
];

module.exports = withPWA({
  pwa: {
    dest: "public",
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "s3-media1.fl.yelpcdn.com",
      "s3-media3.fl.yelpcdn.com",
      "res.cloudinary.com",
    ],
  },
});
