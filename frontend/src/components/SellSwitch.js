import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const SellSwitch = props => {
  const [state, setState] = React.useState(props.value);

  const handleChange = event => {
    setState(event.target.checked);
    props.onSwitch(event.target.checked);
  };

  return (
    <FormControlLabel
      control={<Switch checked={state} onChange={handleChange} />}
      label="On Sale"
    />
  );
};

export default SellSwitch;
