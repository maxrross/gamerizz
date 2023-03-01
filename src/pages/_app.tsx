// pages/_app.js
import "@/src/styles/globals.css";
import React, { useEffect } from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";

export default function App({ Component, pageProps }: AppProps) {
  return (
    //  <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
    // </AnimatePresence>
  );
}

