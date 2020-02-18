import React, { useReducer } from "react";
import { SORT_DIRECTION } from "../res/constants";
import { formatAsInt } from "../res/utils";

let reducer = (state, action) => {
  const { filters, data, filteredData } = state;
  console.log(filters);
  console.log(state);

  switch (action.type) {
    case "ADD_FILTER":
      return {
        ...state,
        filters: [...filters, action.payload]
      };
    case "REMOVE_FILTER":
      return {
        ...state,
        filters: filters.filter((_, i) => i !== action.payload)
      };
    case "FORMAT_CSV":
      return setInitialData(state, action.payload);
    case "SET_FILTERED_DATA":
      return { ...state, filteredData: action.payload };
    default:
      return;
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
  filteredData: [],
  filters: [],
  sortHeader: null,
  sortDirection: SORT_DIRECTION.none
};

const TableContext = React.createContext(initialState);

function TableProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TableContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TableContext.Provider>
  );
}
export { TableContext, TableProvider };
