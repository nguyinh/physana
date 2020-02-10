import React, { useState } from 'react';
import { Grid, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import styles from './Table.module.css';

const EditableCell = ({ children, style }) => {
  const [ isEditable, setIsEditable ] = useState(false);

  // console.log(style);
  return <div
    style={style}
    className={styles.cell}
    onClick={() => setIsEditable(true)}>
    {isEditable
      ? <input
          style={{height: style.height, width: style.width, background: style.background }}
          // className='cell-input'
          autoFocus
          onBlur={() => false && setIsEditable(false)}/>
      : children
      }
  </div>
};

const cache = new CellMeasurerCache({
  defaultWidth: 100,
  minWidth: 75,
  fixedHeight: true
});

const Table = ({ headers, data }) => {
  const gridData = [ headers, ...data ];
  console.log(gridData);
  
  const cellRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
    const cellStyle = {
      ...style,
      backgroundColor: rowIndex % 2 && '#efefef',
      textAlign: rowIndex === 0 && 'center'
    };

    const headerStyle = {
      ...style,
      textAlign: rowIndex === 0 && 'center',
      fontWeight: 'bold',
      backgroundColor: '#dcdcdc'
    }

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <EditableCell key={key} style={rowIndex === 0 ? headerStyle : cellStyle}>
          {gridData[rowIndex][columnIndex]}
        </EditableCell>
      </CellMeasurer>
    );
  }

  return <AutoSizer>
    {({height, width}) => 
      gridData.length !== 1 && <Grid
        cellRenderer={cellRenderer}
        columnCount={gridData[0].length}
        columnWidth={cache.columnWidth}
        deferredMeasurementCache={cache}
        height={height}
        rowCount={gridData.length}
        rowHeight={30}
        width={width}
      />
    }
  </AutoSizer>;
};

export default Table;