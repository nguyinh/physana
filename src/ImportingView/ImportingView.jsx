import React, { useState, useContext } from "react";
import CSVReader from "react-csv-reader";
import { formatAsInt } from "../res/utils";
import { Button, Icon } from "semantic-ui-react";
import { DataContext } from "../TableView/DataContext";

const ImportingView = () => {
  const [selectionHeaders, setSelectionHeaders] = useState([]);
  const [csvContent, setCsvContent] = useState([]);

  const {
    dispatch: dataDispatch
  } = useContext(DataContext);

  const handleCSVLoaded = csvData => {
    let [headers, ...rest] = csvData;
    headers = headers.filter(header => header !== "");
    rest = rest.map((row) =>
      row.splice(0, headers.length - 1).map(cell =>
        formatAsInt(cell)
      )
    );

    setCsvContent([headers, ...rest]);

    setSelectionHeaders(
      headers.map((headerLabel, i) => ({
        label: headerLabel,
        columnIndex: i,
        isSelected: true
      }))
    );
  };

  const toggleHeader = columnIndex => {
    setSelectionHeaders(selectionHeaders => {
      return selectionHeaders.map((h, i) => ({
        ...h,
        isSelected: columnIndex === i ? !h.isSelected : h.isSelected
      }));
    });
  };

  const filterColumns = () => {
    const filteredColumns = selectionHeaders.filter(header => !header.isSelected);
    console.table(filteredColumns);
    const filteredColumnsIndexes = filteredColumns.map(col => col.columnIndex);

    const filteredColumnsData = csvContent.map((row, rowIndex) => {
      return row.filter((cell, columnIndex) => {
        return !filteredColumnsIndexes.includes(columnIndex);
      });
    });

    let [headers, ...rest] = filteredColumnsData;
    headers = ["id", ...headers.filter(header => header !== "")];
    rest = rest.map((row, index) =>
      [index, ...row.splice(0, headers.length - 1)].map(cell =>
        formatAsInt(cell)
      )
    );

    dataDispatch({type: 'SET_DATA', data: [headers, ...rest]})
  };

  return (
    <div>
      <div className="tables-header">
        <div className="tables-header-content">
          {!selectionHeaders.length ? (
            <CSVReader
              onFileLoaded={data => handleCSVLoaded(data)}
              parserOptions={{ skipEmptyLines: true }}
              label={
                <>
                  <span className="plus-prefix">+</span>{" "}
                  <span className="label-suffix">Insert your CSV file</span>
                </>
              }
              cssClass="csv-reader-input"
              inputId="csv-input"
            />
          ) : (
            <>
              {selectionHeaders.map(header => (
                <Button
                  size="mini"
                  key={header.columnIndex}
                  color={header.isSelected ? "green" : "red"}
                  onClick={() => toggleHeader(header.columnIndex)}
                >
                  {header.label}
                </Button>
              ))}
              <Button
                color={"blue"}
                onClick={filterColumns}>Confirm columns</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportingView;
