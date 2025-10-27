export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL || "https://ml-tprep.vercel.app",
      applicationID: "convex",
    },
  ],
};
