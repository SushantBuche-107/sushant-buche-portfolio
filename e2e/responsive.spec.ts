import { expect, test, type Page } from "@playwright/test";

const routes = [
  { path: "/", heading: /building reliable software/i },
  { path: "/about", heading: /engineering software that holds up in production/i },
  { path: "/skills", heading: /skills organized by the work they support/i },
  { path: "/projects", heading: /case studies with the decisions left in/i },
  {
    path: "/projects/portfolio-platform",
    heading: /developer portfolio platform/i,
  },
  {
    path: "/experience",
    heading: /building and supporting software in production/i,
  },
  {
    path: "/resume",
    heading: /sushant buche.*software developer level 2/i,
  },
  { path: "/blog", heading: /technical notes from building and maintaining software/i },
  {
    path: "/blog/yaml-defined-ai-workflows-agentflow",
    heading: /yaml-defined ai workflows/i,
  },
  { path: "/contact", heading: /start a conversation/i },
  {
    path: "/this-route-does-not-exist",
    heading: /this page is not part of the current map/i,
  },
] as const;

function collectRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("pageerror", (error) => {
    errors.push(`Page error: ${error.message}`);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`Console error: ${message.text()}`);
    }
  });

  return errors;
}

async function loadLazyImages(page: Page): Promise<void> {
  const images = page.locator("img");
  const count = await images.count();

  for (let index = 0; index < count; index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded();
    await page.waitForTimeout(35);
  }

  await expect
    .poll(
      () =>
        images.evaluateAll((elements) =>
          elements
            .filter((image) => {
              const element = image as HTMLImageElement;
              return !(element.complete && element.naturalWidth > 0);
            })
            .map((image) => (image as HTMLImageElement).currentSrc),
        ),
      { timeout: 10_000 },
    )
    .toEqual([]);

  await page.evaluate(() => window.scrollTo(0, 0));
}

async function expectNoHorizontalOverflow(
  page: Page,
  label: string,
): Promise<void> {
  const metrics = await page.evaluate(() => {
    const root = document.documentElement;
    return {
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      bodyWidth: document.body.scrollWidth,
    };
  });

  expect(
    Math.max(metrics.scrollWidth, metrics.bodyWidth),
    `${label} has horizontal overflow (${JSON.stringify(metrics)})`,
  ).toBeLessThanOrEqual(metrics.clientWidth + 2);
}

async function isCompactViewport(page: Page): Promise<boolean> {
  const viewport = page.viewportSize();
  return Boolean(viewport && viewport.width < 1024);
}

test.describe("cross-browser responsive experience", () => {
  test("every route opens with stable layout, loaded images, and no runtime errors", async ({
    page,
  }, testInfo) => {
    test.slow();
    const errors = collectRuntimeErrors(page);
    const viewport = page.viewportSize();

    for (const route of routes) {
      await test.step(`${route.path} at ${viewport?.width}x${viewport?.height}`, async () => {
        await page.goto(route.path, { waitUntil: "domcontentloaded" });

        const heading = page.locator("main h1");
        await expect(heading).toBeVisible();
        await expect(heading).toHaveText(route.heading);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page).toHaveTitle(/sushant buche/i);

        const fontStatus = await page.evaluate(async () => {
          await document.fonts.ready;
          return document.fonts.status;
        });
        expect(fontStatus, `${route.path} fonts did not load`).toBe("loaded");

        const headingBox = await heading.boundingBox();
        expect(headingBox, `${route.path} heading has no layout box`).not.toBeNull();
        if (headingBox && viewport) {
          expect(headingBox.x).toBeGreaterThanOrEqual(-1);
          expect(headingBox.x + headingBox.width).toBeLessThanOrEqual(
            viewport.width + 1,
          );
          expect(headingBox.height).toBeGreaterThan(20);
        }

        await expectNoHorizontalOverflow(page, `${testInfo.project.name} ${route.path}`);
        await loadLazyImages(page);
        await expectNoHorizontalOverflow(
          page,
          `${testInfo.project.name} ${route.path} after scrolling`,
        );

        const brokenImages = await page.locator("img").evaluateAll((images) =>
          images
            .filter((image) => {
              const element = image as HTMLImageElement;
              return !(element.complete && element.naturalWidth > 0);
            })
            .map((image) => {
              const element = image as HTMLImageElement;
              return {
                src: element.currentSrc || element.src,
                alt: element.alt,
              };
            }),
        );

        expect(
          brokenImages,
          `${testInfo.project.name} ${route.path} has unloaded images`,
        ).toEqual([]);
      });
    }

    expect(errors, `${testInfo.project.name} emitted runtime errors`).toEqual([]);
  });

  test("compact navigation opens, traps focus, closes, and navigates", async ({
    page,
  }) => {
    test.skip(!(await isCompactViewport(page)), "Desktop navigation is used here.");

    await page.goto("/");
    const trigger = page.getByRole("button", { name: /open navigation/i });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: /site navigation/i });
    await expect(dialog).toBeVisible();
    await expect(
      page.getByRole("button", { name: /close navigation/i }),
    ).toBeFocused();
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("hidden");

    await page.keyboard.press("Shift+Tab");
    expect(
      await page.evaluate(() => {
        const panel = document.querySelector('[role="dialog"]');
        return panel?.contains(document.activeElement) ?? false;
      }),
    ).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("");

    await trigger.click();
    await dialog.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /case studies with the decisions left in/i,
    );
  });

  test("desktop navigation is visible and routes correctly", async ({ page }) => {
    test.skip(await isCompactViewport(page), "Compact navigation is used here.");

    await page.goto("/");
    const primary = page.getByRole("navigation", { name: "Primary" });
    await expect(primary).toBeVisible();
    await primary.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /case studies with the decisions left in/i,
    );
  });

  test("project filters and skill search work without layout breakage", async ({
    page,
  }) => {
    await page.goto("/projects");
    const projectSearch = page.getByRole("searchbox", {
      name: /search projects/i,
    });
    await expect(projectSearch).toBeVisible();
    await projectSearch.fill("zzzz-not-a-real-project");
    await expect(
      page.getByText(/no projects match those filters/i),
    ).toBeVisible();
    await page.getByRole("button", { name: /clear filters/i }).first().click();
    await expect(page.getByText(/9 of 9 projects/i)).toBeVisible();
    await expectNoHorizontalOverflow(page, "projects after filtering");

    await page.goto("/skills");
    const frontendTab = page.getByRole("tab", {
      name: /frontend development/i,
    });
    await frontendTab.click();
    await expect(frontendTab).toHaveAttribute("aria-selected", "true");
    const skillSearch = page.getByRole("searchbox", { name: /search skills/i });
    await skillSearch.fill("zzzz-not-a-skill");
    await expect(page.getByText(/no skills match that search/i)).toBeVisible();
    await expectNoHorizontalOverflow(page, "skills after filtering");
  });

  test("contact form exposes labelled fields and a working email path", async ({
    page,
  }) => {
    await page.goto("/contact");
    await expect(page.locator("form")).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: /^name/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: /^email/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: /^message/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /107sushant@gmail.com/i }),
    ).toHaveAttribute("href", "mailto:107sushant@gmail.com");
    await expectNoHorizontalOverflow(page, "contact form");
  });
});
