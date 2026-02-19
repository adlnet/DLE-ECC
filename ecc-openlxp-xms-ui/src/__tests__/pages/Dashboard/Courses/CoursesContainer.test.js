'use strict';

import { MemoryRouter } from "react-router-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import { useAuth } from "../../../../context/authContext";
import CoursesContainer from "../../../../pages/dashboard/[catalogTitle]";
import MockAxios from 'jest-mock-axios';
import axios from "axios";

// mocking axios
// jest.mock("axios");
jest.mock('../../../../context/authContext', () => ({
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

describe("CoursesContainer", () => {
  it("does render", async () => {
    await act(async () => {
      MockAxios.get.mockImplementation(() => Promise.resolve({ data: {experiences: [{}]} }));

      render(
        <MemoryRouter>
          <CoursesContainer />
        </MemoryRouter>,
        container
      );
    });
    screen.getByText("Course List");
  });

  it("does render search box and pagination", async () => {
    await act(async () => {
      MockAxios.get.mockImplementation(() => {
        return Promise.resolve({ data: {experiences: [{}]} });
      });
      
      await render(
        <MemoryRouter>
          <CoursesContainer />
        </MemoryRouter>,
        container
      );
    });

    screen.getByPlaceholderText("Search");
    screen.getByText("Clear Search");
    screen.getByText("Next");
    screen.getByText("Previous");
  });

  it("pagination buttons click", async () => {
    await act(async () => {
      MockAxios.get.mockImplementation(() => {
        return Promise.resolve({ data: {experiences: [
          {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
        ]} });
      });
      
      await render(
        <MemoryRouter>
          <CoursesContainer />
        </MemoryRouter>,
        container
      );
      
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      });

      act(() => {
        fireEvent.click(screen.getByTitle("First"));
      });

      act(() => {
        fireEvent.click(screen.getByTitle("Last"));
      });

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
      });
    });

    screen.getByText("1");
  });

  it("dose render courses", async () => {
    const testData = {
          experiences: [
            {
              unique_record_identifier: "UID123",
              date_deleted: null,
              date_inserted: "2021-07-20T19:34:31.567535Z",
              date_transmitted: null,
              metadata: {
                Metadata_Ledger: {
                  Course: {
                    CourseURL: "URL",
                    CourseCode: "CourseCode",
                    CourseType: "CourseType",
                    CourseTitle: "CourseTitle",
                    CourseProviderName: "Provider",
                    CourseShortDescription: "ShortDescription",
                    EstimatedCompletionTime: 5,
                  },
                },
                Supplemental_Ledger: {
                  Instance: 1733998,
                },
              },
              metadata_hash: "12345",
              metadata_key: "1234",
              metadata_key_hash: "2234",
              metadata_transmission_status: "Ready",
              metadata_transmission_status_code: "",
              provider_name: "JKO",
              record_status: "Active",
              updated_by: "Owner",
            },
          ],
        };

    await act(async () => {
      MockAxios.get.mockImplementation(() => {
        return Promise.resolve({ data: testData });
      });

      await render(
        <MemoryRouter>
          <CoursesContainer />
        </MemoryRouter>,
        container
      );
    });

    screen.getByTestId("course-table");
  });

  it("does search and clear search", async () => {
    await act(async () => {
      MockAxios.get.mockImplementation(() => {
        return Promise.resolve({
          data: {
            experiences: [
              {
                unique_record_identifier: "UID123",
                date_deleted: null,
                date_inserted: "2021-07-20T19:34:31.567535Z",
                date_transmitted: null,
                metadata: {
                  Metadata_Ledger: {
                    Course: {
                      CourseURL: "URL",
                      CourseCode: "CourseCode",
                      CourseType: "CourseType",
                      CourseTitle: "CourseTitle",
                      CourseProviderName: "Provider",
                      CourseShortDescription: "ShortDescription",
                      EstimatedCompletionTime: 5,
                    },
                  },
                  Supplemental_Ledger: {
                    Instance: 1733998,
                  },
                },
                metadata_hash: "12345",
                metadata_key: "1234",
                metadata_key_hash: "2234",
                metadata_transmission_status: "Ready",
                metadata_transmission_status_code: "",
                provider_name: "JKO",
                record_status: "Active",
                updated_by: "Owner",
              },
            ],
          }
        });
      });

      render(
        <MemoryRouter>
          <CoursesContainer />
        </MemoryRouter>,
        container
      );
    });

    act(() => {
      fireEvent.change(screen.getByPlaceholderText("Search"), {
        target: { value: "1" },
      });
      fireEvent.keyPress(screen.getByPlaceholderText("Search"), {
        charCode: '13',
      });
    });

    act(() => {
      fireEvent.click(screen.getByText('Clear Search'));
    });
  });

  it("dose throws an error", async () => {
    console.log = jest.fn();
    await act(async () => {
      MockAxios.get.mockImplementation(() => Promise.reject(new Error("Error failed")));

      await render(
        <MemoryRouter>
          <CoursesContainer />
        </MemoryRouter>,
        container
      );
    });
    expect(console.log).toHaveBeenCalledTimes(1);
  });

});
