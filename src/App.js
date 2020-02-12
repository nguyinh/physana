import React, { useState, useEffect } from "react";
import Table from "./Table";
import Filters from "./Filters";
import "./App.css";
import CSVReader from "react-csv-reader";
import { formatAsInt, mockData } from "./utils";
import { OPERATORS } from "./constants";

const App = () => {
  const [initialData, setInitialData] = useState([]);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([]);

  const formatCSVData = data => {
    data[0] = data[0].filter(header => header !== "");
    const headerLength = data[0].length;
    let formatted = data.map(row => row.splice(0, headerLength));
    formatted = formatted.map(row => row.map(cell => formatAsInt(cell)));
    // console.log(formatted);
    setInitialData(formatted);
    setData(formatted);
  };

  const updateCellData = (newValue, rowIndex, columnIndex) => {
    // console.log(newValue, rowIndex, columnIndex);
    setData(d =>
      d.map((row, r) =>
        r !== rowIndex
          ? row
          : row.map((col, c) => (c !== columnIndex ? col : newValue))
      )
    );
  };

  const sortData = (i, dir) => {
    // console.log('sort', i);
    const sorted = [...data.splice(1)].sort((a, b) =>
      a[i] < b[i]
        ? dir === "ASC"
          ? 1
          : -1
        : a[i] > b[i]
        ? dir === "ASC"
          ? -1
          : 1
        : 0
    );
    // console.log(sorted);
    setData([data[0], ...sorted]);
  };

  const addFilter = newFilter => {
    setFilters(f => [...f, newFilter]);
  };

  const removeFilter = filterIndex => {
    setFilters(filters => filters.filter((_, i) => i !== filterIndex));
  };

  useEffect(() => {
    let [headers, ...content] = initialData;

    filters.forEach(f => {
      content = content.filter(row => {
        const columnIndex = headers.findIndex(h => h === f.header);
        let cond = true;
        const filterValue = formatAsInt(f.value);

        switch (f.operator.code) {
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
        return f.isExcluded ? !cond : cond;
      });

      setData([headers, ...content]);
    });
  }, [filters]);

  return (
    <div className="App">
      <div className="tables-header">
        <div className="tables-header-content">
          <CSVReader
            onFileLoaded={data => formatCSVData(data)}
            parserOptions={{ skipEmptyLines: true }}
          />

          {data.length && (
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
          data={data.length ? data : mockData}
          updateData={updateCellData}
          sortData={sortData}
        />
      </div>
    </div>
  );
};

export default App;
