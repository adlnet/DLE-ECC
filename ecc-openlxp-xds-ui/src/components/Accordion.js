'use strict';

import {ChevronDownIcon} from '@heroicons/react/solid';
import { Disclosure, Transition } from '@headlessui/react';


export default function Accordion({ title, content, className }) {

    return (
        <Disclosure>
        {({ open }) => (
            <div className='hover:bg-gray-200 hover:rounded-lg'>
                <Disclosure.Button className={'flex items-center rounded-lg justify-between text-left w-full p-5 font-medium border border-gray-300 hover:opacity-90 hover:shadow'}>
                    {title}
                    <ChevronDownIcon className={`w-6 h-6 ${open ? "transform rotate-180" : ""} `} />
                </Disclosure.Button>

                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                <Disclosure.Panel className="p-5 rounded-lg border border-t-0 ml-2 border-gray-300 focus:ring-4 focus:ring-gray-200 focus:bg-gray-50">
                    {content}
                </Disclosure.Panel>
                </Transition>
            </div> )}
        </Disclosure>
    );
}
