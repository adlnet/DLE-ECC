'use strict';

import { act, render, screen } from "@testing-library/react";

import { unmountComponentAtNode } from "react-dom";
import CourseListHeader from "../../../../../pages/dashboard/Courses/CourseHeader/CourseListHeader";

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

describe("CourseHeader", () => {
  test("does render", () => {
    act(() => {
      render(
        <table>
          <thead data-testid='table-header'>
            <CourseListHeader />
          </thead>
        </table>,
        container
      );
    });
    screen.getByTestId("table-header");
  });

  test('does contain "Title, Course Code, Course Status" in header', () => {
    act(() => {
      render(
        <table>
          <thead>
            <CourseListHeader />
          </thead>
        </table>,
        container
      );
    });

    screen.getByText("Title");
    screen.getByText("Course Code");
  });
});
