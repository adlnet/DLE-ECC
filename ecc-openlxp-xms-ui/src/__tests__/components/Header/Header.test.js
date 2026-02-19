'use strict';

import { BrowserRouter, MemoryRouter, Route } from "react-router-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";

import { useAuthenticatedUser, useUnauthenticatedUser } from "@/__mocks__/predefinedMocks";
import Header from "../../../components/Header/Header";
import singletonRouter from 'next/router';

let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  useUnauthenticatedUser();
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("Header", () => {
  test("does render", () => {
    act(() => {
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );
    });

    screen.getByText("Sign In");
    screen.getByText("Home");
    screen.getByText("Support");
  });

  test("does take user to home when clicking home", () => {
    let testHistory, testLocation;
    act(() => {
      render(
        <MemoryRouter initialEntries={["/my/initial/route"]}>
          <Header />
          <Route
            path="/"
            render={({ history, location }) => {
              testHistory = history;
              testLocation = location;
            }}
          />
        </MemoryRouter>
      );

      const button = screen.getByText("Home");
      fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });

    expect(singletonRouter).toMatchObject({
      asPath: '/',
    });
  });

  test("does take user to home when clicking Header Logo", () => {
    let testHistory, testLocation;
    act(() => {
      render(
        <MemoryRouter initialEntries={["/my/initial/route"]}>
          <Header />
          <Route
            path="/"
            render={({ history, location }) => {
              testHistory = history;
              testLocation = location;
            }}
          />
        </MemoryRouter>
      );

      const button = screen.getByTestId("home-btn");
      fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });

    expect(singletonRouter).toMatchObject({
      asPath: '/',
    });
  });

  test("dose take user to Dashboard when clicking Sign In", () => {
    let testHistory, testLocation;
    act(() => {
      render(
        <MemoryRouter initialEntries={["/my/initial/route"]}>
          <Header />
          <Route
            path="/"
            render={({ history, location }) => {
              testHistory = history;
              testLocation = location;
            }}
          />
        </MemoryRouter>
      );

      const button = screen.getByText("Sign In");
      fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });

    expect(singletonRouter).toMatchObject({
      asPath: '/',
    });
  });

  test("dose logout", () => {
    let testHistory, testLocation;
    useAuthenticatedUser();
    act(() => {
      render(
        <MemoryRouter initialEntries={["/my/initial/route"]}>
          <Header />
          <Route
            path="/"
            render={({ history, location }) => {
              testHistory = history;
              testLocation = location;
            }}
          />
        </MemoryRouter>
      );

      const button = screen.getByText("Logout");
      fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });

  });
});
