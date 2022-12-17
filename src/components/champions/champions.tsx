import { FC, useEffect, useState } from 'react';
import { CharacterTableData } from '../../types';
import { getAverage } from '../../utils';
import { Avatar } from '../avatar/avatar';
import './champions.scss';

interface ChampionsProps {
  champions: CharacterTableData[];
  onRemove: (championId: number) => void; 
}

export const Champions: FC<ChampionsProps> = ({champions, onRemove}) => { 
  const [powerAvg, setPowerAvg] = useState<string>('-');
  const [mobilityAvg, setMobilityAvg] = useState<string>('-');
  const [techniqueAvg, setTechniqueAvg] = useState<string>('-');
  const [survivabilityAvg, setSurvivabilityAvg] = useState<string>('-');
  const [energyAvg, setEnergyAvg] = useState<string>('-');
  
  useEffect(() => {
    // Calculating ths average abilitys scores across all the champions selected
    if (!champions.length) {
      setPowerAvg('-');
      setMobilityAvg('-');
      setEnergyAvg('-');
      setTechniqueAvg('-');
      setSurvivabilityAvg('-');
      return;
    }

    let totalPower = 0;
    let totalMobility = 0;
    let totalTechnique = 0;
    let totalSurvivability = 0;
    let totalEnergy = 0;

    champions.forEach((champion) => {
      totalPower += Number(champion.power || 0);
      totalMobility += Number(champion.mobility || 0);
      totalEnergy += Number(champion.energy || 0);
      totalTechnique += Number(champion.technique || 0);
      totalSurvivability += Number(champion.survivability || 0);
    });

    const len = champions.length;
    setPowerAvg(getAverage(totalPower, len));
    setMobilityAvg(getAverage(totalMobility, len));
    setEnergyAvg(getAverage(totalEnergy, len));
    setTechniqueAvg(getAverage(totalTechnique, len));
    setSurvivabilityAvg(getAverage(totalSurvivability, len));
  }, [champions]);

  return (
    <div className='champions'>
      <h1>Your champions!</h1>
      <div className='champions__list'>
        {champions.map((c: CharacterTableData) => (
          <button className='champions__button' onClick={() => onRemove(c.character.id)} key={c.character.id}>
            <Avatar url={c.character.image} size='large'/>
          </button>
        ))}
        {!!!champions.length && <h4>START SELECTING YOUR CHAMPIONS!</h4>}
      </div>
      <div className='champions__averages'>
        <div className='champions__ability power'>
          <label>Power</label>
          <span>{powerAvg}</span>
        </div>
        <div className='champions__ability mobility'>
          <label>Mobility</label>
          <span>{mobilityAvg}</span>
        </div>
        <div className='champions__ability technique'>
          <label>Technique</label>
          <span>{techniqueAvg}</span>
        </div>
        <div className='champions__ability survivability'>
          <label>Survivability</label>
          <span>{survivabilityAvg}</span>
        </div>
        <div className='champions__ability energy'>
          <label>Energy</label>
          <span>{energyAvg}</span>
        </div>
      </div>
    </div>
  ) 
}