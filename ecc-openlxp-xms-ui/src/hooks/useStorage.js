'use strict';

import { useCallback, useEffect, useState } from 'react';

function useStorage(key, defaultValue, storageObject) {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue != null){
      let parseJSON = null;
      try{
        parseJSON = JSON.parse(jsonValue);
      }catch(error){
        console.log("Storage parsing was not able to be processed!")
      }
      return parseJSON;
    } 

    if (typeof initialValue === 'function') {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
}

export function useLocalStorage(key, defaultValue) {
  if (typeof window !== 'undefined') {
    const useLocal = useStorage(key, defaultValue, localStorage)
    return useLocal;
  }
  return [defaultValue]
}

export function useSessionStorage(key, defaultValue) {
  if (typeof window !== 'undefined') {
    const useSession = useStorage(key, defaultValue, sessionStorage)
    return useSession;
  }
  return [defaultValue]
}