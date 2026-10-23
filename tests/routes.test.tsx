import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppFrame } from "@/App";

function renderRoute(path: string): void {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppFrame />
    </MemoryRouter>,
  );
}

describe("application routes", () => {
  it("renders the home page with the primary heading", async () => {
    renderRoute("/");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /building reliable software/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore my work/i }),
    ).toBeInTheDocument();
  });

  it("renders a lazy-loaded about page", async () => {
    renderRoute("/about");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /engineering software that holds up in production/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders a shareable project case study", async () => {
    renderRoute("/projects/portfolio-platform");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /developer portfolio platform/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /^architecture$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/architecture diagram showing the react application/i),
    ).toBeInTheDocument();
  });

  it("renders a noindex not-found page for unknown routes", async () => {
    renderRoute("/this-route-does-not-exist");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /this page is not part of the current map/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/error 404/i)).toBeInTheDocument();
  });
});
