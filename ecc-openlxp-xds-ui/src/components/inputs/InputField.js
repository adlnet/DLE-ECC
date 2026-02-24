'use strict';

import React from 'react';

export default function InputField({
  type,
  placeholder,
  name,
  value,
  onChange,
  required,
}) {
  const checkSpecialChar =(e)=>{
    if(/[<>/?+={};#$%&*()`~\\]/.test(e.key)){
     e.preventDefault();
    }
   };
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      name={name}
      maxLength="200"
      onKeyPress={(e)=>checkSpecialChar(e)}
      className='shadow focus:shadow-md rounded-md p-2 w-full border border-gray-200 text-gray-700 focus:ring-2 ring-blue-400 outline-none  transition-all  duration-200'
    />
  );
}
