'use strict';

import {
  RefreshIcon,
  UploadIcon,
  XCircleIcon,
  XIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';

import { getDeeplyNestedData } from '@/utils/getDeeplyNestedData';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/hooks/useConfig';
import { useRouter } from 'next/router';
import { useUpdateUserList } from '@/hooks/useUpdateUserList';
import { useUserList } from '@/hooks/useUserList';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import prepareListDataToSend from '@/utils/prepListDataToSend';

export function getServerSideProps({ query }) {
  return {
    props: {
      listId: query.listId,
    },
  };
}

export default function EditList({ listId }) {
  const router = useRouter();
  const { user } = useAuth();
  const config = useConfig();

  // handles the mutation
  const mutation = useUpdateUserList();

  // single source of truth for editing
  const [currentListInfo, setCurrentListInfo] = useState({
    name: '',
    description: '',
    public: false,
    experiences: [],
  });

  const initialList = useUserList(Number.parseInt(listId), setCurrentListInfo);

  useEffect(() => {
    // no user
    if (!user) { router.push('/'); }

    // if there is a authorization error
    if (initialList?.isError) {
      if (initialList?.error?.response?.status === 401) { router.push('/401'); }
      if (initialList?.error?.response?.status === 403) { router.push('/403'); }
    }

    // if the owner of the list is not the current user, redirect to homepage
    if (initialList?.isSuccess && user?.user?.id) {
      if (initialList?.data?.owner?.id !== user?.user?.id) {
        router.push(`/lists/${listId}`);
      }
    }
    if (initialList?.isSuccess) {
      setCurrentListInfo({
        name: initialList.data?.name,
        description: initialList.data?.description,
        experiences: initialList.data?.experiences,
        public: initialList.data?.public,
      });
    }
  }, []);

  const handleChange = (event) => {
    setCurrentListInfo((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const visitCourse = (event, id) => {
    event.preventDefault();
    router.push(`/course/${id}`);
  };

  const removeCourse = (id) => {
    setCurrentListInfo((prev) => {
      return {
        ...prev,
        experiences: prev.experiences.filter(
          (exp) => exp.meta.metadata_key_hash !== id
        ),
      };
    });
  };

  const resetData = (e) => {
    e.preventDefault();
    setCurrentListInfo(initialList.data);
  };

  const submitData = (e) => {
    e.preventDefault();
    mutation.mutate(
      {
        listData: prepareListDataToSend(currentListInfo),
        id: Number.parseInt(listId),
      },
      {
        onSuccess: () => initialList.refetch(),
      }
    );
  };

  const checkSpecialChar = (e) => {
    if (/[<>/?+={};#$*`~\\]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <DefaultLayout>
      <div className='flex justify-between items-center border-b'>
        <h1 className='font-semibold text-3xl pb-4 mt-10 border-b font-sans'>
          {initialList?.data?.name}
        </h1>
        <button
          className='items-center inline-flex gap-2 text-gray-500 rounded-md hover:shadow-md bg-gray-50 hover:bg-gray-400 hover:text-white px-4 py-2 border-gray-400 border-2 outline-none focus:ring-2 ring-gray-400'
          onClick={() => {
            router.push(`/lists/${listId}`);
          }}
        >
          View public list
        </button>
      </div>

      <form onSubmit={submitData} onReset={resetData} className='mt-10'>
        {/* toggle switch with description*/}
        {/* <PublicPrivateToggle currentListInfo={currentListInfo} toggleListVisibility={toggleListVisibility}/> */}

        {/* Title & description input */}
        <div className='grid grid-cols-2 gap-6 mt-10'>
          <input
            className='outline-none rounded shadow-sm p-2 text-xl border focus:shadow-md focus:shadow-blue-400  focus:ring-4 focus:ring-blue-400 focus:ring-offset-1'
            type='text'
            placeholder='List Name'
            value={currentListInfo?.name}
            onChange={handleChange}
            name='name'
            maxLength="200"
            onKeyPress={(e) => checkSpecialChar(e)}
          />
          <textarea
            className='col-span-2 outline-none rounded shadow-sm py-4 px-2 border focus:shadow-md focus:shadow-blue-400  focus:ring-4 focus:ring-blue-400 focus:ring-offset-1'
            name='description'
            placeholder='List Description'
            onChange={handleChange}
            value={currentListInfo?.description}
            maxLength="1000"
            onKeyPress={(e) => checkSpecialChar(e)}

          />
        </div>

        {/* Course list display */}
        <table className='w-full bg-white rounded-md overflow-hidden shadow mt-8'>
          <thead className='border-b '>
            <tr className=''>
              <th className='text-left px-2 py-6 text-lg'>Title</th>
              <th className='text-left px-2 py-6 text-lg w-[13rem]'>
                Provider
              </th>
              <th className='sr-only'>Remove</th>
            </tr>
          </thead>
          <tbody className=''>
            {currentListInfo?.experiences?.map((exp) => (
              <tr
                key={exp?.meta?.id}
                className='odd:bg-gray-100 even:bg-white'
              >
                <td className='p-2 overflow-hidden text-ellipsis'>
                  <button
                    className='hover:underline hover:text-blue-400
                    cursor-pointer w-full h-full text-left '
                    onClick={(e) => visitCourse(e, exp?.meta?.metadata_key_hash)}
                  >
                    {getDeeplyNestedData(config.data?.course_information?.course_title, exp)}
                  </button>
                </td>
                <td className='p-2'>{getDeeplyNestedData(config.data?.course_information?.course_provider, exp)}</td>
                <td className='text-right p-2'>
                  <button
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                    onClick={() => removeCourse(exp?.meta?.metadata_key_hash)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* message for no courses */}
        {currentListInfo?.experiences?.length < 0 && (
          <div className='text-center font-medium border-b border-l border-r py-2 bg-white/90 rounded-b'>
            No courses added yet.
          </div>
        )}

        {/* Action buttons */}
        <div className='mt-8 flex justify-between'>
          <button
            className='max-w-max items-center inline-flex gap-2 text-blue-400 rounded-md hover:shadow-md bg-blue-50 hover:bg-blue-400 hover:text-white px-4 py-2 border-blue-400 border-2 outline-none focus:ring-2 ring-blue-400'
            type='submit'
          >
            {(mutation.isIdle || mutation.isSuccess) && (
              <UploadIcon className='h-5 w-5' />
            )}
            {mutation.isLoading && (
              <RefreshIcon className='h-5 w-5 animate-spin' />
            )}
            {mutation.isError && <XCircleIcon className='h-5 w-5' />}
            Save
          </button>
          <button
            type='reset'
            className='items-center inline-flex gap-2 text-gray-500 rounded-md hover:shadow-md bg-gray-50 hover:bg-gray-400 hover:text-white px-4 py-2 border-gray-400 border-2 outline-none focus:ring-2 ring-gray-400'
          >
            <XIcon className='h-5 w-5' />
            Cancel
          </button>
        </div>
      </form>
    </DefaultLayout>
  );
}
