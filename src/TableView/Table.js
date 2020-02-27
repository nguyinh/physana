import React, { useState, useContext } from "react";
import {
  Grid,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  ScrollSync
} from "react-virtualized";
import { formatAsInt } from "../res/utils";

import { DataContext } from "./DataContext";

import { FilterContext } from './FilterContext';

const cache = new CellMeasurerCache({
  defaultWidth: 150,
  minWidth: 150,
  fixedHeight: true
});

const InputCell = ({ initialValue, style, updateData }) => {
  const [value, setValue] = useState(initialValue);

  return (
    <input
      value={value}
      className="cell-input"
      autoFocus
      onBlur={() => updateData(formatAsInt(value))}
      onChange={e => setValue(e.target.value)}
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

  const handleDataUpdated = newCellValue => {
    setIsEditable(false);
    setTimeout(() => setIsEditing(false), 150);
    updateData(newCellValue);
  };

  const animateBackground = !isEditing ? 'editable-cell' : '';

  return (
    <div style={style} className={`cell-container ${animateBackground}`} onClick={handleCellClick}>
      {isEditable ? (
        <InputCell
          style={style}
          updateData={handleDataUpdated}
          initialValue={value}
        />
      ) : (
        <span className="cell-value">{value}</span>
      )}
    </div>
  );
};

const ConstantCell = ({ children: value, style }) => {
  const handleCellClick = () => {
    console.log("Constant cell clicked");
  };

  return (
    <div style={style} className="cell-container" onClick={handleCellClick}>
      <span className="cell-value">{value}</span>
    </div>
  );
};

const HeaderCell = ({ children: value, style, columnIndex }) => {
  const { dispatch } = useContext(FilterContext);
  const { state: { data:[headers] } } = useContext(DataContext);

  return (
    <div
      style={style}
      className="cell-container"
      onClick={() => dispatch({ type: "SORT_BY_COLUMN", columnIndex, headers })}
    >
      <span className="cell-value">{value}</span>
    </div>
  );
};

const Table = ({ data }) => {
  const { state, dispatch } = useContext(DataContext);

  const [headers, ...content] = data; // Replace by filteredData ?
  const [isEditing, setIsEditing] = useState(false);

  const renderHeaderCell = ({ columnIndex, key, parent, rowIndex, style }) => {
    const headerStyle = {
      ...style,
      textAlign: "center",
      fontWeight: "bold",
      backgroundColor: "#cbd2ff"
      // color: '#000000b5'
    };

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
      >
        <HeaderCell style={headerStyle} columnIndex={columnIndex}>
          {headers[columnIndex]}
        </HeaderCell>
      </CellMeasurer>
    );
  };

  const renderContentCell = ({ columnIndex, key, parent, rowIndex, style }) => {
    const cellStyle = {
      ...style,
      backgroundColor: columnIndex === 0
        ? rowIndex % 2 ? "#eae8e8" : "#f2f2f2"
        : rowIndex % 2 ? "#fafafc" : "#fff",
      color: "#404040",
      fontWeight: columnIndex === 0 && '600'
      // textAlign: rowIndex === 0 && "center"
    };
    const rowId = content[rowIndex][0];

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        {columnIndex === 0 ? (
          <ConstantCell key={key} style={cellStyle}>
            {content[rowIndex][columnIndex]}
          </ConstantCell>
        ) : (
          <EditableCell
            key={key}
            style={cellStyle}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            updateData={value =>
              dispatch({
                type: "SET_DATA",
                data: state.data.map(row =>
                  row[0] !== rowId
                    ? row
                    : row.map((col, c) => (c !== columnIndex ? col : value))
                )
              })
            }
          >
            {content[rowIndex][columnIndex]}
          </EditableCell>
        )}
      </CellMeasurer>
    );
  };

  const isDataEmpty = data.length === 0;
  const isContentEmpty = data.length === 1;

  return (
    <AutoSizer>
      {({ height, width }) =>
        !(isDataEmpty || isContentEmpty) && (
          <ScrollSync>
            {({
              clientHeight,
              clientWidth,
              onScroll,
              scrollHeight,
              scrollLeft,
              scrollTop,
              scrollWidth
            }) => {
              return (
                <div className="table">
                  <div>
                    <Grid
                      className="table-header"
                      columnWidth={cache.columnWidth}
                      deferredMeasurementCache={cache}
                      columnCount={headers.length}
                      height={50}
                      cellRenderer={renderHeaderCell}
                      rowHeight={50}
                      rowCount={1}
                      scrollLeft={scrollLeft}
                      width={width}
                    />
                  </div>

                  <div>
                    <Grid
                      className="table-content"
                      cellRenderer={renderContentCell}
                      columnCount={content[0].length}
                      columnWidth={cache.columnWidth}
                      deferredMeasurementCache={cache}
                      height={height - 50}
                      rowCount={content.length}
                      rowHeight={40}
                      width={width}
                      onScroll={onScroll}
                    />
                  </div>
                </div>
              );
            }}
          </ScrollSync>
        )
      }
    </AutoSizer>
  );
};

export default Table;

/*
Table
  AutoSizer
    ScrollSync
      Grid
        renderHeaderCell
          CellMeasurer
            HeaderCell
      Grid
        cellRenderer
          CellMeasurer
            EditableCell
*/
