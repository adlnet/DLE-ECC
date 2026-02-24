'use strict';

import {
  ArchiveIcon,
  CollectionIcon,
  FolderIcon,
  LogoutIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import { ChevronUpIcon, UserIcon, ViewListIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

const listMenuButtons = [
  {
    name: 'My Lists',
    icon: <FolderIcon className='h-4 w-4' />,
    href: '/lists/owned',
  },
  {
    name: 'Subscribed',
    icon: <CollectionIcon className='h-4 w-4' />,
    href: '/lists/subscribed',
  },
  {
    name: 'Saved Search',
    icon: <ViewListIcon className='h-4 w-4' />,
    href: '/lists/savedSearches',
  },
];

const searchMenuButtons = [
  {
    name: 'Search Courses',
    icon: <SearchIcon className='h-4 w-4' />,
    href: '/',
  },
  {
    name: 'Search Lists',
    icon: <ArchiveIcon className='h-4 w-4' />,
    href: '/lists/searchLists',
  },
];

const MenuButton = ({ name, icon, href }) => {
  const router = useRouter();
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={() => router.push(href)}
          id={name.toLowerCase().replaceAll(/\s/g, '-')}
          className={`${
            active ? 'bg-gray-100' : 'bg-white'
          } p-1 transition-colors duration-75 ease-in-out cursor-pointer rounded-md w-full flex justify-start gap-2 items-center`}
        >
          {icon}
          {name}
        </button>
      )}
    </Menu.Item>
  );
};

export default function UserMenu() {
  const {
    user: {
      user: { first_name },
    },
    logout,
  } = useAuth();

  return (
    <Menu
      as='div'
      className='relative inline-block text-left mt-0.5 max-w-min '
    >
      {({ open }) => (
        <div className='relative'>
          <Menu.Button className='group inline-flex justify-end items-center bg-blue-500 hover:bg-opacity-95 hover:shadow transform transition-all ease-in-out duration-150 px-2 py-1 text-white gap-2 font-semibold rounded-md outline-none focus:ring-4 ring-blue-400'>
            <div
              id='avatar'
              className='h-8 w-8 rounded-full flex-shrink-0 bg-white shadow-inner-sm overflow-hidden flex justify-center items-center'
            >
              <UserIcon className='h-6 text-blue-500 text-shadow' />
            </div>
            <div className='line-clamp-1'>{first_name}</div>

            <ChevronUpIcon
              className={`${
                open
                  ? 'shadow-inner-sm'
                  : 'rotate-180  group-hover:bg-blue-500'
              } text-white h-5 rounded-md transition-all ease-in-out duration-75 `}
            />
            {/* <ChevronDownIcon className='h-4 w-4' /> */}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-150'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-100'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 origin-top w-44 mt-2 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
              <div className='text-gray-700'>
                <div className='p-2'>
                  <h3 className='text-md font-semibold w-full border-b'>
                    Lists
                  </h3>
                  <div className='grid gap-1 pt-1'>
                    {listMenuButtons.map((button) => (
                      <MenuButton key={button.name} {...button} />
                    ))}
                  </div>
                </div>
              </div>
              <div className='p-2 flex w-full justify-between items-center'>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`flex justify-start items-center gap-2 hover:bg-gray-50 rounded-md p-1 transition-all duration-75 ease-in-out text-sm hover:shadow-inner-sm shadow-md border-gray-200 border hover:border-transparent ${
                        active && 'ring-2 ring-blue-500 ring-offset-1'
                      } hover:ring-transparent`}
                    >
                      <LogoutIcon className='h-4 w-4' />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </div>
      )}
    </Menu>
  );
}
