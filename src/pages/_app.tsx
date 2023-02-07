import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import type { Session } from "next-auth"
import { UserProvider } from '@auth0/nextjs-auth0/client';
import React from 'react';

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
