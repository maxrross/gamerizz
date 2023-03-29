import { render, screen } from "@testing-library/react";
import Index from "../src/pages/index";
import Home from "../src/pages/index";
import React from "react";
import App from "../src/pages/_app";

import SearchBar, { getGames } from "../src/components/searchbar";
import "@testing-library/jest-dom/extend-expect";
jest.mock("axios");

it("renders home page without crashing", () => {
  const div = document.createElement("div");
  render(<App Component={Home} />);
});

describe("SearchBar", () => {
  it("should render SearchBar component", () => {
    render(<SearchBar />);
    const searchBar = screen.getByRole("textbox");
    expect(searchBar).toBeInTheDocument();
  });
});
