import React, { useState, useEffect } from "react";
import "./App.css";
import TableView from './TableView/TableView.jsx';
import { TableProvider } from './TableView/TableContext';

const App = () => {

  return (
    <div className="App">
      <TableProvider>
        <TableView/>
      </TableProvider>
    </div>
  );
};

export default App;
