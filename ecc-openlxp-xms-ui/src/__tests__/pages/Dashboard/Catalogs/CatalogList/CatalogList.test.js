'use strict';

import { BrowserRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";

import CatalogList from "../../../../../pages/dashboard/Catalogs/CatalogList/CatalogList";
import mockAxios from 'jest-mock-axios';


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

describe("Catalog List", () => {
  test("does render when no data is passed", () => {
    act(() => {
      mockAxios.get.mockImplementation(() => {
        return Promise.resolve({ data: {} });
      });
      render(
        <BrowserRouter>
          <CatalogList />
        </BrowserRouter>,
        container
      );
    });

    screen.getByTestId("catalog-list");
  });

  test("does render catalog header", () => {
    act(() => {
      mockAxios.get.mockImplementation(() => {
        return Promise.resolve({ data: {} });
      });
      render(
        <BrowserRouter>
          <CatalogList />
        </BrowserRouter>,
        container
      );
    });
    screen.getByText("Course Catalogs");
  });

  test("does not render when empty data is passed", () => {
    act(() => {
      mockAxios.get.mockImplementation(() => {
        return Promise.resolve({ data: {} });
      });
      const data = [];

      render(
        <BrowserRouter>
          <CatalogList catalogs={data} />
        </BrowserRouter>,
        container
      );
    });

    screen.getByTestId("catalog-list");
  });

  test("does render catalog cards when passed data", () => {
    act(() => {
      const data = ["DAU", "edX"];
      mockAxios.get.mockImplementation(() => {
        return Promise.resolve({ data: {} });
      });

      render(
        <BrowserRouter>
          <CatalogList catalogs={data} />
        </BrowserRouter>,
        container
      );
    });

    screen.getByText("DAU");
    screen.getByText("edX");
  });

  test("axios get config error", () => {
    act(() => {
      const data = ["DAU", "edX"];
      mockAxios.get.mockImplementation(() => Promise.reject(new Error("Error failed")));

      render(
        <BrowserRouter>
          <CatalogList catalogs={data} />
        </BrowserRouter>,
        container
      );
    });
  });
});
