'use strict';

import {
  BrowserRouter,
  MemoryRouter,
  Route,
  StaticRouter,
} from "react-router-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import { useAuthenticatedUser, useUnauthenticatedUser } from "@/__mocks__/predefinedMocks";
import MainPage from "../../pages/index";

let container = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("MainPage", () => {
  test("does render", () => {
    useUnauthenticatedUser();
    act(() => {
      render(
        <StaticRouter location={{ pathname: "/" }}>
          <MainPage />
        </StaticRouter>
      );
    });

    screen.getByText("About Experience Management Service");
    screen.getByText("Sign In");
  });
});
