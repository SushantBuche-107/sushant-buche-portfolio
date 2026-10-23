import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { getPublishedProjects } from "@/lib/portfolio";
import ProjectsPage from "@/pages/ProjectsPage";

function renderProjects(): void {
  render(
    <MemoryRouter initialEntries={["/projects"]}>
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("projects explorer", () => {
  it("searches project content and shows an intentional empty state", async () => {
    const user = userEvent.setup();
    const total = getPublishedProjects().length;
    renderProjects();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /case studies with the decisions left in/i,
    );
    expect(
      screen.getByText(new RegExp(`${total} of ${total} projects`, "i")),
    ).toBeInTheDocument();

    const search = screen.getByRole("searchbox", { name: /search projects/i });
    await user.type(search, "zzzz-not-a-real-project");

    expect(
      await screen.findByText(/no projects match those filters/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`0 of ${total} projects`, "i")),
    ).toBeInTheDocument();

    await user.click(
      screen.getAllByRole("button", { name: /clear filters/i })[0]!,
    );

    expect(
      await screen.findByText(new RegExp(`${total} of ${total} projects`, "i")),
    ).toBeInTheDocument();
  });
});
