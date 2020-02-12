import React, { useState } from 'react';
import Table from './Table';
import './App.css';
import CSVReader from 'react-csv-reader';
import { formatAsInt, mockData } from './utils';

const App = () => {
  const [ data, setData ] = useState([]);

  const formatCSVData = data => {
    data[0] = data[0].filter(header => header !== '');
    const headerLength = data[0].length;
    let formatted = data.map(row => row.splice(0, headerLength));
    formatted = formatted.map(row => row.map(cell => formatAsInt(cell)));
    // console.log(formatted);
    setData(formatted);
  };

  const updateData = (newValue, rowIndex, columnIndex) => {
    // console.log(newValue, rowIndex, columnIndex);
    setData(d =>
      d.map((row, r) => (
        r !== rowIndex
          ? row
          : row.map((col, c) => (
            c !== columnIndex
              ? col
              : newValue
      ))))
    );
  };

  const sortData = (i, dir) => {
    // console.log('sort', i);
    const sorted = [...data.splice(1)].sort((a, b) => (
      a[i] < b[i]
        ? dir === 'ASC' ? 1 : -1
        : a[i] > b[i]
          ? dir === 'ASC' ? -1 : 1
          : 0
    ));
    // console.log(sorted);
    setData([ data[0], ...sorted ]);
  };

  return (
    <div className="App">
      <div className='tables-header'>
        <div className='tables-header-content'>
          <CSVReader
            onFileLoaded={data => formatCSVData(data)}
            parserOptions={{skipEmptyLines: true}}/>
        </div>
      </div>

      <div className='tables-content'>
        <Table
          data={data.length ? data : mockData}
          updateData={updateData}
          sortData={sortData}
        />
      </div>
    </div>
  );
}

export default App;
