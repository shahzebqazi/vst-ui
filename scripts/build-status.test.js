const test = require("node:test");
const assert = require("node:assert/strict");

const status = require("./build-status.js");

test("formatBuildStatusText uses latest commit sha as build ID", function () {
  const text = status.formatBuildStatusText(
    { label: "GitHub Pages", fallbackBuildId: "deadbeef" },
    { sha: "9d33387abcdef1234567890" }
  );

  assert.equal(text, "GitHub Pages: build 9d33387");
});

test("formatBuildStatusText falls back when API data is unavailable", function () {
  const text = status.formatBuildStatusText({
    label: "GitHub Pages",
    fallbackBuildId: "1234567890abcdef",
  });

  assert.equal(text, "GitHub Pages: build 1234567");
});

test("buildCommitApiUrl targets the configured branch", function () {
  const url = status.buildCommitApiUrl({
    owner: "shahzebqazi",
    repo: "vst-ui",
    branch: "main",
  });

  assert.equal(url, "https://api.github.com/repos/shahzebqazi/vst-ui/commits/main");
});
