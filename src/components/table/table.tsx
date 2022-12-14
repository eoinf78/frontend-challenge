import { FC } from 'react';
import { Character, CharacterTag } from '../../types';
import './table.scss';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Tag } from '../tag/tag';

export interface CharacterTableProps {
  data: any[];
}

const columnHelper = createColumnHelper<any>();

const columns = [
    columnHelper.accessor('character', {
      cell: info => (
        <div className='table__character'>
          <label className='character-select--label' htmlFor={`char__${info.getValue().id}`}></label>
          <input type='checkbox' id={`char__${info.getValue().id}`} />
          <div className='table__thumbnail'>
            <img src={info.getValue().thumbnail} />
          </div>
          <div>{info.getValue().name}</div>
        </div>
      ),
      header: 'Character',
    }),
    columnHelper.accessor('tags', {
      cell: info => {
        return (
          <div className='table__tags'>
            {info.getValue() && info.getValue().map((t: CharacterTag) => (
              <Tag key={`tag__${t.tag_name}`} label={t.tag_name} />
            ))}
          </div>
        )
      },
      header: 'Tags',
    }),
    columnHelper.accessor('mobility', {
      cell: info => (
        <span style={{color: info.getValue() >= 10 ? '#ff0000' : '#003333'}}>{info.getValue()}</span>
      ),
      header: 'Mobility',
    }),
    columnHelper.accessor('technique', {
      cell: info => info.getValue(),
      header: 'Technique',
    }),
    columnHelper.accessor('survivability', {
      cell: info => info.getValue(),
      header: 'Survivability',
    }),
    columnHelper.accessor('power', {
      cell: info => info.getValue(),
      header: 'Power',
    }),
    columnHelper.accessor('energy', {
      cell: info => info.getValue(),
      header: 'Energy',
    })
  ]

export const CharacterTable: FC<CharacterTableProps> = ({data}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <table className='table'>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}