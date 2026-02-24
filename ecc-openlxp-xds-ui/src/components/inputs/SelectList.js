'use strict';

import { ChevronDownIcon } from '@heroicons/react/solid';
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';

export default function SelectList({
  options,
  keyName,
  initialValue,
  onChange,
  onClear,
}) {
  const [selected, setSelected] = useState(initialValue);
  return (
    <Menu as='div' className='relative inline-block text-left mt-0.5'>
      <div className='flex flex-col gap-2'>
        <Menu.Button
          title={`${keyName} filter`}
          className='text-gray-800 items-center gap-2 inline-flex  justify-between w-36 bg-white shadow-md px-2 py-1 rounded-md focus:ring-2 ring-blue-400 transform transition-all duration-150 ease-in-out outline-none'
        >
          <div className='line-clamp-1'>{selected || keyName}</div>
          <ChevronDownIcon className='h-4 w-4 text-gray-600' />
        </Menu.Button>
        <div className='flex justify-end'>
          <button
            id={options?.field_name}
            className='w-min text-gray-600 hover:text-blue-400 cursor-pointer text-xs text-right my-2 px-2 hover:underline focus:ring-2 ring-blue-300 outline-none rounded-full -mt-1 focus:text-blue-300 focus-text-shadow'
            title='clear selection'
            onClick={() => {
              onClear(options?.field_name);
              setSelected(null);
            }}
          >
            clear
          </button>
        </div>
      </div>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-100'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute left-0 top-10 w-44 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-2 ring-blue-300 outline-none line-clamp-1'>
          <div className='p-1'>
            {options?.buckets?.map((group) => {
              return (
                <Menu.Item key={group.key}>
                  {({ active }) => (
                    <button
                      name={options.field_name}
                      value={group.key}
                      onClick={(e) => {
                        onChange(e);
                        setSelected(group.key);
                      }}
                      className={`${
                        active && 'bg-gray-50'
                      } cursor-pointer rounded-md w-full text-left flex justify-between items-center `}
                    >
                      {group.key}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
