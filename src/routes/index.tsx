import { createFileRoute } from "@tanstack/react-router";
import { SitemapPage } from "./sitemap";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eagle Claims — Demo navigation" },
      {
        name: "description",
        content:
          "Every route in the Eagle Claims demo, grouped by audience.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SitemapPage,
});
