import { FC } from "react";
import './avatar.scss';

interface AvatarProps {
  url: string;
  size?: 'small' | 'large';
}

export const Avatar: FC<AvatarProps> = ({
  url, size = 'small'
}) => { 
  return (
    <div className={`avatar avatar--${size}`}>
      <img src={url} />
    </div>
  ) 
}