import React, { useState } from 'react';
import { Grid, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import styles from './Table.module.css';

const InputCell = ({ initialValue, style, updateData }) => {
  const [ value, setValue ] = useState(initialValue);

  const onBlur = (e) => {
    updateData(value);
  };

  const onChange = (e, f, g) => {
    setValue(e.target.value);
  };

  return <input
    style={{height: style.height, width: style.width, background: style.background }}
    value={value}
    autoFocus
    onBlur={onBlur}
    onChange={onChange}/>
};

const EditableCell = ({ children, style, updateData }) => {
  const [ isEditable, setIsEditable ] = useState(false);

  return <div
    style={style}
    className={styles.cell}
    onClick={() => setIsEditable(true)}>
    {isEditable
      ? <InputCell
          style={{height: style.height, width: style.width, background: style.background }}
          updateData={newValue => {
            setIsEditable(false);
            console.log(newValue)
            updateData(newValue);
          }}
          initialValue={children}/>
      : children
    }
  </div>
};

const cache = new CellMeasurerCache({
  defaultWidth: 100,
  minWidth: 75,
  fixedHeight: true
});

const Table = ({ headers, data, updateData }) => {
  const gridData = data;
  console.log(gridData);
  // const gridData = [ headers, ...data ];
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
        <EditableCell 
          key={key}
          style={rowIndex === 0 ? headerStyle : cellStyle}
          updateData={newValue => updateData(newValue, rowIndex, columnIndex)}
        >
          {gridData[rowIndex][columnIndex]}
        </EditableCell>
      </CellMeasurer>
    );
  }

  return <AutoSizer>
    {({height, width}) => 
      gridData.length !== 0 && <Grid
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