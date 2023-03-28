import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export const getGame = async (query: any) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/game?title=${query}`
    );
    console.log(response);
    return "test";
  } catch (error) {
    console.error(error);
    throw new Error("Unable to fetch game");
  }
};

const Post = () => {
  const [displayName, setDisplayName] = useState("");
  const [upvoteCount, setUpvoteCount] = useState(0);
  const router = useRouter();
  const { gameName } = router.query;

  useEffect(() => {
    if (gameName === undefined) return;
    axios
      .get(`http://localhost:8080/game?title=${gameName}`)
      .then((response) => {
        setDisplayName(response.data.gameTitle.name);
        setUpvoteCount(response.data.upvoteCount);
      });
  }, [router.isReady]);

  return (
    <div>
      Display Name: {displayName}
      <br></br>
      Upvote Count: {upvoteCount}
    </div>
  );
};

export default Post;
