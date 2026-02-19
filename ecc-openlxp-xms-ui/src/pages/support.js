'use strict';

import { Disclosure, Transition } from '@headlessui/react'

import { ChevronDownIcon } from '@heroicons/react/outline';
import DefaultLayout from '../components/layouts/DefaultLayout';

const Support = () => {

    const aboutContent = [
    {   title: "What is ECC?",
        answer: "The Enterprise Course Catalog (ECC) is a learning and experience discovery service. Course catalogs are stored in a centralized location for consistent transport. ECC aggregates metadata describing learning experiences from internal and external sources. Course catalogs across organizations are now easier to manage, join and identify ownership. This improves the ability to find courses across all of Department of Defense’s organizations."
    },
    {   title: "What is XMS?",
        answer: "ECC’s Experience Management Service (XMS) is your one stop shop to change, modify, delete courses being presented on ECC’s Experience Discovery Service (XDS)."
    },
    ]
    const navigateContent = [
    {   title: "How to find catalogs?",
        answer: "In XMS click on the top button which says “Catalog” to search for courses."
    },
    {   title: "How to search for course?",
        answer: "In XMS select and click “Catalog”. Then click on a provider to view courses offered from that specific provider. After clicking on a provider, you should be presented a search field, at the top of the page, where you can type the name of your course then filter the results based on your search term."
    },
    {   title: "How to change/edit fields?",
        answer: "In XMS select and click “Catalog”. You will be presented a series of providers to choose from. Once you choose a provider you will see courses populated. Click onto a course to view the course’s details. On this page you will have access to an “edit” button on the top right corner. Click on this button to modify the data fields being presented. Be sure to save your changes by clicking on the “update” button located at the top right of the page."
    },
    {   title: "How to add fields?",
        answer: "In XMS select and click “Catalog”. You will be presented a series of providers to choose from. Once you choose a provider you will see courses populated. Click onto a course to view the course’s details. Click the “Edit” button. Then type in the name of the field you wish to add in “Key Name” and text into the field labeled “Value”. Click “Update” on the top right of the page to save your changes."
    },
    {   title: "How to delete fields?",
        answer: "In XMS select and click “Catalog”. You will be presented a series of providers to choose from. Once you choose a provider you will see courses populated. Click onto a course to view the course’s details. Click the “Edit” button. Then click ‘Delete’ button associated with the key value pair you wish to delete. Click “Update” on the top right of the page to save your changes."
    },
    {   title: "Need more support?",
        answer: "Contact your local system administrator."
    },
    ]
    
    const panelCode = (content) =>
        content.map((question, index) => {
            return(
                question['number']=index,
                <Disclosure key={question.number}>
                {({ open }) => (
                <div className='p-2 hover:bg-gray-200 hover:rounded-lg'>
                    <Disclosure.Button className="flex items-center rounded-lg justify-between text-left w-full p-5 font-medium border bg-blue text-white border-gray-300 dark:focus:ring-gray-800 hover:opacity-90 hover:shadow ">
                        {question.title}
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
                    <Disclosure.Panel className="p-5 rounded-lg border border-t-0 ml-2 border-gray-300 dark:border-gray-700 focus:ring-4 focus:ring-gray-200 focus:bg-gray-50">
                        {question.answer}
                    </Disclosure.Panel>
                    </Transition>
                </div> )}
                </Disclosure>
            );
        });

    return (

        // <main className="font-sans">
        <DefaultLayout>
            <div className='pb-20'>
                <h1 className="font-sans text-3xl font-semibold mb-5 pb-4 pt-8 border-b-2">Support</h1>
                <h2 className='text-2xl font-semibold pb-2'>About</h2>
                {panelCode(aboutContent)}
                <h2 className='text-xl font-semibold pb-2 mt-4'>Navigating the Expereince Management Service</h2>
                {panelCode(navigateContent)}
            </div>
        </DefaultLayout>

        // </main>
    );
};
export default Support;
  