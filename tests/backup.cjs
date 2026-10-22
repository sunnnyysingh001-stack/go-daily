const ts = require("typescript"),
  fs = require("fs"),
  assert = require("node:assert/strict"),
  vm = require("vm");
const source = ts.transpileModule(
  fs.readFileSync("lib/account-backup.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
const ctx = { exports: {} };
vm.runInNewContext(source, ctx);
const validate = ctx.exports.validateBackup;
const good = {
  progress: { chapter: { answers: { q: 2 }, index: 1, updated: "2026-10-15" } },
  bookmarks: {
    a: {
      id: "a",
      title: "A",
      href: "/news",
      kind: "News",
      saved: "2026-10-15",
    },
  },
  "drafts:gs1:history": { 0: "Answer" },
  "reviews:gs1:history": { 0: ["Evidence"] },
};
assert.equal(validate(good), good);
for (const bad of [
  { progress: { x: { answers: null } } },
  {
    bookmarks: {
      x: {
        id: "x",
        title: "x",
        href: "javascript:alert(1)",
        kind: "News",
        saved: "",
      },
    },
  },
  { "drafts:gs1:history": { 0: 4 } },
  JSON.parse('{"progress":{"__proto__":{}}}'),
  { unknown: {} },
  { "reviews:gs1:history": { 0: [1] } },
])
  assert.throws(() => validate(bad));
console.log(
  "Backup validation: valid export accepted; six invalid/unsafe cases rejected.",
);
