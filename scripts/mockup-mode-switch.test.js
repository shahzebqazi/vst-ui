const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const js = fs.readFileSync("/home/sqazi/vst-ui/scripts/shell.js", "utf8");

test("switching to chromeless clears the standard mockup iframe", function () {
  assert.match(
    js,
    /if \(chromeless && chromelessIframe\) \{[\s\S]*chromelessIframe\.src = url;[\s\S]*iframe\.src = "about:blank";/
  );
});

test("switching to standard mockups clears the chromeless iframe", function () {
  assert.match(
    js,
    /else \{[\s\S]*setViewportMode\(false\);[\s\S]*iframe\.src = url;[\s\S]*chromelessIframe\.src = "about:blank";/
  );
});
