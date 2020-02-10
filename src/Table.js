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
      onBlur={() => setIsEditable(false)}>

      </input>
    : <div style={style} onClick={() => setIsEditable(true)}>
        {children}
      </div>
};



const Table = ({ headers, data }) => {

  console.log(headers);

  const gridData = [ headers, ...data ];
  console.log(gridData);
  
  const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    // console.log(style);
    return gridData.length !== 1 && (
      <DynamicCell key={key} style={style}>
        {gridData[rowIndex][columnIndex]}
      </DynamicCell>
    );
  }

  return <Grid
    cellRenderer={cellRenderer}
    columnCount={gridData[0].length}
    columnWidth={100}
    height={300}
    rowCount={gridData.length}
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