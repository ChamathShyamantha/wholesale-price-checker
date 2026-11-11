import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wholesale Price Checker",
    short_name: "Prices",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f6f4",
    theme_color: "#0f7b5f",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
