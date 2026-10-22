import seed from "../../../data/news-seed.json";
import curated from "../../../data/current-affairs-seed.json";
import { newsPublisher, type NewsItem } from "../../../lib/news";
export async function GET() {
  const javaOrigin = process.env.JAVA_API_URL;
  if (javaOrigin) {
    try {
      const upstream = await fetch(new URL("/api/news", javaOrigin), {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!upstream.ok) throw new Error("Content API unavailable");
      const data = await upstream.json();
      if (!Array.isArray(data.items))
        throw new Error("Invalid content API response");
      return Response.json(data, { headers: { "Cache-Control": "no-store" } });
    } catch {
      return Response.json(
        { error: "News service temporarily unavailable" },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  const entries = new Map<string, NewsItem>();
  let message = "Showing the manually published archive.";

  for (const n of seed.items) if (!entries.has(n.id)) entries.set(n.id, n);
  for (const n of curated.items as NewsItem[]) entries.set(n.id, n);
  const items = [...entries.values()]
    .filter((n) => newsPublisher(n))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  const curation = {
    checked: curated.checked,
    edition: curated.edition,
    status: "partial",
    note: curated.note,
    count: curated.items.filter((n) => n.date.slice(0, 10) === curated.edition)
      .length,
  };
  return Response.json(
    {
      items,
      checked: curated.checked,
      status: "manual",
      message,
      lastSuccessfulCheck: null,
      curation,
      latestPublished: items[0]?.date || null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
