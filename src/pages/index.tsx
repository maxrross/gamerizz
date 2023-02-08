import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Profile from "@/components/profile";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, CursorArrowRaysIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useUser } from "@auth0/nextjs-auth0/client";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Company", href: "#" },
];

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <div className="Navbar px-6 pt-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <CursorArrowRaysIcon className="h-8 w-8" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {user ? (
              <div className="flex flex-row text-sm font-semibold leading-6 text-gray-900">
                <p className="mr-5">{user.name}</p>
                <a href="/api/auth/logout">
                  Sign Out
                  <span className="ml-1" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              </div>
            ) : (
              <div className="flex flex-row text-sm font-semibold leading-6 text-gray-900">
                <a href="/api/auth/login">
                  Log In
                  <span className="ml-1" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              </div>
            )}
          </div>
        </nav>
        <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <Dialog.Panel
            className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5">
                <CursorArrowRaysIcon className="h-8 w-8"/>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="/api/auth/login"
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
      <main>
        <div className="CenterPage relative px-6 lg:px-8">
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
