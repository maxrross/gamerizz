import { render, screen } from "@testing-library/react";
import Index from "./index";
// import "@testing-library/jest-dom";
// import "@testing-library/jest-dom/extend-expect";

test("renders loading message while user is still loading", () => {
  const { getByText } = render(<Index />);
  const loadingMessage = getByText(/Loading.../i);
  expect(loadingMessage).toBeInTheDocument();
});

test("renders log in button when user is not logged in", () => {
  const { getByText } = render(<Index />);
  const logInButton = getByText(/Log In/i);
  expect(logInButton).toBeInTheDocument();
});

describe("Home component", () => {
  it("renders the page title in a Next.js Head component", () => {
    render(<Index />);
    const pageTitle = document.title;
    expect(pageTitle).toBe("Video Game Platform");
  });
});
