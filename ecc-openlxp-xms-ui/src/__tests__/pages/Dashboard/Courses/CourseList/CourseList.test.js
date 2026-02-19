'use strict';

import { BrowserRouter, MemoryRouter, Route } from "react-router-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import CourseList from "../../../../../pages/dashboard/Courses/CourseList/CourseList";
import mockRouter from 'next-router-mock';

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

describe("CourseList", () => {
  test("does render", () => {
    act(() => {
      render(
        <BrowserRouter>
          <CourseList />
        </BrowserRouter>,
        container
      );
    });

    expect(screen.getByTestId("course-table")).toBeInTheDocument();
  });

  test("does render rows when data is passed", () => {
    act(() => {
      const data = {
        experiences: {
          results: [
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
          ],
        },
      }
      render(
        <BrowserRouter>
          <CourseList data={data} />
        </BrowserRouter>,
        container
      );
    });
    screen.getByTestId("course-rows");
    expect(screen.getByTestId("course-rows").childElementCount).toBe(2);
  });

  test("only renders populated rows of data", () => {
    act(() => {
      const data = {
        experiences: {
          results: [
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
          {},
          ],
        },
      }
      render(
        <BrowserRouter>
          <CourseList data={data} />
        </BrowserRouter>,
        container
      );
    });
    expect(screen.getByTestId("course-rows").childElementCount).toBe(1);
  });

  test("Click row of data", () => {
    act(() => {
      const data = {
        experiences: {
          results: [
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
          {},
          ],
        },
      }
      
      render(
        <MemoryRouter initialEntries={["/dashboard/test/courses"]}>
          <BrowserRouter>
            <CourseList data={data} />
            <Route
              path="/dashboard/test/course/1234"
              render={() => { }}
            />
          </BrowserRouter>
        </MemoryRouter>,
        container
      );
      const button = screen.getByText("View", {exact:true})
      fireEvent(button, new MouseEvent("click", { bubbles: true }));
    });
  });
});
