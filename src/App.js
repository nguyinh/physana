import React, { useContext } from "react";
import "./App.css";
import TableView from "./TableView/TableView.jsx";
import ImportingView from "./ImportingView/ImportingView.jsx";
import { FilterProvider } from "./TableView/FilterContext";
import { DataProvider } from "./TableView/DataContext";
import { DataContext } from "./TableView/DataContext";

const MainView = () => {
  const {
    state: { data }
  } = useContext(DataContext);

  return (
    <>
      {!data.length ? (
        <ImportingView />
      ) : (
        <FilterProvider>
          <TableView />
        </FilterProvider>
      )}
    </>
  );
};

const App = () => {
  return (
    <div className="App">
      <DataProvider>
        <MainView />
      </DataProvider>
    </div>
  );
};

export default App;
