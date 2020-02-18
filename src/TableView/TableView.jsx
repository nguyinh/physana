import React, { useState, useEffect } from "react";
import Table from "./Table";
import Filters from "./Filters";
import CSVReader from "react-csv-reader";
import { formatAsInt, mockData } from "../res/utils";
import { SORT_DIRECTION } from "../res/constants";

const TableView = () => {
  const [initialData, setInitialData] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState([]);
  const [sortHeader, setSortHeader] = useState(null);
  const [sortDirection, setSortDirection] = useState(SORT_DIRECTION.none);

  const formatCSVData = data => {
    let [headers, ...rest] = data;
    headers = ['id', ...headers.filter(header => header !== "")];
    rest = rest.map((row, index) =>
      [index, ...row.splice(0, headers.length)].map(cell => formatAsInt(cell))
    );
    // console.log(formatted);
    setInitialData([headers, ...rest]);
    setData([headers, ...rest]);
    setFilteredData([headers, ...rest]);
  };

  const updateCellData = (newValue, rowId, columnIndex) => {
    console.log(newValue, rowId, columnIndex);
    setData(d =>
      d.map(row =>
        row[0] !== rowId
          ? row
          : row.map((col, c) => (c !== columnIndex ? col : newValue))
      )
    );
  };

  const sortData = columnIndex => {
    let [headers] = data;
    const headerLabel = headers[columnIndex];
    if (sortHeader === headerLabel) {
      setSortDirection(
        sortDirection === SORT_DIRECTION.asc
          ? SORT_DIRECTION.desc
          : SORT_DIRECTION.asc
      );
    } else {
      setSortHeader(headerLabel);
      setSortDirection(SORT_DIRECTION.asc);
    }
  };

  const addFilter = newFilter => {
    setFilters([...filters, newFilter]);
  };

  const removeFilter = filterIndex => {
    setFilters(filters.filter((_, i) => i !== filterIndex));
  };

  useEffect(() => {
    if (!data.length) return;

    let [headers, ...content] = data;

    const newContent = content.filter(row => {
      return !filters.some(({ header, operator, value, isExcluded }) => {
        const columnIndex = headers.findIndex(h => h === header);
        const filterValue = formatAsInt(value);
        let cond = false;
        switch (operator.code) {
          case "GREATER_THAN":
            cond = row[columnIndex] >= filterValue;
            break;
          case "LOWER_THAN":
            cond = row[columnIndex] <= filterValue;
            break;
          case "EQUAL_TO":
            cond = row[columnIndex] == filterValue;
            break;
          case "NOT_EQUAL_TO":
            cond = row[columnIndex] != filterValue;
            break;
          default:
            break;
        }
        return isExcluded ? cond : !cond;
      });
    });

    setFilteredData([headers, ...newContent]);
  }, [filters, data]);

  useEffect(() => {
    if (filteredData.length <= 1) return;

    const [headers, ...content] = filteredData;
    const headerIndex = headers.findIndex(h => h === sortHeader);
    const sortedContent = content.sort((a, b) =>
      a[headerIndex] < b[headerIndex]
        ? sortDirection === SORT_DIRECTION.asc
          ? 1
          : -1
        : a[headerIndex] > b[headerIndex]
        ? sortDirection === SORT_DIRECTION.asc
          ? -1
          : 1
        : 0
    );

    setFilteredData([headers, ...sortedContent]);
  }, [sortDirection, sortHeader]);

  console.log(data);
  return (
    <div className="App">
      <div className="tables-header">
        <div className="tables-header-content">
          <CSVReader
            onFileLoaded={data => formatCSVData(data)}
            parserOptions={{ skipEmptyLines: true }}
          />

          {data.length > 0 && (
            <Filters
              headers={data[0]}
              filters={filters}
              addFilter={addFilter}
              removeFilter={removeFilter}
            />
          )}
        </div>
      </div>

      <div className="tables-content">
        <Table
          data={filteredData.length ? filteredData : mockData}
          updateData={updateCellData}
          sortData={sortData}
        />
      </div>
    </div>
  );
};

export default TableView;
