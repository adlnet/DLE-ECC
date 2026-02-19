'use strict';

import { act, fireEvent, render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import { unmountComponentAtNode } from "react-dom";
import { useAuth } from "../../../../../context/authContext"
import CourseDataContainerV2 from "../../../../../pages/dashboard/[catalogTitle]/[courseMetadataKey]";
import MockAxios from 'jest-mock-axios';
import axios from "axios";

jest.mock('../../../../../context/authContext', () => ({
  useAuth: jest.fn(),
}));


global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

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
          <CourseDataContainerV2 />
        </MemoryRouter>,
        container
      );
    });
    screen.getByText("Edit");
  });

  it("does render edit", async () => {
    await act(async () => {
      MockAxios.get.mockImplementation(() => {
        return Promise.resolve({ data: {experiences: [{}]} });
      });
      
      await render(
        <MemoryRouter>
          <CourseDataContainerV2 />
        </MemoryRouter>,
        container
      );
    });
    screen.getByText(/Edit/i);
    act(() => {
        const button = screen.getByText(/Edit/i);
        fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });

    act(() => {
        const button = screen.getByText(/Update/i);
        fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });

  });

});
