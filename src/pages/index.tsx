import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Link from "next/link";
import Profile from "@/components/profile";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
  <>
  <a href="/api/auth/login">Login</a>
  <a href="/api/auth/logout">Logout</a>
  <Profile />
  </>
  );
}
