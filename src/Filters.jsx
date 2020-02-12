import React, { useState } from "react";
import { OPERATORS } from "./constants";

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
            {o.label}
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

const Filters = ({ headers, filters, addFilter, removeFilter }) => {
  const [isCreatingFilter, setIsCreatingFilter] = useState([]);

  const createFilter = () => {
    setIsCreatingFilter(true);

    // TODO
  };

  return (
    <div>
      {headers.length === 0 &&
        (isCreatingFilter ? (
          <FilterInput
            headers={headers}
            addFilter={f => {
              setIsCreatingFilter(false);
              addFilter(f);
            }}
          />
        ) : (
          <button onClick={createFilter}>Create filter</button>
        ))}
      {filters.map((f, i) => (
        <div>
          <span key={f.value}>{f.value}</span>
          <button onClick={() => removeFilter(i)}>Remove filter</button>
        </div>
      ))}
    </div>
  );
};

export default Filters;
