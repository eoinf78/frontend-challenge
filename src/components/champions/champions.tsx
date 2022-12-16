import { FC } from 'react';
import { CharacterTableData } from '../../types';
import { Avatar } from '../avatar/avatar';
import './champions.scss';

interface ChampionsProps {
  champions: CharacterTableData[];
  onRemove: (champion: CharacterTableData) => void; 
}

export const Champions: FC<ChampionsProps> = ({champions, onRemove}) => { 
  return (
    <div className='champions'>
      <h1>Your champions!</h1>
      <div className='champions__list'>
        {champions.map((c: CharacterTableData) => (
          <Avatar url={c.character.image} size='large' key={c.character.id}/>
        ))}
        {!!!champions.length && <h4>START SELECTING YOUR CHAMPIONS!</h4>}
      </div>
    </div>
  ) 
}