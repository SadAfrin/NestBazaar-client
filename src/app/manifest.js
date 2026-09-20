export default function manifest() {
  return {
    name: "NB NestBazaar",
    short_name: "NestBazaar",
    description: "Your trusted second-hand marketplace",
    start_url: "/",
    display: "standalone",
    background_color: "#f8faf9",
    theme_color: "#059669",
    icons: [
      {
        src: "/favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        src: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        src: "/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  };
}
