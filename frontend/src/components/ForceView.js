import React from "react";
import { Box, Button, Icon, makeStyles } from "@material-ui/core";
import UnitsList from "./UnitsList";
import { api } from "../config";
import { CCDContract } from "../eth/contract";
import { getCountryName } from "../util/countryName";
import UnitCard from "./UnitCard";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  countryName: {
    "&:hover": {
      cursor: "pointer"
    }
  },
  unitImages: {
    marginRight: 10,
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  forceHeader: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      marginBottom: 10
    }
  }
}));

const ForceView = props => {
  const history = useHistory();
  const classes = useStyles();
  const unitsListRef = React.useRef();
  const [data, setData] = React.useState(null);

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

  const extractData = async () => {
    let force = props.force;
    let preview = firstDraftConvert(Object.values(force.units)).slice(0, 3);
    setData({
      free: props.free,
      units: force.units,
      preview,
      dominance: force.dominance,
      power: force.power,
      code: force.code,
      isCommand: props.isCommand
    });
  };

  React.useEffect(() => {
    extractData();
  }, [props.force, props.free, props.isCommand]);

  return (
    <Box
      borderBottom="5px solid black"
      width={0.99}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      {data && (
        <React.Fragment>
          <Box
            width={1}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            className={classes.forceHeader}
          >
            <Box padding={2} className={classes.forceHeader}>
              <Box border="1px solid black" padding={1} fontSize={20}>
                {data.free
                  ? `AVAILABLE ${getCountryName(data.code).toUpperCase()} UNITS`
                  : data.isCommand
                  ? "COMMAND"
                  : "OCCUPYING FORCE"}
              </Box>
            </Box>
            <Box
              fontSize={30}
              fontWeight="bold"
              display={data.free && "none"}
              className={[classes.countryName, classes.forceHeader].join(" ")}
              onClick={() => history.push(`${data.code}`)}
            >
              {getCountryName(data.code)}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span
                style={{ fontSize: 30 }}
                className={`flag-icon flag-icon-${data.code.toLowerCase()}`}
              ></span>
            </Box>

            <Box
              textAlign="center"
              width={0.1}
              fontSize={18}
              display={data.free && "none"}
              className={classes.forceHeader}
            >
              <Box marginBottom={1} fontSize={22}>
                {data.dominance}%
              </Box>
              <Box>
                <b>POWER</b> {data.power}
              </Box>
            </Box>
          </Box>
          <Box
            marginY={2}
            width={1}
            // minWidth={700}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {data.preview.map(tokenId => (
              <img
                key={tokenId}
                src={`/assets/${tokenId}.png`}
                width="140px"
                className={classes.unitImages}
              ></img>
            ))}
            <Button
              variant="contained"
              style={{
                boxShadow: "none",
                backgroundColor: "#415511",
                color: "white"
              }}
              endIcon={<Icon>arrow_right</Icon>}
              onClick={() => unitsListRef.current.showUnits()}
            >
              Show Units
            </Button>
          </Box>
          <UnitsList
            ref={unitsListRef}
            title={
              <span>
                <span
                  className={`flag-icon flag-icon-${data.code.toLowerCase()}`}
                ></span>
                &nbsp;&nbsp;&nbsp;
                {getCountryName(data.code)} {data.free ? "Units" : "Force"}
              </span>
            }
            units={data.units}
          ></UnitsList>
        </React.Fragment>
      )}
    </Box>
  );
};

export default ForceView;
