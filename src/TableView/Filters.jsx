import React, { useState, useContext } from "react";
import { OPERATORS } from "../res/constants";
import { TableContext } from "./TableContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const FilterTag = ({filter: {header, isExcluded, operator, value}, filterIndex}) => {
  const { dispatch } = useContext(TableContext);

  return (
    <span className={`filter-tag ${isExcluded ? "exclude" : "include"}`}>
      <span className='filter-tag__excluding-condition'>{`${isExcluded ? "Exclude" : "Include"} `}</span>
      <span>all </span>
      <span className='filter-tag__header'>{`${header} `}</span>
      <span>which are </span>
      <span className='filter-tag__operator'>{`${operator.label} `}</span>
      <span className='filter-tag__value'>{`${value} `}</span>
      <FontAwesomeIcon
        className='filter-tag__close-icon'
        icon={faTimes}
        onClick={() => dispatch({ type: "REMOVE_FILTER", payload: filterIndex })}
      />
    </span>
  );
};

const FilterInput = ({ headers, addFilter }) => {
  const [header, setHeader] = useState(headers[0]);
  const [isExcluded, setIsExcluded] = useState(false);
  const [operator, setOperator] = useState(OPERATORS[0]);
  const [value, setValue] = useState("");

  const handleAddFilter = () => {
    // TODO: Check for missing fields

    addFilter({
      header,
      isExcluded,
      operator,
      value
    });
  };

  return (
    <div>
      <select id="headers" onChange={e => setHeader(e.target.value)}>
        {headers.map((h, i) => (
          <option value={h} key={i}>
            {h}
          </option>
        ))}
      </select>

      <input
        type="radio"
        id="include"
        name="condition"
        value="include"
        defaultChecked
        onChange={() => setIsExcluded(false)}
      />
      <label for="include">Include</label>

      <input
        type="radio"
        id="exclude"
        name="condition"
        value="exclude"
        onChange={() => setIsExcluded(true)}
      />
      <label for="exclude">Exclude</label>

      <select
        id="operator"
        onChange={e => setOperator(OPERATORS[e.target.value])}
      >
        {OPERATORS.map((o, i) => (
          <option value={i} key={o.code}>
            {o.sign}
          </option>
        ))}
      </select>

      <input
        type="text"
        id="value"
        name="value"
        onChange={e => setValue(e.target.value)}
      />

      <button onClick={handleAddFilter}>Add filter</button>
    </div>
  );
};

const Filters = ({ headers }) => {
  const [isCreatingFilter, setIsCreatingFilter] = useState(false);

  const {
    state: { filters },
    dispatch
  } = useContext(TableContext);
  console.log(filters);
  const createFilter = () => {
    setIsCreatingFilter(true);

    // TODO: check for inputs
  };

  return (
    <div>
      {headers.length > 0 &&
        (isCreatingFilter ? (
          <FilterInput
            headers={headers}
            addFilter={f => {
              setIsCreatingFilter(false);
              dispatch({ type: "ADD_FILTER", payload: f })
            }}
          />
        ) : (
          <button className='create-filter-button' onClick={createFilter}>+ Create filter</button>
        ))}
        <div className='filter-tag-container'>
          {filters.map((f, i) => (
            <FilterTag
              key={`filter-${f.header}-${f.value}`}
              filter={f}
              filterIndex={i}/>
          ))}
        </div>
    </div>
  );
};

export default Filters;
