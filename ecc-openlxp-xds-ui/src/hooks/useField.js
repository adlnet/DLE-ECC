'use strict';

import { useState } from 'react';

export default function useField(initialValue) {
  const [fields, setFields] = useState(() => initialValue);

  function updateKeyValuePair(key, value) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function resetKey(key) {
    const modified = { ...fields };
    modified[key] = '';
    setFields(modified);
  }
  

  return { fields, updateKeyValuePair, resetKey };
}
