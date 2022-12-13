import logo from './logo.svg'
import './app.scss'
import jsonData from './data/characters.json'
import type { Character } from './types'
import mainLogo from'./img/Mortal-Kombat-Logo.png';
import { CharacterTable } from './components/table/table';

const data: Character[] = jsonData as Character[];

function App() {
  const tableData = data.map(d => {
    return {
      name: d.name,
      img: d.thumbnail,
      tags: d.tags,
      universe: d.universe,
      mobility: d.abilities.find(a => a.abilityName === 'Mobility')?.abilityScore || '-',
      technique: d.abilities.find(a => a.abilityName === 'Technique')?.abilityScore || '-',
      survivability: d.abilities.find(a => a.abilityName === 'Survivability')?.abilityScore || '-',
      power: d.abilities.find(a => a.abilityName === 'Power')?.abilityScore || '-',
      energy: d.abilities.find(a => a.abilityName === 'Energy')?.abilityScore || '-',
    }
  })

  return (
    <div className="app">
      <header className="header">
        <img className="header__logo" src={mainLogo} alt='Mortal Kombat Logo' />
      </header>
      <main>
        <section>
          <CharacterTable data={tableData} />
        </section>
      </main>
    </div>
  )
}

export default App
