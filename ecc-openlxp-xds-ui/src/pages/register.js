'use strict';

import {
  CheckCircleIcon,
  RefreshIcon,
  UserAddIcon,
  XCircleIcon,
} from '@heroicons/react/outline';
import {
  containsLowercase,
  containsNumber,
  containsSpace,
  containsSpecialCharacter,
  containsUppercase,
  isLongEnough,
  isValidEmail,
} from '@/utils/validation';
import { useEffect, useState } from 'react';

import { authRegister } from '@/config/endpoints';
import { axiosInstance } from '@/config/axiosConfig';
import { unstable_batchedUpdates } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/hooks/useConfig';
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import Image from 'next/image';
import Link from 'next/link';

function validateEmail (email, setEmailError, setError) {
  if (email === '') {
    return unstable_batchedUpdates(() => {
      setEmailError(true);
      setError('Email is required');
    });
  }

  else if (!isValidEmail(email)) {
    return unstable_batchedUpdates(() => {
      setEmailError(true);
      setError('Email is invalid');
    });
  }

  return unstable_batchedUpdates(() => {
    setEmailError(false);
    setError('');
  });
};

function validatePassword (password, setPasswordError, setError) {
  if (password === '') {
    return unstable_batchedUpdates(() => {
      setPasswordError(true);
      setError('Password is required');
    });
  }

  else if (!isLongEnough(password, 8)) {
    return unstable_batchedUpdates(() => {
      setPasswordError(true);
      setError('Password must be at least 8 characters');
    });
  }

  else if (!containsLowercase(password)) {
    return unstable_batchedUpdates(() => {
      setPasswordError(true);
      setError('Password must contain at least one lowercase letter');
    });
  }

  else if (!containsUppercase(password)) {
    return unstable_batchedUpdates(() => {
      setPasswordError(true);
      setError('Password must contain at least one uppercase letter');
    });
  }

  else if (!containsSpecialCharacter(password)) {
    return unstable_batchedUpdates(() => {
      setPasswordError(true);
      setError('Password must contain at least one special character');
    });
  }

  else if (!containsNumber(password)) {
    return unstable_batchedUpdates(() => {
      setPasswordError(true);
      setError('Password must contain at least one number');
    });
  }

  else if (containsSpace(password)) {
    return unstable_batchedUpdates(() => {
      setPasswordError(true);
      setError('Password must not contain any spaces');
    });
  }

  return unstable_batchedUpdates(() => {
    setPasswordError(false);
    setError('');
  });
};

function validateConfPassword (confPassword, password, setConfPasswordError, setError) {
  if (confPassword === '') {
    return unstable_batchedUpdates(() => {
      setConfPasswordError(true);
      setError('Confirmation password is required');
    });
  }

  if (confPassword !== password) {
    return unstable_batchedUpdates(() => {
      setConfPasswordError(true);
      setError('Passwords do not match');
    });
  }

  return unstable_batchedUpdates(() => {
    setConfPasswordError(false);
    setError('');
  });
};

function validateName (name, updateFn, subject, setError) {
  if (!isLongEnough(name, 2)) {
    return unstable_batchedUpdates(() => {
      updateFn(true);
      setError(`${subject} must be at least 2 characters`);
    });
  }

  return unstable_batchedUpdates(() => {
    updateFn(false);
    setError('');
  });
};

