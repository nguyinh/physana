import React, { useState } from 'react';
import Table from './Table';
import './App.css';
import CSVReader from 'react-csv-reader';

const App = () => {
  const [ headers, setHeaders ] = useState([]);
  const [ data, setData ] = useState([]);

  const formatCSVData = data => {
    const headers = data.splice(0, 1)[0].filter(header => header !== '');
    setHeaders(headers);
    const headerLength = headers.length;
    // console.log(headers);
    // console.log(headerLength);
    const formatted = data.map(row => row.splice(0, headerLength));
    setData(formatted);
    // console.log(formatted);
  };

  return (
    <div className="App">
      <CSVReader
        onFileLoaded={data => formatCSVData(data)}
        parserOptions={{skipEmptyLines: true}}/>
        <div style={{height: '1000px'}}>
          <Table
            headers={headers}
            data={data}
          />
        </div>
    </div>
  );
}

export default App;
