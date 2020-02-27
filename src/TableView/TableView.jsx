import React, { useEffect, useContext } from "react";
import Table from "./Table";
import Filters from "./Filters";
import CSVReader from "react-csv-reader";
import { formatAsInt, mockData } from "../res/utils";
import { SORT_DIRECTION } from "../res/constants";

import { FilterContext } from "./FilterContext";
import { DataContext } from "./DataContext";

const TableView = () => {
  const {
    state: { filters, sortHeader, sortDirection },
    dispatch: filterDispatch
  } = useContext(FilterContext);

  const {
    state: { data, filteredData },
    dispatch: dataDispatch
  } = useContext(DataContext);

  const formatCSVData = data => {
    let [headers, ...rest] = data;
    headers = ["id", ...headers.filter(header => header !== "")];
    rest = rest.map((row, index) =>
      [index, ...row.splice(0, headers.length - 1)].map(cell =>
        formatAsInt(cell)
      )
    );

    dataDispatch({ type: "FORMAT_CSV", payload: [headers, ...rest] });
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

    dataDispatch({ type: "SET_FILTERED_DATA", payload: [headers, ...newContent] });
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

    dataDispatch({
      type: "SET_FILTERED_DATA",
      payload: [headers, ...sortedContent]
    });
  }, [sortDirection, sortHeader]);

  return (
    <>
      <div className="tables-header">
        <div className="tables-header-content">
          {!data.length && (
            <CSVReader
              onFileLoaded={data => formatCSVData(data)}
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
          )}

          {data.length > 0 && (
            <Filters
              headers={data[0]}
              filters={filters}
              addFilter={newFilter =>
                filterDispatch({ type: "ADD_FILTER", payload: newFilter })
              }
              removeFilter={filterIndex =>
                filterDispatch({ type: "REMOVE_FILTER", payload: filterIndex })
              }
            />
          )}
        </div>
      </div>

      <div className="tables-content">
        <Table data={filteredData.length ? filteredData : mockData} />
      </div>
    </>
  );
};

export default TableView;
