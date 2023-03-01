import Navbar from "../components/navbar";
import { Input } from "@/src/components/ui/input";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Loader from "../components/loader";
import Image from "next/image";

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

export default function Games() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Game[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      if (query === "") return;
      setIsLoading(true);
      const games = await getGames(query);
      setData(games);
      setIsLoading(false);
      console.log(data);
    })();
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="mb-10">
      <Navbar />
      <div className="mx-auto mt-10 w-4/5 max-w-6xl">
        <input
          className="block w-full rounded-md border border-gray-200 py-3 px-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
          type="text"
          placeholder="Search games"
          onChange={handleInputChange}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((game) => (
              <a
                className="flex flex-col rounded-xl border bg-white shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]"
                href="#"
                key={game.id}
              >
                <picture>
                  <img
                    className="h-[200px] w-full overflow-clip rounded-t-xl"
                    src={game.background_image}
                    alt={game.slug}
                  />
                </picture>
                <div className="p-2 md:p-3">
                  <h3 className="truncate text-lg font-bold text-gray-800 dark:text-white">
                    {game.name}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
