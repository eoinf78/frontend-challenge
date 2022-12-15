import { ChangeEvent, FC } from "react";
import { capitalizeFirstLetter } from "../../utils";
import { ReactComponent as CheckIcon } from '../../img/icon-check.svg';
import './tag.scss';

interface TagProps {
  label: string;
  isSelectable?: boolean;
  onSelectTag?: (ev: ChangeEvent<HTMLInputElement>) => void;
}

export const Tag: FC<TagProps> = ({label, isSelectable = false, onSelectTag}) => {
  return (
    <>
      {isSelectable && onSelectTag ? 
        (
          <>
            <input type='checkbox' className='tag__checkbox' id={`tag-${label}`} value={label} onChange={onSelectTag} />
            <label className='tag tag--label' htmlFor={`tag-${label}`}><CheckIcon/>{capitalizeFirstLetter(label)}</label>
          </>
        )    
       : 
        (<span className='tag'>{capitalizeFirstLetter(label)}</span>)
      }
    </>
  )
}