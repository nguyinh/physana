import React, { useState, useEffect, useContext } from "react";
import Table from "./Table";
import Filters from "./Filters";
import CSVReader from "react-csv-reader";
import { formatAsInt, mockData } from "../res/utils";
import { SORT_DIRECTION } from "../res/constants";

import { TableContext } from "./TableContext";

const TableView = () => {
  const { state, dispatch } = useContext(TableContext);

  const [data, setData] = useState([]);

  const formatCSVData = data => {
    let [headers, ...rest] = data;
    headers = ["id", ...headers.filter(header => header !== "")];
    rest = rest.map((row, index) =>
      [index, ...row.splice(0, headers.length)].map(cell => formatAsInt(cell))
    );
    dispatch({ type: "FORMAT_CSV", payload: [headers, ...rest] });
  };

  const updateCellData = (newValue, rowId, columnIndex) => {
    // console.log(newValue, rowId, columnIndex);
    setData(d =>
      d.map(row =>
        row[0] !== rowId
          ? row
          : row.map((col, c) => (c !== columnIndex ? col : newValue))
      )
    );
  };

  useEffect(() => {
    if (!state.data.length) return;

    let [headers, ...content] = state.data;

    const newContent = content.filter(row => {
      return !state.filters.some(({ header, operator, value, isExcluded }) => {
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

    dispatch({ type: "SET_FILTERED_DATA", payload: [headers, ...newContent] });
  }, [state.filters]);

  useEffect(() => {
    if (state.filteredData.length <= 1) return;

    const [headers, ...content] = state.filteredData;
    const headerIndex = headers.findIndex(h => h === state.sortHeader);
    const sortedContent = content.sort((a, b) =>
      a[headerIndex] < b[headerIndex]
        ? state.sortDirection === SORT_DIRECTION.asc
          ? 1
          : -1
        : a[headerIndex] > b[headerIndex]
        ? state.sortDirection === SORT_DIRECTION.asc
          ? -1
          : 1
        : 0
    );

    dispatch({type: 'SET_FILTERED_DATA', payload: [headers, ...sortedContent]})
  }, [state.sortDirection, state.sortHeader]);

  return (
    <div className="App">
      <div className="tables-header">
        <div className="tables-header-content">
          <CSVReader
            onFileLoaded={data => formatCSVData(data)}
            parserOptions={{ skipEmptyLines: true }}
          />

          {state.data.length > 0 && (
            <Filters
              headers={state.data[0]}
              filters={state.filters}
              addFilter={newFilter =>
                dispatch({ type: "ADD_FILTER", payload: newFilter })
              }
              removeFilter={filterIndex =>
                dispatch({ type: "REMOVE_FILTER", payload: filterIndex })
              }
            />
          )}
        </div>
      </div>

      <div className="tables-content">
        <Table
          data={state.filteredData.length ? state.filteredData : mockData}
          updateData={updateCellData}
        />
      </div>
    </div>
  );
};

export default TableView;
