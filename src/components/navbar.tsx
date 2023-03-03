import { Dialog } from "@headlessui/react";
import { Bars3Icon, CursorArrowRaysIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import Link from "next/link";

const navigation = [
    { name: "Games", href: "/games" },
    { name: "Search", href: "/search" },
    { name: "Reviews", href: "#" },
  ];

export default function Navbar(){
    const { user, error, isLoading } = useUser();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
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
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-white"
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
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
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
              <div className="flex flex-row text-sm font-semibold leading-6 text-gray-900 dark:text-white">
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
            className="fixed inset-0 z-10 overflow-y-auto bg-whit dark:bg-gray-800 dark:shadow-slate-700/[.7] dark:text-white px-6 py-6 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5">
                <CursorArrowRaysIcon className="h-8 w-8"/>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10 dark:text-white"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="/api/auth/login"
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10 dark:text-white"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
      );
}