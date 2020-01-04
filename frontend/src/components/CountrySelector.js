import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { getCountryName } from "../util/countryName";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 165
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const CountrySelector = props => {
  const classes = useStyles();
  const [code, setCode] = React.useState("");
  const [small, setSmall] = React.useState(false);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const handleChange = event => {
    setCode(event.target.value);
    props.onSelect(event.target.value);
  };

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel ref={inputLabel} id="select-outlined-label">
          Select a country
        </InputLabel>
        <Select
          onOpen={() => setSmall(false)}
          onClose={() => setSmall(true)}
          labelId="select-outlined-label"
          id="select-outlined"
          value={code}
          onChange={handleChange}
          labelWidth={labelWidth}
        >
          {props.countries &&
            props.countries.map(code => {
              return (
                code != props.from && (
                  <MenuItem key={code} value={code}>
                    <span
                      style={{ marginRight: 15 }}
                      className={`flag-icon flag-icon-${code.toLowerCase()}`}
                    ></span>{" "}
                    {small ? code : getCountryName(code)}
                  </MenuItem>
                )
              );
            })}
        </Select>
      </FormControl>
    </div>
  );
};

export default CountrySelector;
