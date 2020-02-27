import React, { useState, useContext } from "react";
import { OPERATORS } from "../res/constants";
import { FilterContext } from "./FilterContext";
import { Dropdown, Button, Input, Icon, Label } from "semantic-ui-react";

const FilterTag = ({
  filter: { header, isExcluded, operator, value },
  filterIndex
}) => {
  const { dispatch } = useContext(FilterContext);

  return (
    <Label as="a" color={isExcluded ? "red" : "blue"} image className='filter-tag'>
      <Icon name={isExcluded ? "minus" : "plus"} />
      <span className="filter-tag__excluding-condition">{`${
        isExcluded ? "Exclude" : "Include"
      } `}</span>
      <span>{`${isExcluded ? "all" : "only"} `}</span>
      <span className="filter-tag__header">{`${header} `}</span>
      <span>which are </span>
      <span className="filter-tag__operator">{`${operator.label} `}</span>
      <span className="filter-tag__value">{`${
        value === "" ? "nothing" : value
      } `}</span>
      <Label.Detail
        onClick={() =>
          dispatch({ type: "REMOVE_FILTER", filterIndex })
        }
      >
        <Icon name="trash alternate outline" />
      </Label.Detail>
    </Label>
  );
};

const FilterInput = ({ headers, addFilter }) => {
  const [header, setHeader] = useState(headers[1]);
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
    <div className="filter-tag-creation">
      <Dropdown
        className="filter-tag-creation__part"
        placeholder="Category"
        search
        selection
        defaultValue={header}
        onChange={(e, d) => setHeader(d.value)}
        options={headers.map(h => ({ text: h, value: h }))}
      />

      <Button.Group className="filter-tag-creation__part">
        <Button
          onClick={() => setIsExcluded(false)}
          active={!isExcluded}
          color={!isExcluded && "blue"}
        >
          Include
        </Button>
        <Button.Or />
        <Button
          onClick={() => setIsExcluded(true)}
          active={isExcluded}
          color={isExcluded && "red"}
        >
          Exclude
        </Button>
      </Button.Group>

      <Dropdown
        className="filter-tag-creation__part"
        placeholder="Operator"
        search
        selection
        compact
        onChange={(e, d) => setOperator(d.value)}
        options={OPERATORS.map(o => ({ text: o.sign, value: o }))}
      />

      <Input
        className="filter-tag-creation__part"
        placeholder="Value to compare"
        onChange={(e, d) => setValue(d.value)}
      />

      <Button
        className="filter-tag-creation__button"
        circular
        icon="check"
        color="green"
        onClick={handleAddFilter}
      />
    </div>
  );
};

const Filters = ({ headers }) => {
  const [isCreatingFilter, setIsCreatingFilter] = useState(false);

  const {
    state: { filters },
    dispatch
  } = useContext(FilterContext);

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
        {!isCreatingFilter && (
          <Button
            icon
            color="green"
            labelPosition="right"
            ghost
            size="mini"
            onClick={createFilter}
          >
            Create filter
            <Icon name="plus" />
          </Button>
        )}
      </div>

      {headers.length > 0 &&
        isCreatingFilter && (
          <FilterInput
            headers={headers}
            addFilter={f => {
              setIsCreatingFilter(false);
              dispatch({ type: "ADD_FILTER", filter: f });
            }}
          />
        )}
    </div>
  );
};

export default Filters;
