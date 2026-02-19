'use strict';

import { act, fireEvent, render, screen } from "@testing-library/react";

import { StaticRouter } from "react-router-dom";
import { unmountComponentAtNode } from "react-dom";
import { useAuthenticatedUser } from "@/__mocks__/predefinedMocks";
import DashboardPage from "../../pages/dashboard";
import axios from "axios";
import mockAxios from 'jest-mock-axios';

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

jest.mock("axios");

describe("DashboardPage", () => {
  useAuthenticatedUser();
  test("does render", async () => {
    await act(async () => {
      const data = ["Test Name 1", "Test Name 2", "Test Name 3"];
      const response = { data: data };

      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve(response)
      );


      render(
        <StaticRouter location={{ pathname: "/dashboard" }}>
          <DashboardPage />
        </StaticRouter>
      );
    });
    screen.getByText("Error loading catalogs. Please contact an administrator");
  });
});
