'use strict';

import React, { useEffect, useState } from 'react';

import { LoginIcon } from '@heroicons/react/outline';
import { authLogin } from '@/config/endpoints';
import { axiosInstance } from '@/config/axiosConfig';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/hooks/useConfig';
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { user, login } = useAuth();
  const config = useConfig();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (user) router.push('/');
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [errorMsg, setErrorMsg] = useState();

  const handleLogin = (event) => {
    event.preventDefault();
    if (credentials.username === '' || credentials.password === '') {
      setErrorMsg('All fields required');
    }
    axiosInstance
      .post(authLogin, credentials)
      .then((res) => {
        login(res.data);
        router.push('/');
      })
      .catch((error) => {
        setErrorMsg('Invalid credentials');
      });
  };

  const checkSpecialChar =(e)=>{
    if(/[<>/{};]/.test(e.key)){
     e.preventDefault();
    }
  };

  const imagePath = '/_next/static/media/logo.ed71202b.png';

  return (
    <DefaultLayout>
      <div className={'pb-32'}>
        <div className='mt-10 mx-52 flex flex-col items-center justify-between'>
          <Image src={imagePath} alt={'home'} height={'200'} width={'200'} priority={true}/>
          <p className={'mt-2 text-2xl font-extrabold '}>
            Sign in to your account
          </p>
          <span>
            or &nbsp;
            <Link href={'/register'} passHref>
              <button
                id={'create-account-button'}
                className='text-blue-400 hover:underline hover:text-blue-500 cursor-pointer transition-all duration-150 ease-in-out'
              >
                Create an Account
              </button>
            </Link>
          </span>
        </div>
        <form
          onSubmit={handleLogin}
          onChange={(event) => handleChange(event)}
          className='w-1/3 mx-auto bg-white p-8 rounded shadow grid gap-4 mt-10'
        >
          <input
            type='text'
            name='username'
            title='username'
            placeholder='Email'
            maxLength="200"
            onKeyPress={(e)=>checkSpecialChar(e)}
            className='shadow focus:shadow-md rounded-md p-2 w-full border border-gray-200 text-gray-700 focus:ring-2 ring-blue-400 outline-none  transition-all  duration-200'
          />
          <input
            type='password'
            name='password'
            title='password'
            placeholder='Password'
            className='shadow focus:shadow-md rounded-md p-2 w-full border border-gray-200 text-gray-700 focus:ring-2 ring-blue-400 outline-none  transition-all  duration-200'
          />
          <span>{errorMsg}</span>
          <button
            className='mt-4 mx-auto max-w-max items-center inline-flex gap-2 text-blue-400 rounded-md hover:shadow-md bg-blue-50 hover:bg-blue-400 hover:text-white px-4 py-2 transform transition-all duration-75 ease-in-out border-blue-400 border-2 outline-none focus:ring-2 ring-blue-400'
            type='submit'
            id='login-button'
          >
            <LoginIcon className='w-5 h-5' />
            Login
          </button>

          <p className={'my-8 relative border-b-2 w-full'}>
            <span className='absolute top-1/2 left-1/2 transform text-center -translate-x-1/2 -translate-y-1/2 bg-white px-2 w-max'>
              or continue with
            </span>
          </p>
          {config.isSuccess &&
            config.data.single_sign_on_options.map(({ name, path }) => {
              return (
                <a
                  href={path}
                  className='bg-blue-500 py-2 px-4 rounded inline-block text-white hover:opacity-90 hover:shadow transform transition-all duration-100 ease-in-out font-semibold max-w-max mx-auto'
                  key={name}
                >
                  {name}
                </a>
              );
            })}
        </form>
      </div>
    </DefaultLayout>
  );
}
