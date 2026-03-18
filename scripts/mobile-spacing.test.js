const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const css = fs.readFileSync("/home/sqazi/vst-ui/styles/backgrounds.css", "utf8");

test("narrow viewport lets the menu use full available width", function () {
  assert.match(
    css,
    /@media \(max-width: 767px\)[\s\S]*\.app-shell--intro \.left-panel--stack,\s*\.app-shell--split-narrow \.left-panel--stack \{[\s\S]*max-width:\s*none;/
  );
});

test("narrow intro viewport keeps top spacing aligned with shell padding", function () {
  assert.match(
    css,
    /@media \(max-width: 767px\)[\s\S]*\.app-shell--intro \.left-panel--stack \{[\s\S]*margin-top:\s*16px;/
  );
});
