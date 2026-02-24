'use strict';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NotAuthorized({ errorMessage }) {
    const router =  useRouter();
    const [count, setCount] = useState(15);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCount(prev=>prev-1);
        }, 1000);
        if(count<1){
            clearInterval(timer);
        }
    },[]);

    useEffect(() => {
        if(count<1){
            router.push("/")
        }
    }, [count]);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen gap-8'>
        <div className='inline-flex -mt-16 items-center gap-4'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className='text-5xl font-semibold'>401 Unauthorized </h1>
        </div>
        <div className='inline-flex items-center gap-4'>
            <h2 className='text-2xl flex-col'>Redirecting in</h2>
            <div className='text-2xl' id="counter">{count}</div>
        </div>
        <Link href={'/'} passHref>
        <button
                id={'create-account-button'}
                className='flex justify-center items-center gap-2 text-blue-400 rounded-md hover:shadow-md bg-blue-50 hover:bg-blue-400 hover:text-white pl-2 pr-4 py-2 transform transition-all duration-150 ease-in-out border-blue-300 border-2 outline-none focus:ring-2 ring-blue-300`'
              > Click Here to be Redirected</button>
              </Link>
        </div>
    )
}