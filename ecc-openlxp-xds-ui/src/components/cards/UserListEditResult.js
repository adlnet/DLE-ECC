'use strict';

import React, { Fragment } from 'react';

import { Transition } from '@headlessui/react';

export default function UserListResult({ result, onRemove }) {
  const { Course, meta } = result;
  return (
    <Transition
      show={true}
      as={Fragment}
      enter='transition ease-out duration-300'
      enterFrom='transform opacity-0'
      enterTo='transform opacity-100'
      leave='transition ease-in duration-100'
      leaveFrom='transform opacity-100'
      leaveTo='transform opacity-0'
    >
      <div className='inline-grid grid-cols-6 w-full gap-2 p-2 items-center'>
        <div className='col-span-3 line-clamp-1'>{Course.CourseTitle}</div>
        <div className='col-span-2'>{Course.CourseProviderName}</div>
        <div className='col-span-1 flex justify-center'>
          <button
            onClick={() => onRemove(meta.metadata_key_hash)}
            className='px-2 py-2 border rounded-md hover:shadow shadow-none border-red-600 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white w-min transform transition-all duration-100 ease-in-out'
          >
            Remove
          </button>
        </div>
      </div>
    </Transition>
  );
}
