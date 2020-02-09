import React, { useState } from 'react';
import { Grid } from 'react-virtualized';
import 'react-virtualized/styles.css';

const list = [
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
  ['Flo', 'Dup', 26, 'BSG'],
]

const DynamicCell = ({ children, style }) => {
  const [ isEditable, setIsEditable ] = useState(false);

  return isEditable
    ? <input
      style={{ ...style, height: 'unset' }}
      // className='cell-input'
      autoFocus
      onBlur={() => false && setIsEditable(false)}>

      </input>
    : <div style={style} onClick={() => setIsEditable(true)}>
        {children}
      </div>
};

const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
  console.log(style);
  return (
    <DynamicCell key={key} style={style}>
      {list[rowIndex][columnIndex]}
    </DynamicCell>
  );
}

const Table = () => {
  return <Grid
    cellRenderer={cellRenderer}
    columnCount={list[0].length}
    columnWidth={100}
    height={300}
    rowCount={list.length}
    rowHeight={30}
    width={1000}
    style={{
      background: '#68027388',
      // width: '100%'
      borderRight: '1px solid #e0e0e0',
      borderBottom: '1px solid #e0e0e0'
    }}
  />;
};

export default Table;