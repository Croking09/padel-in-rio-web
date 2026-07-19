import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.padelinrio.com",
      lastModified: new Date(),
    },
    {
      url: "https://www.padelinrio.com/liga",
      lastModified: new Date(),
    },
    {
      url: "https://www.padelinrio.com/torneos",
      lastModified: new Date(),
    },
    {
      url: "https://www.padelinrio.com/asociacion",
      lastModified: new Date(),
    },
    {
      url: "https://www.padelinrio.com/equipo",
      lastModified: new Date(),
    },
  ];
}
