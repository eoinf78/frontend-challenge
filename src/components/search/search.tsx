import { FC, useRef } from 'react';
import { ReactComponent as SearchIcon } from '../../img/icon-search.svg';
import { ReactComponent as CrossIcon } from '../../img/icon-cross.svg';
import './search.scss';

interface CharacterSearchProps {
  onChangeValue: (string: string) => void;
}

export const CharacterSearch: FC<CharacterSearchProps> = ({onChangeValue}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    if (!inputRef.current) return;
    inputRef.current.value = '';
    onChangeValue('');
  }
  return (
    <div className='search'>
      <div className='search__container'>
        <input ref={inputRef} type='text' onChange={(e) => onChangeValue(e.target.value)} className='search__input' placeholder='Search Characters...' />
        <SearchIcon className='search-icon' />
        {inputRef.current?.value && <CrossIcon className='cross-icon' onClick={handleClear} />}
      </div>
    </div>
  );
}