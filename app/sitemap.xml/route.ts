import { studyPages, routeHref, siteOrigin } from "../../lib/site-pages";
export function GET() {
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    studyPages
      .map(
        (p) => "<url><loc>" + siteOrigin + routeHref(p.route) + "</loc></url>",
      )
      .join("") +
    "</urlset>";
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