export default function Register() {
  const router = useRouter();
  const { register, user } = useAuth();
  const config = useConfig();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmationPassword: '',
    first_name: '',
    last_name: '',
  });
  const [emailError, setEmailError] = useState(true);
  const [passwordError, setPasswordError] = useState(true);
  const [confPasswordError, setConfPasswordError] = useState(true);
  const [firstNameError, setFirstNameError] = useState(true);
  const [lastNameError, setLastNameError] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push('/');
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    axiosInstance
      .post(authRegister, {
        email: credentials.email,
        password: credentials.password,
        first_name: credentials.first_name,
        last_name: credentials.last_name,
      })
      .then((res) => {
        router.push('/');
        register(res.data);
      })
      .catch((err) => {
        console.log("Account registration failed.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateCredentials = (event) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
  };

  const isError = () => {
    return (
      emailError ||
      passwordError ||
      confPasswordError ||
      firstNameError ||
      lastNameError
    );
  };

  // updaters for each field
  useEffect(() => {
    validatePassword(credentials.password,  setPasswordError, setError);
  }, [credentials.password]);

  useEffect(() => {
    validateConfPassword(credentials.confirmationPassword, credentials.password, setConfPasswordError, setError);
  }, [credentials.confirmationPassword]);

  useEffect(() => {
    validateEmail(credentials.email, setEmailError, setError);
  }, [credentials.email]);

  useEffect(() => {
    validateName(credentials.last_name, setLastNameError, 'Last name', setError);
  }, [credentials.last_name]);

  useEffect(() => {
    validateName(credentials.first_name, setFirstNameError, 'First name', setError);
  }, [credentials.first_name]);

  const checkSpecialChar =(e)=>{
    if(/[<>/?+={};#$%&*()`~\\]/.test(e.key)){
     e.preventDefault();
    }
   };

   const checkSpecialCharPass =(e)=>{
    if(/[<>/{};]/.test(e.key)){
      e.preventDefault();
    }
   };

  const imagePath = '/_next/static/media/logo.ed71202b.png';
  return (
    <DefaultLayout>
      <div className='text-center mt-10'>
        <Image src={imagePath} alt='logo' width={100} height={100} priority={true}/>
        <h1 className='font-bold text-xl'>Create your account</h1>
        <p className='text-sm'>
          or&nbsp;
          <Link href={'/login'} passHref>
            <button className='text-blue-400 hover:text-blue-600 hover:text-shadow'>
              Sign in to your account
            </button>
          </Link>
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        onChange={handleUpdateCredentials}
        className='mt-8 w-[34rem] mx-auto bg-white px-10 py-6 shadow-md rounded-md flex flex-col justify-center items-center'
      >
        <div className='w-full flex gap-4'>
          <input
            type='text'
            name='first_name'
            placeholder='First Name'
            className='w-1/2 rounded p-2 mt-4 shadow'
            maxLength="200"
            onKeyPress={(e)=>checkSpecialChar(e)}
            required
          />
          <input
            type='text'
            name='last_name'
            placeholder='Last Name'
            className='w-1/2 rounded p-2 mt-4 shadow'
            maxLength="200"
            onKeyPress={(e)=>checkSpecialChar(e)}
            required
          />
        </div>
        <input
          type='email'
          name='email'
          placeholder='Email'
          onKeyPress={(e)=>checkSpecialCharPass(e)}
          className='w-full rounded p-2 mt-4 shadow'
          maxLength="200"
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          className='w-full rounded p-2 mt-4 shadow'
          required
        />
        <input
          type='password'
          name='confirmationPassword'
          placeholder='Confirm Password'
          className='w-full rounded p-2 mt-4 shadow'
          required
        />
        <div className='text-gray-500 mt-2'>
          <h4 className='text-center font-semibold'>
            New Account Requirements
          </h4>
          <div className='text-xs'>
            <p
              className={`${
                firstNameError || lastNameError
                  ? 'text-red-400'
                  : 'text-green-600'
              } flex`}
            >
              {firstNameError || lastNameError ? (
                <XCircleIcon className='inline-block h-4 w-4 mr-2' />
              ) : (
                <CheckCircleIcon className='inline-block h-4 w-4 mr-2' />
              )}
              First & Last names must be at least 2 characters long
            </p>
            {emailError ? 
              <p className= 'text-red-400'>
                <XCircleIcon className='inline-block h-4 w-4 mr-2'/>
                Email must be valid </p> : 
              <p className= 'text-green-600'>
                <CheckCircleIcon className='inline-block h-4 w-4 mr-2'/>
                Email must be valid</p>
            }
            <p
              className={`${passwordError ? 'text-red-400' : 'text-green-600'}`}
            >
              {passwordError ? (
                <XCircleIcon className='inline-block h-4 w-4 mr-2' />
              ) : (
                <CheckCircleIcon className='inline-block h-4 w-4 mr-2' />
              )}
              Password must be at least 8 characters long and contain at least
              one of each:
            </p>
            <ul
              className={`pl-6 list-disc list-inside ${
                passwordError ? 'text-red-400' : 'text-green-600'
              }`}
            >
              <li>Uppercase letter</li>
              <li>Lowercase letter</li>
              <li>Special character</li>
              <li>Number</li>
            </ul>
            <p
              className={`${
                confPasswordError ? 'text-red-400' : 'text-green-600'
              }`}
            >
              {confPasswordError ? (
                <XCircleIcon className='inline-block h-4 w-4 mr-2' />
              ) : (
                <CheckCircleIcon className='inline-block h-4 w-4 mr-2' />
              )}
              Confirmation: Passwords must match
            </p>
          </div>
        </div>
        <p
          data-testid='error-message'
          className='text-red-500 text-sm block h-2 mt-2'
        >
          {error}
        </p>
        <button
          disabled={isError()}
          type='submit'
          className='disabled:opacity-50 disabled:saturate-50 disabled:cursor-not-allowed mt-6 items-center inline-flex gap-2 text-blue-400 rounded-md hover:shadow-md bg-blue-50 hover:bg-blue-400 hover:text-white px-4 py-2 transition-all duration-75 ease-in-out border-blue-400 border-2 outline-none focus:ring-2 ring-blue-400 max-w-max'
        >
          {loading ? (<RefreshIcon className='inline-block h-4 w-4 mr-2 animate-spin' />) 
          : ( <UserAddIcon className='inline-block h-4 w-4 mr-2' />)}
          Create Account
        </button>
        <p className={'my-8 relative border-b-2 w-full'}>
          <span className='absolute top-1/2 left-1/2 transform text-center -translate-x-1/2 -translate-y-1/2 bg-white px-2 w-max'>
            or continue with
          </span>
        </p>
        <div className='flex flex-col gap-4'>
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
        </div>
      </form>
    </DefaultLayout>
  );
}
