import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Profile from "@/src/components/profile";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Navbar from "@/src/components/navbar";

export default function Home() {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="isolate bg-white">
      <div className="TopGradient absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <svg
          className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity=".3"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4AD4AF" />
              <stop offset={1} stopColor="#20B7AB" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <Navbar />
      <main>
        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Enhancing the future of video games.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                The platform where you can find, comment, and post about the
                best video games in the industry. Made by gamers, for gamers.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {user ? (
                  <div className="mx-auto flex flex-col items-center justify-center gap-y-6">
                    <img
                      className="mx-auto h-10 w-10"
                      src={user.picture}
                      alt={user.name}
                    />
                    <a
                      href="/api/auth/logout"
                      className="rounded-md bg-[#0D9AA0] px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-[#1E7E8E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#20B7AB]"
                    >
                      Sign Out
                    </a>
                  </div>
                ) : (
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                      href="/api/auth/login"
                      className="rounded-md bg-[#0D9AA0] px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-[#1E7E8E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#20B7AB]"
                    >
                      Log In
                    </a>

                    <a
                      href="/api/auth/login"
                      className="text-base font-semibold leading-7 text-gray-900"
                    >
                      Sign Up <span aria-hidden="true">→</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="BottomGradient absolute inset-x-0 top-[calc(100%-18rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-44rem)]">
            <svg
              className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
              viewBox="0 0 1155 678"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                fillOpacity=".3"
                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
              />
              <defs>
                <linearGradient
                  id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                  x1="1155.49"
                  x2="-78.208"
                  y1=".177"
                  y2="474.645"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4AD4AF" />
                  <stop offset={1} stopColor="#20B7AB" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}
