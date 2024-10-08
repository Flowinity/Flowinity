import proxyflare from "@flaregun-net/proxyflare-for-pages"

const routes: Route[] = [
    {
      from: {
        pattern: "/api/v3/*",
        alsoMatchWWWSubdomain: true,
      },
      to: { url: "https://api.flowinity.com/v3" },
    },
    {
        from: {
          pattern: "/i/*",
          alsoMatchWWWSubdomain: true,
        },
        to: { url: "https://api.flowinity.com/v3/i" },
    },
    {
        from: {
          pattern: "/graphql/*",
          alsoMatchWWWSubdomain: true,
        },
        to: { url: "https://api.flowinity.com/graphql" },
    },
    {
        from: {
          pattern: "/graphql",
          alsoMatchWWWSubdomain: true,
        },
        to: { url: "https://api.flowinity.com/graphql" },
    },
    {
        from: {
          pattern: "/gateway/*",
          alsoMatchWWWSubdomain: true,
        },
        to: { url: "https://api.flowinity.com/graphql" },
    },
    {
        from: {
          pattern: "/gateway",
          alsoMatchWWWSubdomain: true,
        },
        to: { url: "https://api.flowinity.com/graphql" },
    },
    {
        from: {
          pattern: "/.well-known/*",
          alsoMatchWWWSubdomain: true,
        },
        to: { url: "https://api.flowinity.com/v3/.well-known" },
    },
  ]

// `PagesFunction` is from @cloudflare/workers-types
export const onRequest: PagesFunction[] = [
  (context) =>
    proxyflare({
      config: {
        global: { debug: true },
        routes,
      },
    })(context),
  // other Pages plugins and middleware
]
