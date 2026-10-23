import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ContactPage from "@/pages/ContactPage";
import SkillsPage from "@/pages/SkillsPage";

describe("skills explorer", () => {
  it("supports category tabs and search", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SkillsPage />
      </MemoryRouter>,
    );

    const frontendTab = screen.getByRole("tab", {
      name: /frontend development/i,
    });
    await user.click(frontendTab);

    expect(frontendTab).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("heading", { level: 3, name: /frontend development/i }),
    ).toBeInTheDocument();

    const search = screen.getByRole("searchbox", { name: /search skills/i });
    await user.type(search, "zzzz-not-a-skill");

    expect(
      await screen.findByText(/no skills match that search/i),
    ).toBeInTheDocument();
  });
});

describe("contact with a configured email channel", () => {
  it("renders a mailto form and the published email address", () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("textbox", { name: /^name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /^email/i })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /^message/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /107sushant@gmail.com/i }),
    ).toHaveAttribute("href", "mailto:107sushant@gmail.com");
  });
});
