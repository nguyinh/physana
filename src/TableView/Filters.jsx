import React, { useState, useContext } from "react";
import { OPERATORS } from "../res/constants";
import { TableContext } from "./TableContext";
import { Dropdown, Button, Input, Icon, Label } from 'semantic-ui-react';

const FilterTag = ({filter: {header, isExcluded, operator, value}, filterIndex}) => {
  const { dispatch } = useContext(TableContext);

  return (
    <Label as="a" color={isExcluded ? "red" : "green"} image>
      <Icon name={isExcluded ? "minus" : "plus"} />
      <span className="filter-tag__excluding-condition">{`${
        isExcluded ? "Exclude" : "Include"
      } `}</span>
      <span>{`${isExcluded ? "all" : "only"} `}</span>
      <span className="filter-tag__header">{`${header} `}</span>
      <span>which are </span>
      <span className="filter-tag__operator">{`${operator.label} `}</span>
      <span className="filter-tag__value">{`${value === "" && "''"} `}</span>
      <Label.Detail
        onClick={() =>
          dispatch({ type: "REMOVE_FILTER", payload: filterIndex })
        }
      >
        <Icon name="trash alternate outline" />
      </Label.Detail>
    </Label>
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
    <div className='filter-tag-creation'>
      <Dropdown
        placeholder="Category"
        search
        selection
        defaultValue={headers[1]}
        onChange={(e, d) => setHeader(d.value)}
        options={headers.map(h => ({ text: h, value: h }))}
      />

      <Button.Group>
        <Button
          onClick={() => setIsExcluded(false)}
          active={!isExcluded}
          color={!isExcluded && "green"}
        >
          <span role="img" aria-label="include-icon">
            ✅
          </span>{" "}
          Include
        </Button>
        <Button.Or />
        <Button
          onClick={() => setIsExcluded(true)}
          active={isExcluded}
          color={isExcluded && "red"}
        >
          <span role="img" aria-label="exclude-icon">
            ❌
          </span>{" "}
          Exclude
        </Button>
      </Button.Group>

      <Dropdown
        placeholder="Operator"
        search
        selection
        compact
        onChange={(e, d) => setOperator(d.value)}
        options={OPERATORS.map(o => ({ text: o.sign, value: o }))}
      />

      <Input placeholder="Value" onChange={(e, d) => setValue(d.value)} />

      <Button circular icon='check' onClick={handleAddFilter}/>
    </div>
  );
};

const Filters = ({ headers }) => {
  const [isCreatingFilter, setIsCreatingFilter] = useState(false);

  const {
    state: { filters },
    dispatch
  } = useContext(TableContext);

  const createFilter = () => {
    setIsCreatingFilter(true);

    // TODO: check for inputs
  };

  return (
    <div>
      <div className="filter-tag-container">
        {filters.map((f, i) => (
          <FilterTag
            key={`filter-${f.header}-${f.value}`}
            filter={f}
            filterIndex={i}
          />
        ))}
      </div>

      {headers.length > 0 &&
        (isCreatingFilter ? (
          <FilterInput
            headers={headers}
            addFilter={f => {
              setIsCreatingFilter(false);
              dispatch({ type: "ADD_FILTER", payload: f });
            }}
          />
        ) : (
          <Button
            icon
            color="green"
            labelPosition="right"
            onClick={createFilter}
          >
            Create filter
            <Icon name="plus" />
          </Button>
        ))}
    </div>
  );
};

export default Filters;
