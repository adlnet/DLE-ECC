'use strict';

import { BellIcon } from '@heroicons/react/outline';
import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { allNotification, allRead } from '@/config/endpoints';
import { axiosInstance } from '@/config/axiosConfig';
import { useRouter } from 'next/router';

export default function Notifications() {
    const router = useRouter();

    let [data, setData] = useState({});

    useEffect(() => {
        setTimeout(() => {
        }, 200);

        // Requesting data from the API endpoint
        axiosInstance
            .get(allNotification)
            .then((res) => {
                setData(res.data);
            })

            // If there is an error.
            .catch((err) => {
                console.log("Failed to retrieve data from endpoint")
          });
      }, []);

      const getAllRead = () => {
        return () => {
          axiosInstance
            .get(allRead)
    
            let temp = data.all_list
            for (const notif of temp) {
                notif.unread = false;
            }

            setData((prev) => ({
                ...prev,
                all_list: temp   
              }));
        }
      };

    return (
        <Menu
        as='div'
        className='relative inline-block text-left max-w-min '
        >
        {({ open }) => (
            <div className='relative'>
            <Menu.Button >
                <div className='static m-4 h-10 flex  '>
                    <BellIcon className='static p-2 w-10 h-10 text-gray-500 border border-gray-500 hover:text-gray-900 hover:border-gray-900' /> 
                    {data?.all_list && data?.all_list[0]?.unread ? <div className='rounded-full inline-flex bg-blue-400 h-3.5 w-3.5 items-center justify-center align-center absolute right-3 top-3'/> : <></>}
                </div>
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
                <Menu.Items className='absolute right-0 origin-top w-64 mt-2 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
                <div className='text-gray-700'>
                    <div className='p-2'>
                    <h3 className='text-md font-semibold text-center w-full border-b'>
                        Notifications
                    </h3>
                    <div className='grid gap-1 pt-1'>
                        {data?.all_list && data?.all_list?.map((list) => {
                        return (
                            <div className='flex felx-col border vertical-align-middle items-center justify-center align-center' key={list.id}>
                                {list.unread ? (
                                    <div className='m-1 rounded-full inline-flex bg-blue-400 h-3 w-3 items-center justify-center align-center '/>)
                                    : (<div> </div>)}
                                <button
                                key={list.id}
                                onClick={() => {router.push(`/lists/${list.actor_object_id}`)}}
                                className={` inline-flex justify-between w-full bg-white rounded-md py-2 px-1 hover:shadow-md hover:underline hover:text-blue-400`}
                                >
                                {list.data.added.length} {list.verb} to {list.data.list_name}
                                </button>
                            </div>
                        );
                        })}
                    </div>
                    </div>
                </div>
                <div className='p-2 flex w-full justify-between items-center'>
                    <Menu.Item>
                    {({ active }) => (
                        <button
                        onClick={getAllRead()}
                        className={`flex justify-center items-center gap-2 hover:bg-gray-50 rounded-md p-1 transition-all duration-75 ease-in-out text-sm hover:shadow-inner-sm shadow-md border-gray-200 border hover:border-transparent ${
                            active && 'ring-2 ring-blue-500 ring-offset-1'
                        } hover:ring-transparent`}
                        >
                        Mark All as Read
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