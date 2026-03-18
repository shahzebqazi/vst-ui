const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const js = fs.readFileSync(path.join(__dirname, "shell.js"), "utf8");

test("chromeless mockups add phone-frame--chromeless and load URL in iframe", function () {
  assert.ok(js.includes('phoneFrame.classList.add("phone-frame--chromeless")'));
  assert.ok(js.includes("iframe.src = url"));
});

test("standard mockups remove phone-frame--chromeless", function () {
  assert.ok(js.includes('phoneFrame.classList.remove("phone-frame--chromeless")'));
});

test("hideAllMockupViewports clears iframe src", function () {
  assert.ok(js.includes('iframe.src = "about:blank"'));
});
