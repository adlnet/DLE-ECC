'use strict';

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/solid';
import React from 'react';

export const Pagination = ({ handleSpecificPage, totalPages, currentPage }) => {
  // show the first three pages and the last three pages of the pagination
  // if the total number of pages is less than 3 show them all
  const pages = [];

  // if the minimum number of pages to show is less than one, show just the first page
  // otherwise show the minimum number of pages before the current page
  const start = Math.max(1, Math.min(currentPage - 2, currentPage - 3));

  // if possible show the 3 pages after the current page
  const end = Math.min(totalPages, currentPage + 3);

  // if the total number of pages is less than 6 show all pages
  // *centers the pages arond the current page*
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className='flex flex-row justify-between'>
      <div className='inline-flex justify-left items-center gap-2'>
        <button
          onClick={() => handleSpecificPage(1)}
          title='First'
          className={`disabled:saturate-0 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:bg-inherit flex justify-center items-center gap-2 text-blue-400 rounded-md hover:shadow-md bg-blue-50 hover:bg-blue-400 hover:text-white px-2 py-2 transform transition-all duration-150 ease-in-out border-blue-300 border-2 outline-none focus:ring-2 ring-blue-300`}
          disabled={ currentPage === 1 }
        >
          <ChevronDoubleLeftIcon className='h-6 w-6' />
        </button>

        <button
          onClick={() => handleSpecificPage(currentPage - 1)}
          className={`disabled:saturate-0 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:bg-inherit flex justify-center items-center gap-2 text-blue-400 rounded-md hover:shadow-md bg-blue-50 hover:bg-blue-400 hover:text-white pl-2 pr-4 py-2 transform transition-all duration-150 ease-in-out border-blue-300 border-2 outline-none focus:ring-2 ring-blue-300`}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className='h-6 w-6' />
          Previous
        </button>
      </div>

      <div className='inline-flex justify-center items-center gap-2'>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handleSpecificPage(page)}
            className={`${
              currentPage === page
                ? 'bg-blue-400 text-white'
                : 'bg-blue-50 text-blue-400'
            } flex justify-center items-center gap-2 rounded-md hover:shadow-md bg-blue-50 hover:bg-blue-400 hover:text-white px-2 py-2 transform transition-all duration-150 ease-in-out border-blue-300 border-2 outline-none focus:ring-2 ring-blue-300`}
          >
            {page}
          </button>
        ))}
      </div>

      <div className='inline-flex justify-left items-center gap-2'>
        <button
          onClick={() => handleSpecificPage(currentPage + 1)}
          className={`disabled:saturate-0 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:bg-inherit flex justify-center items-center gap-2 text-blue-400 rounded-md hover:shadow-md bg-blue-50 hover:bg-blue-400 hover:text-white pl-4 pr-2 py-2 transform transition-all duration-150 ease-in-out border-blue-300 border-2 outline-none focus:ring-2 ring-blue-300`}
          disabled={totalPages <= currentPage}
        >
          Next
          <ChevronRightIcon className='h-6 w-6' />
        </button>
        <button
          title='Last'
          onClick={() => handleSpecificPage(totalPages)}
          disabled={totalPages <= currentPage}
          className={`disabled:saturate-0 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:bg-inherit flex justify-center items-center gap-2 text-blue-400 rounded-md hover:shadow-md bg-blue-50 hover:bg-blue-400 hover:text-white p-2 py-2 transform transition-all duration-150 ease-in-out border-blue-300 border-2 outline-none focus:ring-2 ring-blue-300`}
        >
          <ChevronDoubleRightIcon className='h-6 w-6' />
        </button>
      </div>
    </div>
  );
};
