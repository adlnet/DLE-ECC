'use strict';

import {EyeIcon, EyeOffIcon} from "@heroicons/react/outline";
import { Switch } from "@headlessui/react";


export default function PublicPrivateToggle({currentListInfo, toggleListVisibility }) {
    return (
        <>
            {/* toggle switch */}
            <div className='flex gap-2 items-center font-semibold text-lg'>
            <label htmlFor='public toggle'>Set Visibility:</label>
            <Switch
            title='toggle'
            checked={currentListInfo.public}
            onChange={toggleListVisibility}
            className={`${
                currentListInfo.public ? 'bg-green-500' : 'bg-gray-400'
            }
            relative inline-flex flex-shrink-0 h-[28px] w-[48px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-1 focus-visible:ring-blue-400 focus-visible:ring-opacity-75`}
            >
            <span className='sr-only'>Use setting</span>
            <span
                aria-hidden='true'
                className={`${
                currentListInfo.public ? 'translate-x-[20px]' : 'translate-x-0'
                }
            pointer-events-none inline-flex h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 justify-center items-center`}
            >
                {currentListInfo.public ? (
                <EyeIcon className='h-4 text-gray-700' />
                ) : (
                <EyeOffIcon className='h-4 text-gray-500' />
                )}
            </span>
            </Switch>
            </div>

            {/* info about the toggle */}
            <p className='my-2'>
            {currentListInfo.public
            ? 'Public list, viewable by other users.'
            : 'Private List, only you can see it.'}
            </p>
        </>
    )
}