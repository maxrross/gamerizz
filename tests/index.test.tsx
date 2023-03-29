import { render, screen } from "@testing-library/react";
import Index from "../src/pages/index";
import Home from "../src/pages/index";
import React from "react";
import App from "../src/pages/_app";

it("renders without crashing", () => {
  const div = document.createElement("div");
  render(<App Component={Home} />);
});
