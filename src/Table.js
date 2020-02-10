import React, { useState } from "react";
import {
  Grid,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";
import styles from "./Table.module.css";


const cache = new CellMeasurerCache({
  defaultWidth: 150,
  minWidth: 125,
  fixedHeight: true
});


const InputCell = ({ initialValue, style, updateData }) => {
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    updateData(value);
  };

  const onChange = e => {
    setValue(e.target.value);
  };

  return (
    <input
      value={value}
      className='cell-input'
      autoFocus
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};


const EditableCell = ({
  children: value,
  style,
  updateData,
  isEditing,
  setIsEditing
}) => {
  const [isEditable, setIsEditable] = useState(false);

  const handleCellClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      setIsEditable(true);
    }
  };

  const handleDataUpdated = newValue => {
    setIsEditable(false);
    setTimeout(() => setIsEditing(false), 150);
    updateData(newValue);
  };
  // console.log(style);
  return (
    <div
      style={style}
      className='cell-container'
      onClick={handleCellClick}>
      {isEditable ? (
        <InputCell
          style={style}
          updateData={handleDataUpdated}
          initialValue={value}
          onClick={console.log(style)}
        />
      ) : (
        <span className='cell-value'>{value}</span>
      )}
    </div>
  );
};


const Table = ({ data, updateData }) => {
  const gridData = data;
  console.log(gridData);
  const [isEditing, setIsEditing] = useState(false);

  const cellRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
    const cellStyle = {
      ...style,
      backgroundColor: rowIndex % 2 && "#fafafc",
      textAlign: rowIndex === 0 && "center"
    };

    const headerStyle = {
      ...style,
      textAlign: rowIndex === 0 && "center",
      fontWeight: "bold",
      backgroundColor: "#f3f4fb"
    };

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
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          updateData={newValue => updateData(newValue, rowIndex, columnIndex)}
        >
          {gridData[rowIndex][columnIndex]}
        </EditableCell>
      </CellMeasurer>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) =>
        gridData.length !== 0 && (
          <Grid
            cellRenderer={cellRenderer}
            columnCount={gridData[0].length}
            columnWidth={cache.columnWidth}
            deferredMeasurementCache={cache}
            height={height}
            rowCount={gridData.length}
            rowHeight={40}
            width={width}
          />
        )
      }
    </AutoSizer>
  );
};

export default Table;
