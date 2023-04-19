import { render, screen } from "@testing-library/react";
import Index from "../src/pages/index";
import Home from "../src/pages/index";
import React from "react";
import App from "../src/pages/_app";
import Loader from "../src/components/loader";


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

describe("loader", () => {
  it("should render Loader component", () => {
    render(<Loader />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  
 describe("Home component", () => {
  it("renders the page title in a Next.js Head component", () => {
    render(<Home />);
    const pageTitle = document.title;
    expect(pageTitle).toBe("Video Game Platform");
  });

  it("renders the Sign Up link with the correct text content", () => {
    render(<Home />);
    const signUpLink = document.querySelector("a[href='/api/auth/login']");
    expect(signUpLink.textContent).toBe("Sign Up →");
  });
   
});
