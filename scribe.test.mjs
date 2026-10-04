import { afterEach, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const fixtures = [];

afterEach(() => {
  for (const fixture of fixtures.splice(0)) {
    rmSync(fixture, { recursive: true, force: true });
  }
});

function audit(source) {
  const fixture = mkdtempSync(join(tmpdir(), "scribe-module-doc-"));
  fixtures.push(fixture);
  writeFileSync(join(fixture, "api.js"), source);
  const result = spawnSync(
    "zsh",
    [
      join(import.meta.dir, "bin/scribe"),
      "--root",
      fixture,
      "--format",
      "json",
    ],
    { encoding: "utf8" },
  );
  if (result.error) throw result.error;
  return { exit: result.status, report: JSON.parse(result.stdout) };
}

test("module documentation after an ESLint directive covers generated exports", () => {
  const result = audit(`/* eslint-disable */
/** Generated references for public and internal Convex functions. */
export const api = {};
export const internal = {};
`);
  expect(result.exit).toBe(0);
  expect(result.report.documented).toBe(2);
  expect(result.report.coverage).toBe(100);
});

test("ESLint directives alone do not document public exports", () => {
  const result = audit(`/* eslint-disable import/no-anonymous-default-export */
export const undocumented = {};
`);
  expect(result.exit).toBe(1);
  expect(result.report.missing).toBe(1);
});

test("a docblock on one symbol does not cover later undocumented exports", () => {
  const result = audit(`/* eslint-disable */
import { anyApi } from "convex/server";
/** Public function references. */
export const api = anyApi;
export const undocumented = anyApi;
`);
  expect(result.exit).toBe(1);
  expect(result.report.documented).toBe(1);
  expect(result.report.missing).toBe(1);
});

test("ordinary comments are not treated as module documentation", () => {
  const result = audit(`/* eslint-disable */
// Generated references without a documentation block.
export const undocumented = {};
`);
  expect(result.exit).toBe(1);
  expect(result.report.missing).toBe(1);
});
