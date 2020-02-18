import React, { useReducer } from "react";
import { SORT_DIRECTION } from "../res/constants";
import { formatAsInt } from "../res/utils";

let reducer = (state, action) => {
  const { filters, data, filteredData } = state;

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
    case "SORT_BY_COLUMN":
      return sortData(state, action.payload);
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

const sortData = (state, columnIndex) => {
  const { data, sortHeader, sortDirection } = state;
  let [headers] = data;
  const headerLabel = headers[columnIndex];
  if (sortHeader === headerLabel) {
    return {
      ...state,
      sortDirection:
        sortDirection === SORT_DIRECTION.asc
          ? SORT_DIRECTION.desc
          : SORT_DIRECTION.asc
    };
  } else {
    return {
      ...state,
      sortHeader: headerLabel,
      sortDirection: SORT_DIRECTION.asc
    };
  }
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
