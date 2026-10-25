import { site } from "@/app/(config)/site";
import { JsonLd } from "@/app/(ui)/components/json-ld";

export type Crumb = { name: string; path: string };
export type PageType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "ProfilePage";

// One @graph per page: the WebPage (with freshness + speakable answer) linked to the site
// entity, plus its BreadcrumbList. Entities link by @id so engines see one consistent business.
export function PageSchema({
  path,
  name,
  description,
  type = "WebPage",
  updated = site.contentUpdated,
  published,
  crumbs,
}: {
  path: string;
  name: string;
  description?: string;
  type?: PageType;
  updated?: string;
  published?: string;
  crumbs?: Crumb[];
}) {
  const url = `${site.url}${path}`;
  const graph: unknown[] = [
    {
      "@type": type,
      "@id": `${url}#webpage`,
      url,
      name,
      ...(description ? { description } : {}),
      inLanguage: "en-IN",
      ...(published ? { datePublished: published } : {}),
      dateModified: updated,
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": `${site.url}/#business` },
      publisher: { "@id": `${site.url}/#business` },
      ...(crumbs ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["[data-answer-block]"] },
    },
  ];
  if (crumbs) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: `${site.url}${c.path}`,
      })),
    });
  }
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}
