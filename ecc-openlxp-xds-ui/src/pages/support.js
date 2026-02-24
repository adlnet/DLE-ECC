import { Disclosure, Transition } from '@headlessui/react'

import { ChevronDownIcon } from '@heroicons/react/outline';
import DefaultLayout from '@/components/layouts/DefaultLayout';

export default function Support() {

    const aboutContent = [
    {   title: "What is ECC?",
        answer: "The Enterprise Course Catalog (ECC) is a learning and experience discovery service. Course catalogs are stored in a centralized location for consistent transport. ECC aggregates metadata describing learning experiences from internal and external sources. Course catalogs across organizations are now easier to manage, join and identify ownership. This improves the ability to find courses across all of Department of Defense’s organizations."
    },
    {   title: "How do I participate?",
        answer: "Users can login via SSO Keycloak or register a new account. Please navigate to the top right-hand corner and click on the “Sign In” button to begin."
    },
    {   title: "Who owns the content?",
        answer: "The content will remain owned by the source provider organizations within Department of Defense. Learners can navigate to Experience Discovery Service (XDS) and view courses hosted by providers. "
    },
    {   title: "How does the technology work?",
        answer: "ECC contains multiple software components which pulls data from multiple disparate systems’ data and displays it in one location for learners to quickly query and search courses across all of DoD."
    },
    {   title: "Where do I learn more?",
        answer: "ECC has documents, user guides, demos, and videos to help you learn about components. You can access these materials here."
    },
    ]

    const navigationContent = [
    {   title: "How do I sign up or register?",
        answer: "You can click “Sign Up”  at the top right of the screen. ECC will ask you to enter your name, email, password to register. Be sure to save your password in secure location to login into ECC."
    },
    {   title: "Do you have SSO login?",
        answer: "If you have never logged into ECC portal, you can use your SSO Keycloak. Click on the “Sign in” button at the top right of the screen. On the bottom of the sign in prompt, click on “SAML” or “Keycloak” button to get started."
    },
    {   title: "CAC support?",
        answer: "The best way to connect your CAC with ECC is to set up your account first within your organization then in ECC select “Sign in” and click on “SAML” or “Keycloak” button. Information about obtaining and managing your CAC or USIC card on the DOD common access card website at: https://www.defense.gov/Help-Center/Article/Article/2742543/dod-id-card-issuance-and-replacement/"
    },
    {   title: "How do I search for a course?",
        answer: "Start in the Experience Discovery Service and click on the search bar. Begin by typing keywords or the name of your course then click the search magnifier icon. Upon searching you will be presented with a listing of courses relevant to your search."
    },
    {   title: "How do I access course(s)?",
        answer: "To access courses, begin by searching for a course within Experience Discovery Service. Once you have search results appear you can click on the title of a particular course to view the course details of that course."
    },
    {   title: "How do I sign up for a subscription list?",
        answer: "Upon logging into Experience Discovery Service (XDS), your name will be presented on the top right of the screen. In the top navigation bar, you will see a button labeled “Search Lists”. Click on this button to view lists you can subscribe to. If you wish to subscribe to a particular list, click on the “Subscribe” button associated to the list you wish to subscribe to. "
    },
    {   title: "How do I view my subscribed lists?",
        answer: "Upon logging into Experience Discovery Service (XDS), your name will be presented on the top right of the screen. Click onto your name at the top right of the screen. Upon clicking onto your name, a drop down will appear with several options to choose from. Click on “Subscribed” to view all lists your account has subscribed to."
    },
    {   title: "How do I create a private list?",
        answer: "Upon logging into Experience Discovery Service, click into the Search box and type the name or keywords related to your course and click the search magnifier icon. You will see a list of search results populate. Next to name of each course a ‘Save’ button will appear. Click this “Save” button to add the course to a private list. A popup will appear which will prompt you to enter a name and description of your list you’d like to create. Once you input your information click “create”. Once your list is created you will have the ability to add courses to the list. Click “Add” next to the list you would like to add to your course to. Go to your profile by clicking on top right avatar and click My List. The name and link for your course will be in My List."
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
                    <Disclosure.Button className="flex items-center rounded-lg justify-between text-left w-full p-5 font-medium border bg-blue-500 text-white border-gray-300 hover:opacity-90 hover:shadow ">
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
                    <Disclosure.Panel className="p-5 rounded-lg border border-t-0 ml-2 border-gray-300 focus:ring-4 focus:ring-gray-200 focus:bg-gray-50">
                        {question.answer}
                    </Disclosure.Panel>
                    </Transition>
                </div> )}
                </Disclosure>
            );
        });

    return (
        <DefaultLayout>
            <div className='mt-10 pb-20'>
                <h1 className='pb-4 border-b mb-8 text-3xl font-semibold'>Support</h1>
                <h2 className='text-xl font-semibold pb-2'>About</h2>
                {panelCode(aboutContent)}
                <h2 className='text-xl font-semibold pb-2 mt-4'>Navigating the Course Catalog</h2>
                {panelCode(navigationContent)}
            </div>
        </DefaultLayout>
    );
}
