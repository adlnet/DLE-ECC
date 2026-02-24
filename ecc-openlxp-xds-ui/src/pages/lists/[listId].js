'use strict';

import { getDeeplyNestedData } from '@/utils/getDeeplyNestedData';
import { useAuth } from '@/contexts/AuthContext';
import { useCallback, useEffect } from 'react';
import { useConfig } from '@/hooks/useConfig';
import { useList } from '@/hooks/useList';
import { useRouter } from 'next/router';
import { xAPISendStatement } from '@/utils/xapi/xAPISendStatement';
import DefaultLayout from '@/components/layouts/DefaultLayout';

export function getServerSideProps(context) {
  const { listId } = context.query;
  return {
    props: {
      listId,
    },
  };
}

export default function ListsView({ listId }) {
  const router = useRouter();
  const config = useConfig();

  // user data
  const { user } = useAuth();

  const list = useList(Number.parseInt(listId));

  // verify a user is logged in otherwise redirect to home page
  useEffect(() => {
    // if the user is not logged in, redirect to the home page
    if (!user) router.push('/');
    if (list.isError && list.error.response.status === 401) { router.push('/401'); }
    if (list.isError && list.error.response.status === 403) { router.push('/403'); }
  }, []);

  const visitCourse = useCallback((course) => {
    if (!user) return;
    const context = {
      actor: {
        first_name: user?.user?.first_name,
        last_name: user?.user?.last_name,
      },
      verb: {
        id: 'https://w3id.org/xapi/acrossx/verbs/explored',
        display: 'explored',
      },
      object: {
        id: `${globalThis.origin}/course/${course.meta.metadata_key_hash}`,
        definitionName: getDeeplyNestedData(config.data?.course_information?.course_title, course),
        description: getDeeplyNestedData(config.data?.course_information?.course_description, course),
      },
      resultExtName: 'https://w3id.org/xapi/ecc/result/extensions/CourseId',
      resultExtValue: course.meta.metadata_key_hash,
    };
    xAPISendStatement(context);
    router.push(`/course/${course.meta.metadata_key_hash}`);
  }, []);

  return (
    <DefaultLayout>
      <div className='flex justify-between items-center border-b'>
        <h1 className='font-semibold text-3xl pb-4 mt-10 border-b font-sans'>
          {list?.data?.name}
        </h1>
        {user?.user?.id === list?.data?.owner?.id && (
          <button
            className='items-center inline-flex gap-2 text-gray-500 rounded-md hover:shadow-md bg-gray-50 hover:bg-gray-400 hover:text-white px-4 py-2 border-gray-400 border-2 outline-none focus:ring-2 ring-gray-400'
            onClick={() => {
              router.push('/lists/edit/' + listId);
            }}
          >
            Edit list
          </button>
        )}
      </div>
      <div className='flex justify-between font-sans text-lg mt-10'>
        <span>
          <span className='font-semibold'>Owner:&nbsp;</span>
          {list?.data?.owner?.email}
        </span>
        <span>
          <span className='font-semibold'>Updated:&nbsp;</span>
          {new Date(list?.data?.modified).toLocaleDateString()}
        </span>
      </div>
      <h2 className='border-b text-lg mt-10 font-semibold'>Description</h2>
      <p className='mt-2 min-h-[8rem] bg-white rounded p-2'>
        {list?.data?.description}
      </p>
      <h2 className='border-b text-lg mt-10 font-semibold'>Included Courses</h2>
      <table className='w-full bg-white rounded-md overflow-hidden shadow mt-8'>
        <thead className='border-b'>
          <tr>
            <th className='text-left px-2 py-6 text-lg'>Title</th>
            <th className='text-left px-2 py-6 text-lg w-96'>Provider</th>
          </tr>
        </thead>
        <tbody>
          {list.isSuccess &&
            list?.data?.experiences.map((exp) => (
              <tr
                key={exp?.meta?.id}
                className='odd:bg-gray-100 even:bg-white'
              >
                <td className='p-2 overflow-hidden text-ellipsis'>
                  <button
                    className='hover:underline hover:text-blue-400
                    cursor-pointer w-full h-full text-left py-2'
                    onClick={(e) => visitCourse(exp)}
                  >
                    {getDeeplyNestedData(config.data?.course_information?.course_title, exp)}
                  </button>
                </td>
                <td className='p-2'>
                  {getDeeplyNestedData(config.data?.course_information?.course_provider, exp)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* When there are no courses */}
      {list.isSuccess && list?.data?.experiences.length === 0 && (
        <div className='text-center font-medium py-2 bg-white/90 rounded-b'>
          No courses added yet.
        </div>
      )}
    </DefaultLayout>
  );
}
