'use strict';

import { BrowserRouter, MemoryRouter, Route } from "react-router-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { createRoot } from 'react-dom/client'

import { unmountComponentAtNode } from "react-dom";

import Footer from "../../../components/Footer/Footer";

let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("Footer ", () => {
  test("does render", () => {
    act(() => {
      render(<Footer />);
    });

    screen.getByText("Contact US");
    screen.getByText("DOD Home Page");
  });
});
