module.exports = {
  siteUrl: process.env.SITE_URL || "https://bionicosjuicesrios.com",
  generateRobotsTxt: true, // (optional)
  exclude: [
    "_app.js",
    "_document.js",
    "_error.js",
    "sitemap.xml.js",
    "account/admin/customers",
    "account/admin/orders",
    "orders",
    "dashboard.js",
    "secret.js",
    "thankyou.js",
    "orders.js",
    "checkout.js",
    "api.js",
    "api",
    "admin.js",
    "404.js",
    "account",
  ],
};
