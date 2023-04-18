import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/src/components/navbar";
import { ArrowDownCircle, ArrowUpCircle, StarIcon } from "lucide-react";
var sanitizeHtml = require("sanitize-html");
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Switch } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const updateVoteCount = async (slug: string) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/upvote?title=${slug}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to update vote count");
  }
};

const updateDownVoteCount = async (slug: string) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/downvote?title=${slug}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to update vote count");
  }
};


const Post = () => {
  const [agreed, setAgreed] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [description, setDescription] = useState("");
  const [background_image, setBackground_image] = useState("");
  const [released, setReleased] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [platforms, setPlatforms] = useState<
    { platform: { id: number; name: string; slug: string } }[]
  >([]);
  const [reviews, setReviews] = useState<
    { author: string; review: string; rating: number }[]
  >([]);
  const router = useRouter();
  const { gameName } = router.query;

  useEffect(() => {
    if (gameName === undefined) return;
    axios
      .get(`http://localhost:8080/game?title=${gameName}`)
      .then((response) => {
        setDisplayName(response.data.gameInfo.name);
        setSlug(response.data.gameInfo.slug);
        setDescription(response.data.gameInfo.description);
        setBackground_image(response.data.gameInfo.background_image);
        setReleased(response.data.gameInfo.released);
        setPlatforms(response.data.gameInfo.platforms);
        setReviews(response.data.reviews);
      });
    axios
      .get(`http://localhost:8080/upvoteCount?title=${gameName}`)
      .then((response) => {
        setUpvoteCount(response.data.upvoteCount);
        console.log(response.data.upvoteCount);
      });
  }, [router.isReady]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const { data } = await axios.get(
        `http://localhost:8080/writeReview?title=${gameName}&author=${formData.get(
          'name'
        )}&review=${formData.get('Review')}&rating=${formData.get('rating')}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSubmitted(true);
        
      setTimeout(() => {
        setSubmitted(false);
      }, 15000);

      console.log(data);
    } catch (error) {
      console.error(error);
      throw new Error('Unable to update vote count');
    }
  };
  
  return (
    <div className="min-h-screen dark:bg-slate-900">
      <Navbar />
      <div className="mx-auto mt-10 max-w-[85rem] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 md:items-center md:gap-8 xl:gap-20">
          <div>
            <h1 className="block text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl lg:text-6xl lg:leading-tight">
              <span className="text-blue-600">{displayName}</span>
            </h1>
            <h2 className="mt-1 text-sm text-gray-600 ">Released {released}</h2>
            <h2 className="mt-1 text-sm text-gray-600 ">
              Platforms:{" "}
              {platforms.map((platform) => platform.platform.name).join(", ")}
            </h2>
            <p className="mt-3 text-lg text-gray-800 dark:text-gray-400">
              {sanitizeHtml(description, {
                allowedTags: [],
                allowedAttributes: [],
              })}
            </p>
            <div className="mt-7 grid w-full gap-3 sm:inline-flex">
              <a href="#review"
                className="inline-flex items-center justify-center gap-x-3 rounded-md border border-transparent bg-blue-600 py-3 px-4 text-center text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 lg:text-base"
              >
                Review this game
                <svg
                  className="h-2.5 w-2.5"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
              <div className="inline-flex items-center justify-center gap-x-3.5 rounded-md border py-3 px-4 text-center text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 dark:border-gray-800 dark:text-white  dark:shadow-slate-700/[.7] lg:text-base">
                <button
                  onClick={() => {
                    setUpvoteCount(upvoteCount + 1);
                    updateVoteCount(slug);
                  }}
                >
                  {" "}
                  <ArrowUpCircle />
                </button>
                <span className="text-gray-800 dark:text-gray-200">
                  {upvoteCount}
                </span>
                <button
                  onClick={() => {
                    setUpvoteCount(upvoteCount - 1);
                    updateDownVoteCount(slug);
                  }}
                >
                  <ArrowDownCircle />
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-5 lg:mt-10">
              <div className="py-5">
                <div className="flex space-x-1">
                  <svg
                    className="h-4 w-4 text-gray-800 dark:text-gray-200"
                    width="51"
                    height="51"
                    viewBox="0 0 51 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="h-4 w-4 text-gray-800 dark:text-gray-200"
                    width="51"
                    height="51"
                    viewBox="0 0 51 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="h-4 w-4 text-gray-800 dark:text-gray-200"
                    width="51"
                    height="51"
                    viewBox="0 0 51 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="h-4 w-4 text-gray-800 dark:text-gray-200"
                    width="51"
                    height="51"
                    viewBox="0 0 51 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="h-4 w-4 text-gray-800 dark:text-gray-200"
                    width="51"
                    height="51"
                    viewBox="0 0 51 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-bold">4.6</span> /5 - from 12k reviews
                </p>

                <div className="mt-4 text-2xl font-bold text-[#C5C3C0] dark:text-[#C5C3C0] ">
                  <text>GameRizz</text>
                </div>
              </div>

              <div className="py-5">
                <div className="flex space-x-1">
                  <svg
                    className="h-4 w-4 text-gray-800 dark:text-gray-200"
                    width="51"
                    height="51"
                    viewBox="0 0 51 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="h-4 w-4 text-gray-800 dark:text-gray-200"
                    width="51"
                    height="51"
                    viewBox="0 0 51 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="h-4 w-4 text-gray-800 dark:text-gray-200"
                    width="51"
                    height="51"
                    viewBox="0 0 51 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="h-4 w-4 text-gray-800 dark:text-gray-200"
                    width="51"
                    height="51"
                    viewBox="0 0 51 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    className="h-4 w-4 text-gray-800 dark:text-gray-200"
                    width="51"
                    height="51"
                    viewBox="0 0 51 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M49.6867 20.0305C50.2889 19.3946 49.9878 18.1228 49.0846 18.1228L33.7306 15.8972C33.4296 15.8972 33.1285 15.8972 32.8275 15.2613L25.9032 0.317944C25.6021 0 25.3011 0 25 0V42.6046C25 42.6046 25.3011 42.6046 25.6021 42.6046L39.7518 49.9173C40.3539 50.2352 41.5581 49.5994 41.2571 48.6455L38.5476 32.4303C38.5476 32.1124 38.5476 31.7944 38.8486 31.4765L49.6867 20.0305Z"
                      fill="transparent"
                    />
                    <path
                      d="M0.313299 20.0305C-0.288914 19.3946 0.0122427 18.1228 0.915411 18.1228L16.2694 15.8972C16.5704 15.8972 16.8715 15.8972 17.1725 15.2613L24.0968 0.317944C24.3979 0 24.6989 0 25 0V42.6046C25 42.6046 24.6989 42.6046 24.3979 42.6046L10.2482 49.9173C9.64609 50.2352 8.44187 49.5994 8.74292 48.6455L11.4524 32.4303C11.4524 32.1124 11.4524 31.7944 11.1514 31.4765L0.313299 20.0305Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-bold">4.8</span> /5 - from 5k reviews
                </p>

                <div className="mt-3">
                  <img
                    src="../../steam.svg"
                    alt="steam"
                    className="h-2/3 w-2/3"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative ml-4">
            <img
              className="w-full rounded-md"
              src={background_image}
              alt="Image Description"
            />
            <div className="absolute inset-0 -z-[1] mt-4 -mb-4 mr-4 -ml-4 h-full w-full rounded-md bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 dark:from-slate-800 dark:via-slate-900/0 dark:to-slate-900/0 lg:mt-6 lg:-mb-6 lg:mr-6 lg:-ml-6"></div>
          </div>
        </div>
      </div>
      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="bottom absolute inset-x-0 bottom-[-10rem] z-10 transform-gpu overflow-hidden blur-3xl sm:bottom-[-20rem]">

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div>
          {submitted && (
            <div className="alert alert-success shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Your review has been submitted!</span>
            </div>
          </div>
          )
          }
            <div id="review" className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Review this Game
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                Title: <span className="font-bold">{displayName}</span>
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 max-w-xl sm:mt-10"
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Name
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <label
                    htmlFor="rating"
                    className="mt-3.5 block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Rating /5
                  </label>
                  <div className="mt-2.5">
                    <select
                      name="rating"
                      id="rating"
                      className="form-select block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      defaultValue="5"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="Review"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Review
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      name="Review"
                      id="Review"
                      rows={4}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  onClick={() => setSubmitted(true)}
                  className="
            block w-full items-center justify-center gap-x-3 rounded-md border   border-transparent bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm
            transition hover:bg-blue-700   focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white focus-visible:outline focus-visible:outline-2  focus-visible:outline-offset-2 dark:focus:ring-offset-gray-800 lg:text-base"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
          <div>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl mt-16 sm:mt-0 font-bold tracking-tight text-gray-900 sm:text-4xl">
                Rizz Reviews
              </h2>

              <div className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <div className="grid grid-cols-1 gap-6">
                  {reviews.map((review) => (
                    <div className="here flex flex-col rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
                      <div className="flex-auto p-4 md:p-6">
                        <p className="mt-3 text-base text-gray-800 dark:text-white sm:mt-6 md:text-xl">
                          <em>" {review.review} "</em>
                        </p>
                        <div className="rounded-b-xl p-4 md:px-6">
                          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                            {review.author}
                          </h3>
                        </div>
                        <div className="ml-2 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                          <StarIcon className="h-4 w-4" aria-hidden="true" />
                          <span className="ml-1">{review.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
