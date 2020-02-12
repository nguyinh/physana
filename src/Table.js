import React, { useState } from "react";
import {
  Grid,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  ScrollSync
} from "react-virtualized";
import styles from "./Table.module.css";
import { formatAsInt } from "./utils";

const cache = new CellMeasurerCache({
  defaultWidth: 150,
  minWidth: 150,
  fixedHeight: true
});

const InputCell = ({ initialValue, style, updateData }) => {
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    updateData(formatAsInt(value));
  };

  const onChange = e => {
    setValue(e.target.value);
  };

  return (
    <input
      value={value}
      className="cell-input"
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
  setIsEditing,
  isHeader,
  sortByColumn
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

  return (
    <div
      style={style}
      className="cell-container"
      onClick={isHeader ? sortByColumn : handleCellClick}
    >
      {!isHeader && isEditable ? (
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

const HeaderCell = ({ children: value, style, sortByColumn, columnIndex }) => {
  const [sortDirection, setSortDirection] = useState(null);

  const handleSort = () => {
    setSortDirection(old => (old === null || old === "DESC" ? "ASC" : "DESC"));
    sortByColumn(columnIndex, sortDirection);
  };

  return (
    <div style={style} className="cell-container" onClick={handleSort}>
      <span className="cell-value">{value}</span>
    </div>
  );
};

const Table = ({ data, updateData, sortData }) => {
  const gridData = data;
  const [headers, ...content] = gridData;
  // console.log(headers);
  // console.log(content);
  const [isEditing, setIsEditing] = useState(false);

  const renderHeaderCell = ({ columnIndex, key, parent, rowIndex, style }) => {
    const headerStyle = {
      ...style,
      textAlign: "center",
      fontWeight: "bold",
      backgroundColor: "#cbd2ff",
      // color: '#000000b5'
    };

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
      >
        <HeaderCell
          style={headerStyle}
          sortByColumn={sortData}
          columnIndex={columnIndex}
        >
          {headers[columnIndex]}
        </HeaderCell>
      </CellMeasurer>
    );
  };

  const cellRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
    const cellStyle = {
      ...style,
      backgroundColor: rowIndex % 2 ? "#fafafc" : "#fff",
      color: '#404040'
      // textAlign: rowIndex === 0 && "center"
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
          style={cellStyle}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          updateData={newValue => updateData(newValue, rowIndex + 1, columnIndex)}
        >
          {content[rowIndex][columnIndex]}
        </EditableCell>
      </CellMeasurer>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) =>
        gridData.length !== 0 && (
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
                      cellRenderer={cellRenderer}
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