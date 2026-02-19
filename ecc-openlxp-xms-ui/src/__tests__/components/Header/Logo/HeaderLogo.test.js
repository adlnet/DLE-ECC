'use strict';

import { act, fireEvent, render, screen } from "@testing-library/react";

import { BrowserRouter } from "react-router-dom";
import { unmountComponentAtNode } from "react-dom";
import Logo from "../../../../components/Header/Logo/HeaderLogo";
import img from "../../../resources/internal/dodLogo.png";

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

describe("Logo", () => {
  test("does render title", () => {
    act(() => {
      render(
        <BrowserRouter>
          <Logo title="Test Title" />
        </BrowserRouter>
      );
    });

    screen.getAllByText("Test Title");
  });

  test("does render subtitle", () => {
    act(() => {
      render(
        <BrowserRouter>
          <Logo subtitle="Test Subtitle" />
        </BrowserRouter>
      );
    });
    screen.getAllByText("Test Subtitle");
  });

  test("does render img", () => {
    act(() => {
      render(
        <BrowserRouter>
          <Logo img={img} />
        </BrowserRouter>
      );
    });
    screen.getByAltText(/DOD*/);
  });

  test("does not render title when the title is not defined", () => {
    act(() => {
      render(
        <BrowserRouter>
          <Logo subtitle="Test Subtitle" />
        </BrowserRouter>
      );
    });

    const component = screen.getByText("Test Subtitle").parentElement;
    expect(component.childElementCount).toBe(1);
  });

  test("does not render subtitle when the subtitle is not defined", () => {
    act(() => {
      render(
        <BrowserRouter>
          <Logo title="Test Title" />
        </BrowserRouter>
      );
    });
    const component = screen.getByText("Test Title").parentElement;
    expect(component.childElementCount).toBe(1);
  });
  
  test("does not render image when the image is not defined", () => {
    act(() => {
      render(
        <BrowserRouter>
          <Logo img={undefined} />
        </BrowserRouter>
      );
    });
    expect(screen.getByTestId("logo-button").childElementCount).toBe(1);
  });
});
