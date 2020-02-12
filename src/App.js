import React, { useState } from "react";
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
    console.log(newFilter);

    const applyFilters = filters => {
      let [headers, ...content] = initialData;
      console.log(filters);
      filters.forEach(f => {
        content = content.filter(row => {
          const columnIndex = headers.findIndex(h => h === f.header);
          // IF INCLUDE
          switch (f.operator.code) {
            case "GREATER_THAN":
              console.log(row[columnIndex], ">", f.value);
              return row[columnIndex] > f.value;
            case "LOWER_THAN":
              console.log(row[columnIndex], "<", f.value);
              return row[columnIndex] < f.value;
            case "EQUAL_TO":
              console.log(row[columnIndex], "=", f.value);
              return row[columnIndex] == f.value;
            case "NOT_EQUAL_TO":
              console.log(row[columnIndex], "!=", f.value);
              return row[columnIndex] != f.value;
            default:
              return true;
          }
          // IF EXCLUDE
        });

        console.log(content);

        setData([headers, ...content]);
      });
    };

    setFilters(f => {
      const filters = [...f, newFilter];
      applyFilters(filters);
      return filters;
    });
  };

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
