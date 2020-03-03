import React, { useReducer } from "react";
import { formatAsInt } from "../res/utils";
const { dialog } = window.require("electron").remote;
const fs = window.require("fs");

let reducer = (state, action) => {
  const { data, filteredData } = state;

  switch (action.type) {
    case "FORMAT_CSV":
      return setInitialData(state, action.data);
    case "SET_DATA":
      return { ...state, data: action.data };
    case "SET_FILTERED_DATA":
      return { ...state, filteredData: action.data };
    case "EXPORT_DATA":
      exportData(state.filteredData);
      return state;
    default:
      return state;
  }
};

const setInitialData = (state, formattedData) => {
  return {
    ...state,
    initialData: formattedData,
    data: formattedData,
    filteredData: formattedData
  };
};

const exportData = async data => {
  let content = "Some text to save into the file";

  content = data.reduce((acc, row) => {
    const csvRow = row.reduce(
      (acc2, cell, cellIndex) =>
        cellIndex ? `${acc2}${!acc2 ? "" : ";"}${cell}` : acc2,
      ''
    );

    return `${acc}${!acc ? "" : "\n"}${csvRow}`;
  }, "");

  const { filePath } = await dialog.showSaveDialog({
    filters: [
      {
        name: "Comma Separated Values",
        extensions: ["csv"]
      }
    ]
  });

  if (!filePath) return;

  fs.writeFile(filePath, content, err => {
    if (err) {
      console.log("An error ocurred creating the file " + err.message);
    }

    console.log("The file has been succesfully saved");
  });
};

const initialState = {
  initialData: [],
  data: [],
  filteredData: []
};

const DataContext = React.createContext(initialState);

function DataProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {props.children}
    </DataContext.Provider>
  );
}
export { DataContext, DataProvider };
