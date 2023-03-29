import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import SearchBar, { getGames } from "../components/searchbar";
import '@testing-library/jest-dom/extend-expect'



jest.mock("axios");

describe("SearchBar", () => {
  it("should render SearchBar component", () => {
    render(<SearchBar />);
    const searchBar = screen.getByRole("textbox");
    expect(searchBar).toBeInTheDocument();
  });

  it("should call getGames function with query parameter", async () => {
    const games = [
      {
        id: "1",
        name: "Game 1",
        slug: "game-1",
        background_image: "http://localhost/game-1.jpg",
      },
      {
        id: "2",
        name: "Game 2",
        slug: "game-2",
        background_image: "http://localhost/game-2.jpg",
      },
    ];
    axios.get.mockResolvedValueOnce({ data: { message: games } });
    render(<SearchBar />);
    const searchBar = screen.getByRole("textbox");
    userEvent.type(searchBar, "game");
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/game 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/game 2/i)).toBeInTheDocument();
  });

  it("should throw an error if getGames function fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Unable to fetch games"));
    render(<SearchBar />);
    const searchBar = screen.getByRole("textbox");
    userEvent.type(searchBar, "game");
    expect(await screen.findByText(/unable to fetch games/i)).toBeInTheDocument();
  });
});