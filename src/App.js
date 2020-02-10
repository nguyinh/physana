import React, { useState, useEffect, useMemo } from 'react';
import Table from './Table';
import './App.css';
import CSVReader from 'react-csv-reader';

const App = () => {
  // const [ headers, setHeaders ] = useState([]);
  const [ data, setData ] = useState([]);

  const formatCSVData = data => {
    // const headers = data.splice(0, 1)[0].filter(header => header !== '');
    // setHeaders(headers);
    // const headerLength = headers.length;
    // const formatted = data.map(row => row.splice(0, headerLength));

    data[0] = data[0].filter(header => header !== '');
    const headerLength = data[0].length;
    const formatted = data.map(row => row.splice(0, headerLength));
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

  return (
    <div className="App">
      <CSVReader
        onFileLoaded={data => formatCSVData(data)}
        parserOptions={{skipEmptyLines: true}}/>
      <div style={{height: '1000px'}}>
        <Table
          data={data}
          updateData={updateData}
        />
      </div>
    </div>
  );
}

export default App;
