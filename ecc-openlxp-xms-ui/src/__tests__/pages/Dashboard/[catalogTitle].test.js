'use strict';

import { MemoryRouter } from "react-router-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import { useAuth } from "../../../context/authContext"
import Courses from "../../../pages/dashboard/[catalogTitle]";
import MockAxios from 'jest-mock-axios';
import axios from "axios";

jest.mock('../../../context/authContext', () => ({
  useAuth: jest.fn(),
}));

let container = null;
beforeEach(() => {
  useAuth.mockImplementation(() => ({
    user: { 
      user: {
        id: '1',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@test.com',
    }},
  }));
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  MockAxios.reset();
  container = null;
});

describe("CourseDataContainerV2", () => {
  it("does render", async () => {
    await act(async () => {
      MockAxios.get.mockImplementation(() => Promise.resolve({ data: {experiences: [{}]} }));

      render(
        <MemoryRouter>
          <Courses />
        </MemoryRouter>,
        container
      );
    });
    screen.getByText("Course List");
  });

  it("does render edit", async () => {
    await act(async () => {
      MockAxios.get.mockImplementation(() => {
        return Promise.resolve({ data: {experiences: [{}]} });
      });
      
      await render(
        <MemoryRouter>
          <Courses />
        </MemoryRouter>,
        container
      );
    });

    act(() => {
        const button = screen.getByText(/Next/i);
        fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });

    act(() => {
        const button = screen.getByTestId(/last-page/i);
        fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });

    act(() => {
        const button = screen.getByText(/Previous/i);
        fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });


    act(() => {
        const button = screen.getByTestId(/first-page/i);
        fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });

  });

});
