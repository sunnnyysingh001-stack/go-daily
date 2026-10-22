export type NewsItem = {
  id: string;
  title: string;
  url: string;
  date: string;
  subject: string;
  chapter: string;
  focus: string;
  source: string;
  kind?: "video" | "official" | "article";
  dateBasis?: "published" | "edition" | "observed";
  mains?: string;
  note?: string;
  evidence?: "reference" | "reviewed";
  summary?: string;
};
const rules: [RegExp, string, string, string][] = [
  [
    /\brbi\b|\brepo\b|banking|central bank|monetary|interest rate|inflation/i,
    "economy",
    "banking",
    "Revise monetary-policy tools, price indices, banking regulation and the difference between liquidity and solvency.",
  ],
  [
    /gst|tax|budget|fiscal|trade|tariff|export|import|gdp|econom/i,
    "economy",
    "fiscal-trade",
    "Connect the report to taxation, fiscal federalism, the external sector and the difference between an announcement and a notified rule.",
  ],
  [
    /cheetah|tiger|species|wildlife|biodiversity|national park|conservation/i,
    "environment",
    "biodiversity",
    "Locate the habitat; revise in-situ conservation, protected-area categories and the role of relevant conservation institutions.",
  ],
  [
    /climate|emission|pollution|carbon|ozone|renewable|cop\d|environment|nicobar/i,
    "environment",
    "climate",
    "Distinguish mitigation from adaptation. Review environmental assessment, treaties and the responsible institutions.",
  ],
  [
    /supreme court|high court|constitution|parliament|election commission|\bcec\b|electoral|citizenship|tribunal|judicial|rights/i,
    "polity",
    "institutions",
    "Identify the constitutional provision, institution and its powers. Distinguish a court observation from the operative order.",
  ],
  [
    /nobel|neutrino|space|satellite|isro|genome|vaccine|quantum|semiconductor|artificial intelligence|starlink|science|technology/i,
    "science",
    "technology",
    "Focus on the underlying scientific principle, its application and limitations rather than names alone.",
  ],
  [
    /monsoon|river|earthquake|cyclone|geograph|ocean|flood|drought/i,
    "geography",
    "physical",
    "Locate places on a map and connect the event to climate, drainage, tectonics or ocean processes.",
  ],
  [
    /poverty|nutrition|education|public health|employment|census|demograph|sanitation|welfare/i,
    "economy",
    "social",
    "Distinguish coverage from outcomes; identify the indicator, target population and implementing institution.",
  ],
  [
    /archaeolog|heritage|ancient|museu|temple|histor/i,
    "history",
    "medieval-culture",
    "Revise period, location, patronage and defining cultural features; compare related sites and traditions.",
  ],
  [
    /united nations|\bun\b|treaty|bilateral|summit|diplomat|asean|brics|g20|maritime|security council|peacekeeping/i,
    "current",
    "international",
    "Locate participating states; revise the organisation’s mandate, membership and the difference between binding and non-binding outcomes.",
  ],
];
export function classify(title: string) {
  const row = rules.find(([r]) => r.test(title));
  return row ? { subject: row[1], chapter: row[2], focus: row[3] } : null;
}
function clean(x: string) {
  return x
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .trim();
}
export function parseFeed(xml: string): NewsItem[] {
  const result: NewsItem[] = [];
  for (const block of xml.match(/<item>[\s\S]*?<\/item>/g) || []) {
    const get = (tag: string) =>
      clean(
        block.match(
          new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag + ">"),
        )?.[1] || "",
      );
    const source = get("source");
    if (source !== "The Hindu") continue;
    let title = get("title")
      .replace(/\s*-\s*The Hindu\s*$/i, "")
      .trim();
    const topic = classify(title),
      url = get("link"),
      date = new Date(get("pubDate"));
    if (!topic || !title || isNaN(date.getTime())) continue;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:") continue;
      const host = parsed.hostname;
      if (
        host !== "news.google.com" &&
        host !== "www.thehindu.com" &&
        host !== "thehindu.com"
      )
        continue;
    } catch {
      continue;
    }
    const words = title.split(/\s+/);
    if (words.length > 23) title = words.slice(0, 23).join(" ") + "…";
    const id = url;
    result.push({
      id,
      title,
      url,
      date: date.toISOString(),
      source: "The Hindu · via Google News",
      ...topic,
    });
  }
  return result;
}

// Archived Google News links are allowed only with explicit The Hindu attribution.
export function newsPublisher(
  n: { url: string; source: string; kind?: string },
  allowArchive = true,
): string | null {
  try {
    const u = new URL(n.url);
    if (
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      u.port ||
      n.kind === "video"
    )
      return null;
    const h = u.hostname.replace(/^www\./, "");
    if (
      h === "thehindu.com" &&
      /^The Hindu(?: · via Google News)?$/.test(n.source)
    )
      return "The Hindu";
    if (h === "indianexpress.com" && n.source === "The Indian Express")
      return "The Indian Express";
    if (
      h === "pib.gov.in" &&
      ["PIB", "Press Information Bureau"].includes(n.source)
    )
      return "PIB";
    if (
      allowArchive &&
      h === "news.google.com" &&
      n.source === "The Hindu · via Google News"
    )
      return "The Hindu";
  } catch {}
  return null;
}
