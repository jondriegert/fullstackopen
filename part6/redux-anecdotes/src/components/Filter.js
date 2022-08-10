import { useState } from "react";
import { connect } from "react-redux";

import { setFilter } from "../reducers/filterReducer";

const Filter = (props) => {
  const [filter, _setFilter] = useState("");

  const handleChange = (event) => {
    _setFilter(event.target.value);

    props.setFilter(event.target.value);
  };
  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input type="text" value={filter} onChange={handleChange} />
    </div>
  );
};

const mapDispatchToProps = {
  setFilter,
};

export default connect(null, mapDispatchToProps)(Filter);
