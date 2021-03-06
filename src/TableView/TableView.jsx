import React, { useEffect, useContext } from "react";
import Table from "./Table";
import Filters from "./Filters";
import CSVReader from "react-csv-reader";
import { formatAsInt, mockData } from "../res/utils";
import { SORT_DIRECTION } from "../res/constants";
import { Button, Icon } from "semantic-ui-react";
import { FilterContext } from "./FilterContext";
import { DataContext } from "./DataContext";

const TableView = () => {
  const {
    state: { filters, sortHeader, sortDirection }
    // dispatch: filterDispatch
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

    dataDispatch({ type: "FORMAT_CSV", data: [headers, ...rest] });
  };

  useEffect(() => {
    if (!data.length) return;

    let [headers, ...content] = data;

    content = content.filter(row => {
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

    if (filteredData.length > 1) {
      const headerIndex = headers.findIndex(h => h === sortHeader);
      content = content.sort((a, b) =>
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
    }

    dataDispatch({ type: "SET_FILTERED_DATA", data: [headers, ...content] });
  }, [filters, sortDirection, sortHeader, data]);

  return (
    <>
      <div className="tables-header">
        <div className="tables-header-content">
          <div className="tables-header-actions">
            <Button
              icon
              color="teal"
              labelPosition="right"
              onClick={() => dataDispatch({ type: "EXPORT_DATA" })}
            >
              Export data as CSV
              <Icon name="save outline" />
            </Button>
          </div>

          {data.length > 0 && <Filters headers={data[0]} />}
        </div>
      </div>

      <div className="tables-content">
        <Table data={filteredData.length ? filteredData : mockData} />
      </div>
    </>
  );
};

export default TableView;
