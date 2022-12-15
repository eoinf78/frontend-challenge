import './app.scss'
import jsonData from './data/characters.json'
import type { Character, CharacterTableData, CharacterTag } from './types'
import mainLogo from'./img/Mortal-Kombat-Logo.png';
import { CharacterTable } from './components/table/table';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useSearch } from './hooks/use-search';
import {cloneDeep, uniq} from 'lodash';
import { Tag } from './components/tag/tag';

const data: Character[] = jsonData as Character[];

const CHARACTERS_PER_PAGE = 20;

function App() {
  const [filteredList, setFilteredList] = useState<CharacterTableData[]>([]);
  const {value: search, setValue: setSearch} = useSearch();
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [currentItems, setCurrentItems] = useState<CharacterTableData[]>([]);
  const [tagSearch, setTagSearch] = useState<string[]>([]);

  const tableData = data.map((d: Character) => {
    return {
      character: {
        id: d.id,
        name: d.name,
        thumbnail: d.thumbnail
      },
      tags: d.tags,
      mobility: d.abilities.find(a => a.abilityName === 'Mobility')?.abilityScore || '-',
      technique: d.abilities.find(a => a.abilityName === 'Technique')?.abilityScore || '-',
      survivability: d.abilities.find(a => a.abilityName === 'Survivability')?.abilityScore || '-',
      power: d.abilities.find(a => a.abilityName === 'Power')?.abilityScore || '-',
      energy: d.abilities.find(a => a.abilityName === 'Energy')?.abilityScore || '-',
    }
  }) as CharacterTableData[];

  const allTags: string[] = [];
  
  tableData.forEach((c: CharacterTableData) => {
    c.tags && c.tags.forEach(t => allTags.push(t.tag_name))
  });

  const availableTags = uniq(allTags);

  useEffect(() => {
    let clonedData = cloneDeep(tableData);
    if (search) {
      clonedData = cloneDeep(tableData).filter((c: CharacterTableData) => {
        // compare tag names again search string
        const tagMatch = c.tags ? c.tags.filter(element => {
          return element.tag_name.includes(search.toLowerCase());
        }) : [];
        
        // serach again character name
        const nameMatch = c.character.name.toLowerCase().includes(search.toLowerCase());
        
        // return if name or one tag matches
        return nameMatch || tagMatch.length;
      });
    } 
    
    if (tagSearch.length) {
      clonedData = [...clonedData].filter((c: CharacterTableData) => {
        const tagsMatch = c.tags ? c.tags.filter(element => {
          const idx = tagSearch.indexOf(element.tag_name);
          return idx >= 0;
        }) : [];

        return tagsMatch.length;
      });
    }

    // Re-calculate pagination
    const endOffset = itemOffset + CHARACTERS_PER_PAGE;
    setCurrentItems(clonedData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(clonedData.length / CHARACTERS_PER_PAGE));

    setFilteredList(clonedData);
  }, [search, tagSearch]);

  useEffect(() => {
    // itemOffest updated i.e. user clicked on pagination button
    if (!filteredList.length) return;
    const endOffset = itemOffset + CHARACTERS_PER_PAGE;
    setCurrentItems(filteredList.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredList.length / CHARACTERS_PER_PAGE));
  }, [itemOffset]);

  const handleTagClick = (tagname: string) => {
    const index = tagSearch.indexOf(tagname);
    if (index >= 0) {
      const tags = [...tagSearch];
      tags.splice(index, 1);
      setTagSearch(tags);
    } else {
      setTagSearch([...tagSearch, tagname]);
    }
  }

  // Invoke when user click to request another page.
  const handlePageClick = (event: {selected: number}) => {
    const newOffset = (event.selected * CHARACTERS_PER_PAGE) % filteredList.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="app">
      <header className="header">
        <img className="header__logo" src={mainLogo} alt='Mortal Kombat Logo' />
      </header>
      <main>
        <section>
          <div className='serach'>
            <input type='text' onChange={(e) => setSearch(e.target.value)} className='serach__input' />
          </div>
          <div className='tags'>
            {availableTags.map(tag => (<Tag key={`select-tag__${tag}`} label={tag} isSelectable onSelectTag={(e) => handleTagClick(e.target.value)}/>))}
          </div>
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
