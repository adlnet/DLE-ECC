'use strict';

import { MemoryRouter, Route } from "react-router-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { unmountComponentAtNode } from "react-dom";
import WelcomeScreen from "../../../pages/WelcomeScreen/WelcomeScreen";
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';

let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  mockRouter.setCurrentUrl('/');
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("WelcomeScreen", () => {
  test("does render", () => {
    act(() => {
      render(<WelcomeScreen />, container);
    });
    screen.getByText("About Experience Management Service");
    screen.getByText(/The Experience Management Service is the human-facing application*/);
  });
});

describe('Navigates to register page', () => {
  it('should click register button', () => {

    let testLocation;
    act(() => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <WelcomeScreen />
          <Route
            path="/register"
            render={({ location }) => {
              testLocation = location;
            }}
          />
        </MemoryRouter>
      );
      const button = screen.getByText(/Click Here to Get Started!/i);
      fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });
    expect(singletonRouter).toMatchObject({
      asPath: '/register',
    });
  });
});
