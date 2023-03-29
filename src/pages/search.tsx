import Navbar from "../components/navbar";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import SearchBar from "../components/searchbar";

export default function Games() {
  return (
    <div className="mb-10 dark:bg-slate-900 min-h-screen">
      <Navbar />
      <SearchBar />
    </div>
  );
}
