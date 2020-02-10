import React from 'react';
import Table from './Table';
import './App.css';

function App() {
  const handleFile = (e) => {
    // console.log(e);
    // console.log(e.target.files[0]);
    // console.log(e.target.result);
    const reader = new FileReader();
    reader.onloadend = function (e) {
      console.log(reader.result)
      // console.log(e.target.result);
    }
    reader.readAsText(e.target.files[0]);
    // console.log(data);dz
  };

  return (
    <div className="App">
      <input type='file' onChange={handleFile}/>
      <Table/>
    </div>
  );
}

export default App;
