import Navbar from "../components/navbar";
import { Input } from "@/src/components/ui/input";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

interface Game {
  id: string;
  name: string;
  slug: string;
  background_image: string;
}

export const getGames = async (query: string) => {
  try {
    const { data: games } = await axios.get(
      `http://localhost:8080/games?title=${query}`
    );
    return games.message;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to fetch games");
  }
};

const DEFAULT_DATA: Game[] = [];

const DEBOUNCE_DELAY = 500;

export default function Games() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Game[]>(DEFAULT_DATA);
  const [query, setQuery] = useState("");
  // const [debounceTime, setDebounceTime] = useState(Date.now());

  useEffect(() => {
    (async () => {
      if (query === "") return;
      // if (Date.now() - debounceTime < DEBOUNCE_DELAY) return;

      setIsLoading(true);
      const games = await getGames(query);
      setData(games);
      setIsLoading(false);
      console.log(data);

      // setDebounceTime(Date.now());
    })();
  }, [data, query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-10 w-4/5">
        <Input
          type="text"
          placeholder="Search games"
          onChange={handleInputChange}
        />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data.map((game) => (
            <div key={game.id}>
              <h2>{game.name}</h2>
              <img src={game.background_image} alt={game.slug} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
