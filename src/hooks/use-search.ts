import debounce from 'lodash/debounce';
import { useState } from 'react';

type Return = {
  setValue: (value: string) => void;
  value?: string;
}

export function useSearch(): Return {
  const [searchTerm, setSearchTerm] = useState<string>();

  const setValue = debounce((value: string) => {
    setSearchTerm(value);
  }, 250);

  return {
    setValue,
    value: searchTerm,
  }
}