import './app.scss'
import jsonData from './data/characters.json'
import type { Character } from './types'
import mainLogo from'./img/Mortal-Kombat-Logo.png';
import { CharacterTable } from './components/table/table';
import { useState } from 'react';
import ReactPaginate from 'react-paginate';

const data: Character[] = jsonData as Character[];

const CHARACTERS_PER_PAGE = 20;

function App() {
  const tableData = data.map(d => {
    return {
      character: {
        id: d.id,
        name: d.name,
        thumbnail: d.thumbnail
      },
      name: d.name,
      img: d.thumbnail,
      tags: d.tags,
      mobility: d.abilities.find(a => a.abilityName === 'Mobility')?.abilityScore || '-',
      technique: d.abilities.find(a => a.abilityName === 'Technique')?.abilityScore || '-',
      survivability: d.abilities.find(a => a.abilityName === 'Survivability')?.abilityScore || '-',
      power: d.abilities.find(a => a.abilityName === 'Power')?.abilityScore || '-',
      energy: d.abilities.find(a => a.abilityName === 'Energy')?.abilityScore || '-',
    }
  });

  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + CHARACTERS_PER_PAGE;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = tableData.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(tableData.length / CHARACTERS_PER_PAGE);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * CHARACTERS_PER_PAGE) % tableData.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <div className="app">
      <header className="header">
        <img className="header__logo" src={mainLogo} alt='Mortal Kombat Logo' />
      </header>
      <main>
        <section>
          <CharacterTable data={currentItems} />
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            containerClassName='pagination__container'
            pageClassName='pagination__button pagination__button--number'
            previousClassName='pagination__button pagination__button--previous'
            nextClassName='pagination__button pagination__button--next'
          />
        </section>
      </main>
    </div>
  )
}

export default App
