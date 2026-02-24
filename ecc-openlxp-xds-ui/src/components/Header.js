'use strict';

import { backendHost } from '@/config/endpoints';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/hooks/useConfig';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Notifications from './menus/Notifications';
import UserMenu from '@/components/menus/UserMenu';
import logo from '@/public/logo.png';

const menuItems = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Search Lists',
    path: '/lists/searchLists',
  },
  {
    label: 'Support',
    path: '/support',
  },
];

function Button({ data }) {
  const router = useRouter();
  if (data.path === router?.asPath) {
    return (
      <Link href={data.path}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className='px-1 font-bold text-gray-800 border-b-2 border-gray-800 hover:text-gray-900'>
          {data.label}
        </a>
      </Link>
    );
  }
  return (
    <Link href={data.path}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className='transition-all duration-100 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-900'>
        {data.label}
      </a>
    </Link>
  );
}

export default function Header() {
  const { user } = useAuth();
  const config = useConfig();

  const thumbnail = useMemo(() => { 
    return (
      (config?.data?.ui_logo &&
        `${backendHost}${config?.data?.ui_logo}`) ||
      null
    );
  }, [config]);

  return (
    <header className={'bg-white w-full shadow z-50'}>
      <nav
        className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}
        aria-label={'Top'}
      >
        <div className='w-full py-4 inline-flex items-center justify-between z-50'>
          <div className={'flex items-center justify-start gap-2'}>
            <Link href={'/'} passHref>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <button
                title='home'
                id={'homepage-button'}
                className={'cursor-pointer'}
              >
              {config?.isSuccess && thumbnail ? <img
                src={thumbnail}
                alt=''
                className='h-12 w-12 m-2'
              /> : <Image src={logo} height={60} width={60} alt='' />}
              </button>
            </Link>
            {menuItems.map((item) => {
              if (item.label !== 'Search Lists') {
                return <Button key={item.label} data={item} />;
              }
              if (user) {
                return <Button key={item.label} data={item} />;
              }
            })}
          </div>
          { user ? (
             <div className='flex flex-row'>
              <Notifications />
              <div className='m-4'> <UserMenu /> </div>
            </div>
          ) : (
            <div className='space-x-4 flex flex-row'>
              <Link href={'/login'} passHref>
                <button className='disabled:hidden bg-blue-500 py-2 px-4 rounded inline-block text-white hover:opacity-90 hover:shadow transform transition-all duration-100 ease-in-out font-semibold'>
                  Sign in
                </button>
              </Link>
              <Link href={'/register'} passHref>
                <button className='disabled:hidden bg-blue-300 py-2 px-4 rounded inline-block text-white hover:opacity-90 hover:shadow transform transition-all duration-100 ease-in-out font-semibold'>
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
