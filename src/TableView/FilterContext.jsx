import React, { useReducer } from "react";

let reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    case "decrement":
      return { ...state, count: state.count - 1 };
    default:
      return;
  }
};

const initialState = {
  filters: []
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
