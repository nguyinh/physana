import React, { useReducer } from "react";
import { SORT_DIRECTION } from "../res/constants";

let reducer = (state, action) => {
  const { filters } = state;

  switch (action.type) {
    case "ADD_FILTER":
      return {
        ...state,
        filters: [...filters, action.filter]
      };
    case "REMOVE_FILTER":
      return {
        ...state,
        filters: filters.filter((_, i) => i !== action.filterIndex)
      };
    case "SORT_BY_COLUMN":
      return sortData(state, action.columnIndex, action.headers);
    default:
      return state;
  }
};

const sortData = (state, columnIndex, headers) => {
  const { sortHeader, sortDirection } = state;
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
  filters: [],
  sortHeader: null,
  sortDirection: SORT_DIRECTION.none
};

const FilterContext = React.createContext(initialState);

function FilterProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      {props.children}
    </FilterContext.Provider>
  );
}
export { FilterContext, FilterProvider };
