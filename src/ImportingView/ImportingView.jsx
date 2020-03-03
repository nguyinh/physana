import React, { useState, useContext } from "react";
import CSVReader from "react-csv-reader";
import { formatAsInt } from "../res/utils";
import { Button, Icon } from "semantic-ui-react";
import { DataContext } from "../TableView/DataContext";

const ImportingView = () => {
  const [selectionHeaders, setSelectionHeaders] = useState([]);
  const [csvContent, setCsvContent] = useState([]);

  const { dispatch: dataDispatch } = useContext(DataContext);

  const handleCSVLoaded = csvData => {
    let [headers, ...rest] = csvData;
    headers = headers.filter(header => header !== "");
    rest = rest.map(row =>
      row.splice(0, headers.length).map(cell => formatAsInt(cell))
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
      return selectionHeaders.map(h => ({
        ...h,
        isSelected: columnIndex === h.columnIndex ? !h.isSelected : h.isSelected
      }));
    });
  };

  const filterColumns = () => {
    const indexesToFilter = selectionHeaders
      .filter(header => !header.isSelected)
      .map(col => col.columnIndex);

    const filteredColumnsData = csvContent.map((row, rowIndex) =>
      row.filter((cell, columnIndex) => !indexesToFilter.includes(columnIndex))
    );

    let [headers, ...rest] = filteredColumnsData;
    headers = ["id", ...headers.filter(header => header !== "")];
    rest = rest.map((row, index) =>
      [index, ...row.splice(0, headers.length - 1)].map(cell =>
        formatAsInt(cell)
      )
    );

    dataDispatch({ type: "SET_DATA", data: [headers, ...rest] });
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
              <div className="selection-headers-container">
                {selectionHeaders.map(header => (
                  <Button
                    key={header.columnIndex}
                    color={header.isSelected ? "blue" : "red"}
                    onClick={() => toggleHeader(header.columnIndex)}
                    icon
                    labelPosition="right"
                    circular
                  >
                    {header.label}
                    {header.isSelected ? (
                      <Icon name="check" />
                    ) : (
                      <Icon name="close" />
                    )}
                  </Button>
                ))}
              </div>

              <Button
                color='green'
                size='big'
                floated='right'
                disabled={selectionHeaders.every(h => !h.isSelected)}
                onClick={filterColumns}
              >
                Confirm columns
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportingView;
