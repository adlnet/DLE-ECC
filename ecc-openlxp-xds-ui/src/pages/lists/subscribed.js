'use strict';

import { BookOpenIcon, UsersIcon } from '@heroicons/react/solid';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useSubscribedLists } from '@/hooks/useSubscribedLists';
import { useUnsubscribeFromList } from '@/hooks/useUnsubscribeFromList';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import Link from 'next/link';
import React, { useEffect } from 'react';

export default function Subscribed() {
  const { user } = useAuth();
  const {
    data: subscribed,
    isSuccess,
    isError,
    error,
  } = useSubscribedLists(user?.token);
  const { mutate: unsubscribe } = useUnsubscribeFromList(user?.token);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
    if (isError && error.response.status === 401) router.push('/401');
    if (isError && error.response.status === 403) router.push('/403');
  }, []);

  return (
    <DefaultLayout>
      <div className='mt-10 pb-20'>
        <h1 className='pb-4 border-b mb-8 font-semibold text-3xl'>
          Subscribed Lists
        </h1>
        <div className='grid grid-cols-3 gap-8'>
          {isSuccess &&
            subscribed.map((list) => {
              return (
                <div
                  className='relative w-full bg-white border border-gray-200 shadow rounded-md'
                  key={list.id}
                >
                  <h2 className='font-semibold text-lg px-2 pt-2'>
                    {list.name}
                  </h2>
                  <span className='inline-flex gap-2 px-2'>
                    <div className='inline-flex -py-1 justify-start items-center gap-0.5 text-sm bg-blue-100 border border-blue-500 rounded-full px-2 text-blue-500'>
                      <UsersIcon className='h-3 w-3' />{' '}
                      {list.subscribers.length}
                    </div>
                    <div
                      className='inline-flex -py-1 justify-start items-center gap-0.5 text-sm
                    bg-green-100 border border-green-500 rounded-full px-2 text-green-500'
                    >
                      <BookOpenIcon className='h-3 w-3 mt-0.5' />
                      {list.experiences.length}
                    </div>
                  </span>
                  <p className='text-base line-clamp-4 pt-3 mb-20 px-2'>
                    {list.description}
                  </p>
                  <div className='absolute bottom-0 left-0 w-full flex justify-around items-center border-t divide-x mt-2'>
                    <button
                      onClick={() => unsubscribe({ id: list.id })}
                      className='cursor-pointer flex-shrink-0 py-4 hover:bg-gray-100 w-1/2 text-center hover:text-red-500'
                    >
                      Unsubscribe
                    </button>

                    <Link href={`/lists/${list.id}`} className='cursor-pointer flex-shrink-0 py-4 hover:bg-gray-100 w-1/2 text-center' passHref>
                      <button>
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          {isSuccess && subscribed.length === 0 && (
            <div className='text-center w-full col-span-3'>
              <h2 className='text-lg px-2 pt-2 font-medium'>
                You are not subscribed to any lists.
              </h2>
              <div className='pt-8'>
                <Link href='/lists/searchLists' passHref>
                  <button className='max-w-max items-center inline-flex gap-2 text-blue-400 rounded-md hover:shadow-md bg-blue-50 hover:bg-blue-400 hover:text-white px-4 py-2 transform transition-all duration-150 ease-in-out border-blue-400 border-2 outline-none focus:ring-2 ring-blue-400'>
                    <div>Click Here to Search for a list.</div>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
