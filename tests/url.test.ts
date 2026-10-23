import { describe, expect, it } from "vitest";
import {
  getAbsoluteUrl,
  getSafeAssetUrl,
  getSafeExternalUrl,
  getSafeMailtoUrl,
  getSiteUrl,
  isExternalHref,
} from "@/lib/url";

describe("safe URL helpers", () => {
  it("accepts HTTP and HTTPS external URLs", () => {
    expect(getSafeExternalUrl("https://example.com/profile")).toBe(
      "https://example.com/profile",
    );
    expect(getSafeExternalUrl("http://example.com")).toBe("http://example.com/");
  });

  it("rejects unsafe or ambiguous external URLs", () => {
    expect(getSafeExternalUrl("javascript:alert(1)")).toBeUndefined();
    expect(getSafeExternalUrl("data:text/html,hello")).toBeUndefined();
    expect(getSafeExternalUrl("//evil.example")).toBeUndefined();
    expect(getSafeExternalUrl("/relative-path")).toBeUndefined();
    expect(getSafeExternalUrl("mailto:not-an-email")).toBeUndefined();
    expect(getSafeExternalUrl("")).toBeUndefined();
  });

  it("accepts valid mailto addresses only", () => {
    expect(getSafeMailtoUrl("mailto:hello@example.com")).toBe(
      "mailto:hello@example.com",
    );
    expect(getSafeExternalUrl("mailto:hello@example.com")).toBe(
      "mailto:hello@example.com",
    );
    expect(getSafeMailtoUrl("https://example.com")).toBeUndefined();
    expect(getSafeMailtoUrl("mailto:broken")).toBeUndefined();
  });

  it("allows same-origin asset paths and safe absolute assets", () => {
    expect(getSafeAssetUrl("/images/work.png")).toBe("/images/work.png");
    expect(getSafeAssetUrl("https://cdn.example.com/image.png")).toBe(
      "https://cdn.example.com/image.png",
    );
    expect(getSafeAssetUrl("javascript:alert(1)")).toBeUndefined();
    expect(getSafeAssetUrl("//evil.example/image.png")).toBeUndefined();
  });

  it("normalizes configured site domains", () => {
    expect(getSiteUrl("")).toBeUndefined();
    expect(getSiteUrl("example.com")).toBe("https://example.com");
    expect(getSiteUrl("https://example.com/path")).toBe("https://example.com");
    expect(getSiteUrl("ftp://example.com")).toBeUndefined();
    expect(getAbsoluteUrl("/about", "example.com")).toBe(
      "https://example.com/about",
    );
    expect(getAbsoluteUrl("/about")).toBe("/about");
  });

  it("identifies external link destinations", () => {
    expect(isExternalHref("https://example.com")).toBe(true);
    expect(isExternalHref("mailto:hello@example.com")).toBe(true);
    expect(isExternalHref("/projects")).toBe(false);
  });
});
