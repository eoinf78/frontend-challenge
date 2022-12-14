import { FC } from "react";
import { capitalizeFirstLetter } from "../../utils";
import './tag.scss';

interface TagProps {
  label: string;
}

export const Tag: FC<TagProps> = ({label}) => {
  return (
    <span className='tag'>{capitalizeFirstLetter(label)}</span>
  )
}