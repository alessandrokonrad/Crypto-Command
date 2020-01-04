import React from "react";
import { useParams } from "react-router-dom";
import { api } from "../config";
import { useHistory } from "react-router-dom";
import { Box, makeStyles, Tooltip } from "@material-ui/core";
import "flag-icon-css/css/flag-icon.css";
import { getCountryName } from "../util/countryName";
import ForceView from "../components/ForceView";
import { withEmit } from "react-emit";
import DappInfo from "../components/DappInfo";

const useStyles = makeStyles(theme => ({
  occupations: {
    "&:hover": {
      cursor: "pointer"
    }
  }
}));

const Country = props => {
  const { code } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const [country, setCountry] = React.useState(null);

  const fetchCountries = async () => {
    let data = await fetch(api + "/world").then(res => res.json());
    let countries = data.countries;
    let codes = Object.keys(countries);
    if (!codes.includes(code)) {
      history.push("/");
      return;
    }

    let country = countries[code];
    sortForces(country);
    country.freeUnits = firstDraftConvert(country.freeUnits);

    setCountry(country);
  };

  const firstDraftConvert = units => {
    console.log(units);
    let result = [];
    let ALLOWED = [
      0,
      1,
      2,
      3,
      12,
      13,
      16,
      17,
      18,
      25,
      26,
      27,
      28,
      37,
      38,
      41,
      42,
      43,
      50,
      51,
      52,
      53,
      62,
      63,
      66,
      67,
      68,
      75,
      76,
      77,
      78,
      87,
      88,
      91,
      92,
      93
    ];
    let length = units[0].toString().length;
    if (length <= 2) {
      units.forEach(unit => {
        if (ALLOWED.includes(parseInt(unit))) result.push(parseInt(unit));
      });
    } else if (length <= 3) {
      units.forEach(unit => {
        let sub = unit.toString().substring(1, 3);
        if (ALLOWED.includes(parseInt(sub))) result.push(parseInt(unit));
      });
    } else if (length <= 4) {
      units.forEach(unit => {
        let sub = unit.toString().substring(2, 4);
        if (ALLOWED.includes(parseInt(sub))) result.push(parseInt(unit));
      });
    } else if (length <= 5) {
      units.forEach(unit => {
        let sub = unit.toString().substring(3, 5);
        if (ALLOWED.includes(parseInt(sub))) result.push(parseInt(unit));
      });
    }
    return result;
  };

  const sortForces = country => {
    for (let code in country.forces) {
      country.forces[code].code = code;
    }

    let forces = Object.values(country.forces).sort((a, b) =>
      a.dominance > b.dominance || a.code == country.command
        ? -1
        : a.dominance < b.dominance
    );

    country.forces = forces;
  };

  React.useEffect(() => {
    fetchCountries();
    props.on("refresh", fetchCountries);
  }, [code]);

  return (
    <React.Fragment>
      {country && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginTop={5}
        >
          {/* Country header */}
          <Box
            borderTop="2px solid black"
            borderBottom="2px solid black"
            width={0.99}
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            paddingY={2}
          >
            <Box fontSize={40} fontWeight="bold">
              {getCountryName(code)}
            </Box>
            <Box fontSize={50}>
              <span
                className={`flag-icon flag-icon-${code.toLowerCase()}`}
              ></span>
            </Box>
          </Box>
          {/* Occupations */}

          <Box
            position="relative"
            width={0.99}
            height={36}
            overflow="hidden"
            borderBottom="2px solid black"
            fontSize={30}
            paddingY={1}
            display={country.occupations.length <= 0 && "none"}
          >
            <Box
              position="absolute"
              top={8}
              bottom={-17}
              left={0}
              right={0}
              style={{
                overflowX: "scroll",
                whiteSpace: "nowrap"
              }}
            >
              <span
                style={{
                  marginRight: 20,
                  marginLeft: 10,
                  fontWeight: "bolder"
                }}
              >
                {getCountryName(code)} Empire
              </span>
              {country.occupations.map(code => (
                <Tooltip title={getCountryName(code)} key={code}>
                  <span
                    onClick={() => history.push(code)}
                    className={[
                      `flag-icon flag-icon-${code.toLowerCase()}`,
                      classes.occupations
                    ].join(" ")}
                    style={{ marginLeft: 10 }}
                  ></span>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Forces */}
          {country.forces &&
            country.forces.map(force => {
              let isCommand = country.command == force.code;

              return (
                <ForceView
                  key={force.code}
                  force={force}
                  isCommand={isCommand}
                ></ForceView>
              );
            })}

          {/* Free units */}
          {country.freeUnits.length > 0 && (
            <ForceView
              force={{ units: country.freeUnits, code: country.code }}
              free={true}
            ></ForceView>
          )}
        </Box>
      )}
    </React.Fragment>
  );
};

export default withEmit(Country);
