'use strict';

import { BrowserRouter, MemoryRouter, Route } from "react-router-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";

import FooterLink from "../../../../components/Footer/FooterLink/FooterLink";

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

describe("Footer", () => {
  test("does render correct title", () => {
    act(() => {
      render(<FooterLink name="test name" />);
    });
    screen.getByText("test name");
  });

  test("does render link", () => {
    act(() => {
      render(<FooterLink link="/test" />);
    });
  });

  test("does render correct link", () => {
    act(() => {
      render(<FooterLink name="Title" link="/test" />);
    });

    expect(screen.getByText("Title").href).toBe("http://localhost/test");
  });

  test("does not render a link when no link is provided", () => {
    act(() => {
      render(<FooterLink name="Title" />);
    });

    expect(screen.getByText("Title").href).toBe("");
  });
});
