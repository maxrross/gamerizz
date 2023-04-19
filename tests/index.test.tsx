import { render, screen } from "@testing-library/react";
import Index from "../src/pages/index";
import Home from "../src/pages/index";
import React from "react";
import App from "../src/pages/_app";
import Loader from "../src/components/loader";
import { useUser } from "@auth0/nextjs-auth0/client";


import SearchBar, { getGames } from "../src/components/searchbar";
import "@testing-library/jest-dom/extend-expect";
import { UserProvider } from "@auth0/nextjs-auth0/client";
jest.mock("axios");
jest.mock('@auth0/nextjs-auth0/client');


it("renders home page without crashing", () => {
  const div = document.createElement("div");
  render(<App Component={Home} />);
});

describe("loader", () => {
  it("should render Loader component", () => {
    render(<Loader />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe('Home', () => {
  describe('when user is authenticated', () => {
    beforeEach(() => {
      useUser.mockReturnValue({
        user: {
          name: 'John',
          picture: 'https://test.com/picture.png'
        },
        isLoading: false,
        error: null
      });
    });

    it('should not render the log in and sign up buttons', () => {
      render(<UserProvider><Home /></UserProvider>);

      expect(screen.queryByText('Log In')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      useUser.mockReturnValue({
        user: null,
        isLoading: false,
        error: null
      });
    });

    it('should not render the user profile and sign out button', () => {
      render(<UserProvider><Home /></UserProvider>);

      expect(screen.queryByText('John')).not.toBeInTheDocument();
      expect(screen.queryByAltText('John')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
    });
  });
});
