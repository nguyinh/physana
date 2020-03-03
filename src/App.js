import React from "react";
import "./App.css";
import TableView from './TableView/TableView.jsx';
import ImportingView from './ImportingView/ImportingView.jsx';
import { FilterProvider } from './TableView/FilterContext';
import { DataProvider } from './TableView/DataContext';

const App = () => {

  return (
    <div className="App">
      <DataProvider>
        <ImportingView/>
        
        <FilterProvider>
          <TableView/>
        </FilterProvider>
      </DataProvider>
    </div>
  );
};

export default App;
