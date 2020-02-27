import React, { useReducer } from "react";
import { formatAsInt } from "../res/utils";

let reducer = (state, action) => {
  const { data, filteredData } = state;

  switch (action.type) {
    case "FORMAT_CSV":
      return setInitialData(state, action.data);
    case 'SET_DATA':
      return { ...state, data: action.data };
    case "SET_FILTERED_DATA":
      return { ...state, filteredData: action.data };
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
