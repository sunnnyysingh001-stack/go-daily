function record(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}
function safeKeys(x: unknown) {
  if (!x || typeof x !== "object") return;
  for (const [k, v] of Object.entries(x)) {
    if (["__proto__", "constructor", "prototype"].includes(k))
      throw Error("Invalid backup key");
    safeKeys(v);
  }
}
export function validateBackup(input: unknown): Record<string, unknown> {
  if (!record(input)) throw Error("Invalid backup");
  if (JSON.stringify(input).length > 1000000)
    throw Error("Backup exceeds 1 MB");
  safeKeys(input);
  const entries = Object.entries(input);
  if (entries.length > 300) throw Error("Backup contains too many records");
  for (const [key, value] of entries) {
    if (
      !/^(progress|bookmarks|drafts:[a-z0-9-]+:[a-z0-9-]+|reviews:[a-z0-9-]+:[a-z0-9-]+)$/.test(
        key,
      ) ||
      !record(value)
    )
      throw Error("Invalid study record");
    for (const item of Object.values(value)) {
      if (
        key === "progress" &&
        (!record(item) ||
          !record(item.answers) ||
          !Number.isInteger(item.index) ||
          Number(item.index) < 0 ||
          typeof item.updated !== "string" ||
          Object.values(item.answers).some(
            (a) => !Number.isInteger(a) || Number(a) < 0 || Number(a) > 3,
          ))
      )
        throw Error("Invalid progress");
      if (key.startsWith("drafts:") && typeof item !== "string")
        throw Error("Invalid draft");
      if (
        key.startsWith("reviews:") &&
        (!Array.isArray(item) || item.some((v) => typeof v !== "string"))
      )
        throw Error("Invalid review");
      if (key === "bookmarks") {
        if (
          !record(item) ||
          ["id", "title", "href", "kind", "saved"].some(
            (k) => typeof item[k] !== "string",
          )
        )
          throw Error("Invalid bookmark");
        const href = item.href as string;
        if (
          !["Question", "Chapter", "News"].includes(item.kind as string) ||
          !(
            (href.startsWith("/") &&
              !href.startsWith("//") &&
              !href.includes("\\")) ||
            href.startsWith("https://")
          )
        )
          throw Error("Unsafe bookmark link");
      }
    }
  }
  return input;
}
