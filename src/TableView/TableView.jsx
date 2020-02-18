import React, { useEffect, useContext } from "react";
import Table from "./Table";
import Filters from "./Filters";
import CSVReader from "react-csv-reader";
import { formatAsInt, mockData } from "../res/utils";
import { SORT_DIRECTION } from "../res/constants";

import { TableContext } from "./TableContext";

const TableView = () => {
  const {
    state: { data, filteredData, sortHeader, sortDirection, filters },
    dispatch
  } = useContext(TableContext);

  const formatCSVData = data => {
    let [headers, ...rest] = data;
    headers = ["id", ...headers.filter(header => header !== "")];
    rest = rest.map((row, index) =>
      [index, ...row.splice(0, headers.length)].map(cell => formatAsInt(cell))
    );
    dispatch({ type: "FORMAT_CSV", payload: [headers, ...rest] });
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

    dispatch({ type: "SET_FILTERED_DATA", payload: [headers, ...newContent] });
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

    dispatch({
      type: "SET_FILTERED_DATA",
      payload: [headers, ...sortedContent]
    });
  }, [sortDirection, sortHeader]);

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
        <Table data={filteredData.length ? filteredData : mockData} />
      </div>
    </div>
  );
};

export default TableView;
