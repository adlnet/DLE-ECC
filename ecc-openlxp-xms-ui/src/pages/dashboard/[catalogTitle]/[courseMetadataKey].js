/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use strict';

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { TrashIcon } from '@heroicons/react/outline';
import { axiosInstance } from "../../../config/axiosInstance";
import { catalog_courses_url } from "../../../config/endpoints";
import { getDeeplyNestedData } from "@/utils/getDeeplyNestedData";
import { updateDeeplyNestedJson } from "../../../utils/utils";
import { useInfoMappings } from "@/hooks/useInfoMappings";
import { useParams } from "react-router-dom";
import DefaultLayout from "@/components/layouts/DefaultLayout";

export function getServerSideProps(context) {
  const { catalogTitle, courseMetadataKey } = context.query;
  return {
    props: {
      catalogTitle,
      courseMetadataKey
    },
  };
}

export default function CourseDataContainerV2({catalogTitle, courseMetadataKey}) {
  const catalog = catalogTitle;
  const id = courseMetadataKey;

  // the state manager of the data
  const [course, setCourse] = useState({
    data: {},
    isLoading: false,
    error: null,
  });

  // the state manager for the modal component
  const [modal, setModal] = useState({
    message: null,
    isOpen: false,
    isLoading: false,
    isError: false,
  });

  // handles the editing state of the component
  const [isEditing, setEditing] = useState(false);

  // manages updating the value of the object
  function handleUpdateData(arr = [], value) {
    let newData = updateDeeplyNestedJson(course.data.metadata, arr, value);
    setCourse({ ...course, data: { ...course.data, metadata: newData } });
  }

  // manages the adding of new key value pairs
  function handleAddNewData() {
    let key = document.querySelector("#new-key").value;
    let value = document.querySelector("#new-value").value;

    // prepare the data for loading
    key = key.split(" ").join("_");

    // remove white space at start and end
    key.trim();
    value.trim();

    // if the data is not empty
    if (key !== "" && value !== "") {
      let newData = updateDeeplyNestedJson(
        course.data.metadata.Supplemental_Ledger || {},
        [key],
        value
      );
      setCourse({
        ...course,
        data: {
          ...course.data,
          metadata: { ...course.data.metadata, Supplemental_Ledger: newData },
        },
      });
      document.querySelector("#new-key").value = "";
      document.querySelector("#new-value").value = "";
    }
  }

  //removes supplemental data values
  function handleRemoveSupplementalData(key) {
    let newData  = course.data.metadata.Supplemental_Ledger;
    delete newData[key];
    setCourse({
      ...course,
      data: {
        ...course.data,
        metadata: { ...course.data.metadata, Supplemental_Ledger: newData },
      },
    });
  }

  // the main driver for adding new values and updating the data
  function handleSubmit() {
    setEditing(false);
    let url = catalog_courses_url + catalog + "/" + id;
    setModal({
      isLoading: true,
      isOpen: true,
      isError: false,
      message: "...Loading",
    });
    axiosInstance
      .post(url, course.data)
      .then((response) => {
        setModal({
          isLoading: false,
          isOpen: true,
          isError: false,
          message: "Course metadata successfully updated",
        });
      })
      .catch((error, resp) => {
        setModal({
          isLoading: false,
          isError: true,
          isOpen: true,
          message:
            "Error updating the metadata. Please contact your administrator.",
        });
      });
  }

  

  // title and basic info
  function courseHeader() { 

    return (
      <div
        title={getDeeplyNestedData(config.data?.course_title.replace("metadata.", "metadata.Metadata_Ledger."), course.data)}
        className={
          "w-full flex flex-row my-2 py-2 px-2 space-x-1 justify-start "
        }
      >
        <div className={"text-xl font-bold w-full"}>{getDeeplyNestedData(config.data?.course_title.replace("metadata.", "metadata.Metadata_Ledger."), course.data)}</div>
        <div
          className={
            "px-2 mt-1 text-xs leading-5 self-center font-semibold rounded-full bg-green-100 text-green-800"
          }
        >
          {course.data.record_status}
        </div>

        <div className={"flex flex-row-reverse align-top top-0 pt-1 px-2"}>
          {isEditing && (
            // eslint-disable-next-line react/jsx-no-comment-textnodes
            <>
              <div
                className="mx-1 px-2 rounded-md bg-gray-200 text-gray-700 cursor-pointer"
                onClick={() => {
                  getCourseData();
                  setEditing(false);
                }}
              >
                Cancel
              </div>
              <div
                className="mx-1 px-2 rounded-md bg-green-200 text-green-800 cursor-pointer"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Update
              </div>
            </>
          )}
          {!isEditing && (
            <div
              className="px-2 rounded-md bg-blue-light bg-opacity-20 text-blue-dark cursor-pointer h-6"
              onClick={(event) => {
                setEditing(true);
              }}
            >
              Edit
            </div>
          )}
        </div>

      </div>
    );
  }

  // editing rows
  // function editControls() {
  //   return (
      
  //   );
  // }

  const checkSpecialChar =(e)=>{
    if(/[<>/?{}#$%*()`~\\]/.test(e.key)){
        e.preventDefault();
    }
  };

  // creates the components for rendering
  function dataFields(data, pathToField = []) {
    let path = [...pathToField];

    // if no data is passed
    if (!data) return null;

    return (
      <div className={"px-2 pt-2"}>
        {Object.keys(data).map((key) => {
          // if the data[key] is an obj go deeper
          if (typeof data[key] === "object" && data[key] !== null) {
            path.push(key);

            // group area
            const groupArea = (
              <div className={"ml-4 mt-2 mb-8"} key={path}>
                <div className={"font-bold text-lg select-none"}>
                  {key}
                  <div className="px-2 border-l-2 rounded-bl-md hover:border-blue-light">
                    {dataFields(data[key], path)}
                  </div>
                </div>
              </div>
            );
            path.pop();
            return groupArea;
          }
          else if( key === "Supplemental_Ledger" && data[key] === null){
            const groupArea = (
              <div className={"ml-4 mt-2 mb-8"} key={path}>
                <div className={"font-bold text-lg select-none"}>
                  {key}
                  <div className="px-2 border-l-2 rounded-bl-md hover:border-blue-light font-normal">
                    None
                  </div>
                </div>
              </div>
            );
            path.pop();
            return groupArea;
          }

          // if the data[key] is a value

          let tempPath = [...path];
          tempPath.push(key);
          let suppData = tempPath.includes("Supplemental_Ledger")
          const inputArea = (
            <div
              key={tempPath}
              className={
                "w-full focus-within:text-blue-medium font-semibold my-2 space-y-1"
              }
            >
              <div className="flex">
                <label className={"select-none text-md"}>{key}</label>
                {suppData && isEditing &&
                  <div className="w-full ml-6 right-0 ">
                  <button
                    onClick={() => handleRemoveSupplementalData(key)}
                    id='delete'
                    title='delete'
                    className='flex items-center justify-center gap-2 text-sm bg-red-50 border border-red-500 text-red-500 py-1 px-1 hover:bg-red-600 hover:text-white transform transition-all duration-150'
                  >
                    <TrashIcon className='h-4 w-4' />
                    Delete
                  </button>
                  </div>
                  }
              </div>
              <textarea
                disabled={!isEditing}
                placeholder={data[key]}
                value={data[key]}
                data-testid={"textbox"}
                onKeyPress={(e)=>checkSpecialChar(e)}
                name={`${tempPath.join(".")}`}
                className={`${
                  isEditing && "shadow-sm"
                } w-full text-sm rounded-md border px-2 py-1 outline-none ring-offset-1 focus:ring-2 focus:shadow-md focus:ring-blue-light focus:text-gray-800`}
                rows={Math.floor(data[key]?.length / 82) || 1}
                onChange={(event) => {
                  handleUpdateData(
                    event.target.name.split("."),
                    event.target.value
                  );
                }}
              />
            </div>
          );

          // returning the generated text
          return inputArea;
        })}
      </div>
    );
  }

  //to add supplemental data values
  function addToSupplemental() {
    return (
      <div
        className={"w-full pl-6 pr-4"}
        onKeyPress={(event) => {
          if (event.key === "Enter" || event.key === 13) {
            handleAddNewData();
          }
        }}
      >
        <div className="flex flex-row rounded-md p-2 space-x-2">
          <div className={"w-1/3"}>
            <label>Key Name</label>
            <textarea
              placeholder="Key Name"
              id={"new-key"}
              disabled={!isEditing}
              className={"w-full border rounded-md px-2"}
              rows={1}
            />
          </div>
          <div className={"w-2/3"}>
            <label>Value</label>
            <textarea
              placeholder="Value"
              id={"new-value"}
              disabled={!isEditing}
              className={"w-full border rounded-md px-2"}
              rows={1}
            />
          </div>
        </div>
        <div className={"flex justify-center"}>
          <div
            className={
              "px-2 bg-gray-200 text-gray-700 rounded-md shadow-md cursor-pointer"
            }
            onClick={handleAddNewData}
          >
            Add Supplemental Data
          </div>
        </div>
      </div>
    );
  }

  // api call to get the course data
  function getCourseData() {
    const url = catalog_courses_url + catalog + "/" + id;

    // init the state to loading
    setCourse({
      data: null,
      isLoading: true,
      error: null,
    });

    axiosInstance
      .get(url)
      .then((response) => {
        setCourse({
          data: response.data,
          isLoading: false,
          error: null,
        });

        // render the components
      })
      .catch((error) => {
        setCourse({
          data: null,
          isLoading: false,
          error: error,
        });
      });
  }

  // on mount get the data of the course
  useEffect(() => {
    let isSubscribed = true;

    if (isSubscribed) {
      getCourseData();
    }

    return () => {
      isSubscribed = false;
    };
  }, [id]);

  const config = useInfoMappings();

  return (
    <DefaultLayout>
    <div className="bg-white shadow rounded-md pb-4 mb-6">
      {course.isLoading && "Loading ..."}
      {course?.error && "Error"}
      <div className="sticky top-0 pt-4 mx-4 px-4 sm:px-6 md:px-8 lg:px-10 border-b bg-white">
        {course?.data && !course?.error && !course.isLoading && courseHeader()}
      </div>

      {course?.data &&
        !course?.error &&
        !course.isLoading &&
        dataFields(course.data.metadata)}
      {course?.data &&
        !course?.error &&
        !course.isLoading &&
        isEditing &&
        addToSupplemental()}
      <Transition appear show={modal.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => {
            setModal({ ...modal, isOpen: false });
          }}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit Metadata
                </Dialog.Title>
                <div className="mt-2">
                  <div
                    className={`text-sm ${modal.isError && "text-red-800"} ${
                      !modal.isError && !modal.isLoading && "text-green-800"
                    }`}
                  >
                    {modal.message}
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setModal({ ...modal, isOpen: false })}
                  >
                    Done
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
    <div className="pb-20"></div>
    </DefaultLayout>
  );
}
