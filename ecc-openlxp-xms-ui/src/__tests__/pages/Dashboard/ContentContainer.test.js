'use strict';

import { BrowserRouter, MemoryRouter, NavLink, Route } from "react-router-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { axiosInstance } from "../../../config/axiosInstance";
import { unmountComponentAtNode } from "react-dom";
import { useAuthenticatedUser } from "@/__mocks__/predefinedMocks";
import ContentContainer from "../../../pages/dashboard/index";
import axios from "axios";
import mockAxios from 'jest-mock-axios';

jest.mock('axios');
let container = null;

beforeEach(() => {
  useAuthenticatedUser();
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("ContentContainer", () => {
  test("does render Catalogs", async () => {
    await act(async () => {
      const data = ["Test Name 1", "Test Name 2", "Test Name 3"];
      const response = { data: data };

      mockAxios.get.mockImplementation(() => Promise.resolve(response));

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Route path="/dashboard" component={ContentContainer} />
        </MemoryRouter>
      );
    });

  });

  test("does render Courses", async () => {
    await act(async () => {
      const data = [
        {
          unique_record_identifier: "Record Identifer",
          date_deleted: null,
          date_inserted: "2021-04-28T14:46:33.629277Z",
          date_transmitted: null,
          metadata: {
            Metadata_Ledger: {
              Course: {
                CourseURL: "https://www.testurl.com",
                CourseCode: "TestCode123",
                CourseLevel: "Intermediate",
                CourseTitle: "Test Title",
                DepartmentName: "Department Name",
                CourseProviderName: "edX",
                CoursePrerequisites: "Prerequisites",
                CourseSubjectMatter: "Subject Matter",
                CourseFullDescription: "Course Description",
                EstimatedCompletionTime: 40,
                CourseAdditionalInformation: "extra_description",
              },
              CourseInstance: {
                EndDate: "2021-12-31T04:00:00Z",
                Duration: 40,
                CourseURL: "https://www.testurl.com",
                StartDate: "2021-02-20T04:00:00Z",
                Thumbnail: "https://www.testurl.com",
                CourseCode: "course-v1:TsinghuaX+30240184.2x+1T2021",
                InLanguage: "zh-cmn",
                Instructor: "Deng",
                CourseLevel: "Intermediate",
                CourseTitle: "Test Title",
                DeliveryMode: "Self",
                InstructorBio: "Instructor Bio",
                EnrollmentEndDate: "",
                EnrollmentStartDate: "",
                CourseFullDescription: "Full Course Description",
                CourseLearningOutcome: "Course Learning Outcome",
                CourseShortDescription: "Course Short Description",
              },
              Technical_Information: {
                Thumbnail: "https://www.testurl.com",
              },
            },
          },
          metadata_hash: "123412312",
          metadata_key: "TestCode123",
          metadata_key_hash: "1234",
          metadata_transmission_status: "Ready",
          metadata_transmission_status_code: "",
          provider_name: "edX",
          record_status: "Active",
          updated_by: "System",
        },
      ];
      const response = { data: data };

      axios.get.mockResolvedValue(response);

      render(
        <MemoryRouter initialEntries={["/dashboard/:catalog/courses"]}>
          <Route
            path="/dashboard/:catalog/courses"
            component={ContentContainer}
          />
        </MemoryRouter>
      );
    });
  });

  test("does render CourseData", async () => {
    await act(async () => {
      const data = {
        unique_record_identifier: "Record Identifer",
        date_deleted: null,
        date_inserted: "2021-04-28T14:46:33.629277Z",
        date_transmitted: null,
        metadata: {
          Metadata_Ledger: {
            Course: {
              CourseURL: "https://www.testurl.com",
              CourseCode: "TestCode123",
              CourseLevel: "Intermediate",
              CourseTitle: "Test Title",
              DepartmentName: "Department Name",
              CourseProviderName: "edX",
              CoursePrerequisites: "Prerequisites",
              CourseSubjectMatter: "Subject Matter",
              CourseFullDescription: "Course Description",
              EstimatedCompletionTime: 40,
              CourseAdditionalInformation: "extra_description",
            },
            CourseInstance: {
              EndDate: "2021-12-31T04:00:00Z",
              Duration: 40,
              CourseURL: "https://www.testurl.com",
              StartDate: "2021-02-20T04:00:00Z",
              Thumbnail: "https://www.testurl.com",
              CourseCode: "course-v1:TsinghuaX+30240184.2x+1T2021",
              InLanguage: "zh-cmn",
              Instructor: "Deng",
              CourseLevel: "Intermediate",
              CourseTitle: "Test Title",
              DeliveryMode: "Self",
              InstructorBio: "Instructor Bio",
              EnrollmentEndDate: "",
              EnrollmentStartDate: "",
              CourseFullDescription: "Full Course Description",
              CourseLearningOutcome: "Course Learning Outcome",
              CourseShortDescription: "Course Short Description",
            },
            Technical_Information: {
              Thumbnail: "https://www.testurl.com",
            },
          },
        },
        metadata_hash: "123412312",
        metadata_key: "TestCode123",
        metadata_key_hash: "1234",
        metadata_transmission_status: "Ready",
        metadata_transmission_status_code: "",
        provider_name: "edX",
        record_status: "Active",
        updated_by: "System",
      };
      axios.get.mockImplementationOnce(() => Promise.resolve({ data: data }));
      render(
        <MemoryRouter initialEntries={["/dashboard/JKO/course/:id"]}>
          <Route
            path="/dashboard/:catalog/course/:id"
            component={ContentContainer}
          />
        </MemoryRouter>
      );
    });
  });
});
