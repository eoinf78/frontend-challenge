import './app.scss'
import jsonData from './data/characters.json'
import type { Character, CharacterTableData } from './types'
import mainLogo from'./img/Mortal-Kombat-Logo.png';
import { CharacterTable } from './components/table/table';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useSearch } from './hooks/use-search';
import {cloneDeep, filter, uniq} from 'lodash';
import { Tag } from './components/tag/tag';
import { Champions } from './components/champions/champions';
import { CharacterSearch } from './components/search/search';

const data: Character[] = jsonData as Character[];

const CHARACTERS_PER_PAGE = 15;
const CHAMPIONS_LIMIT = 6;

function App() {
  const [filteredList, setFilteredList] = useState<CharacterTableData[]>([]);
  const {value: search, setValue: setSearch} = useSearch();
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [currentItems, setCurrentItems] = useState<CharacterTableData[]>([]);
  const [tagSearch, setTagSearch] = useState<string[]>([]);
  const [myChampions, setMyChampions] = useState<CharacterTableData[]>([]);

  const tableData = data.map((d: Character) => {
    return {
      character: {
        id: d.id,
        name: d.name,
        thumbnail: d.thumbnail,
        image: d.image
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
      if (tagSearch[0] !== 'myteam') {
        clonedData = [...clonedData].filter((c: CharacterTableData) => {
          const tagsMatch = c.tags ? c.tags.filter(element => {
            const idx = tagSearch.indexOf(element.tag_name);
            return idx >= 0;
          }) : [];

          return tagsMatch.length;
        });
      } else {
        // Filtering all the champions
        clonedData = [...clonedData].filter((c: CharacterTableData) => {
          const isChampion = myChampions.find(ch => ch.character.id === c.character.id);
          return isChampion && c;
        });
      }
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
    const clonedList = cloneDeep(filteredList);
    setCurrentItems([...clonedList.slice(itemOffset, endOffset)]);
    setPageCount(Math.ceil(filteredList.length / CHARACTERS_PER_PAGE));
  }, [itemOffset]);

  const handleTagClick = (tagname: string) => {
    const index = tagSearch.indexOf(tagname);

    if (tagname === 'myteam') {
      index < 0 ? setTagSearch(['myteam']) : setTagSearch([]);
    } else if (index >= 0) {
      const tags = [...tagSearch];
      tags.splice(index, 1);
      setTagSearch(tags);
    } else {
      setTagSearch([...tagSearch, tagname]);
    }
  }

  const handleCharacterCheck = (characterId: string | number) => {
    const selectedCharacter = cloneDeep(filteredList).find(c => c.character.id === Number(characterId));
    if (!selectedCharacter) return;

    // Check if already a champion
    const arr = [...myChampions];

    const newChamps = arr.find(champ => champ.character.id === selectedCharacter.character.id) 
      ? arr.filter((el: CharacterTableData) => el.character.id !== selectedCharacter.character.id) 
      : myChampions.length < CHAMPIONS_LIMIT ? [...arr, cloneDeep(selectedCharacter)] : [...arr];
    
    setMyChampions([...newChamps]);
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
          <Champions champions={myChampions} onRemove={handleCharacterCheck} />
          <CharacterSearch onChangeValue={setSearch} />
          <div className='tags'>
            {availableTags.map(tag => (<Tag key={`select-tag__${tag}`} isSelected={tagSearch.includes(tag)} label={tag} isSelectable onSelectTag={(e) => handleTagClick(e.target.value)}/>))}
            {myChampions.length > 0 && <Tag key={`select-tag__myteam`} label={'My Team'} isSelected={tagSearch.includes('myteam')} isSelectable onSelectTag={() => handleTagClick('myteam')}/>}
            {tagSearch.length > 0 && <button className='tag__clearall' onClick={() => setTagSearch([])}>Clear all</button>}
          </div>
          {currentItems.length > 0 ? (
            <CharacterTable data={currentItems} myChamps={myChampions} onSelectCharacter={(id: any) => handleCharacterCheck(id)} />
          ) : (
            <h3>No characters match your search criteria!</h3>
          )}
          {pageCount > 1 &&
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
          }
        </section>
      </main>
    </div>
  )
}

export default App
