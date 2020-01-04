import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Box,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import UnitCard from "./UnitCard";
import { Scrollbars } from "react-custom-scrollbars";
import { CCDContract } from "../eth/contract";
import { api } from "../config";
import Icon from "../assets/icon.png";
import "./Loader.css";

const LazyLoadUnits = props => {
  const [units, setUnits] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [buying, setBuying] = React.useState(false);
  const fetchTokens = async () => {
    if (!props.units) return;
    if (props.part == 0) {
      setLoading(true);
    }
    let units = [];
    for (let tokenId of props.units) {
      let unit = await CCDContract.methods.getToken(tokenId).call();
      let currentCode = await fetch(api + "/tokenCountry", {
        method: "POST",
        body: JSON.stringify({ tokenId }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.json());
      unit.tokenId = tokenId;
      unit.currentCode = currentCode.code;
      units.push(unit);
    }
    setUnits(units);

    setLoading(false);
  };

  React.useEffect(() => {
    fetchTokens();
  }, [props.units]);

  return loading ? (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      marginLeft="-100px"
      marginTop="-100px"
      zIndex={10}
    >
      <img src={Icon} className="loader" width="200px" />
    </Box>
  ) : (
    units &&
      units.map(unit => (
        <Grid item xs={12} sm={4} md={3} lg={2} key={unit.tokenId}>
          <UnitCard
            unit={unit}
            countries={props.countries}
            buying={buying}
            onBuying={buy => setBuying(buy)}
          />
        </Grid>
      ))
  );
};

const UnitsList = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);
  const [buying, setBuying] = React.useState(false);
  const [units, setUnits] = React.useState(null);
  const [countries, setCountries] = React.useState(null);
  React.useImperativeHandle(ref, () => ({
    showUnits() {
      setOpen(true);
    }
  }));

  const fetchCountries = async () => {
    let data = await fetch(api + "/world").then(res => res.json());
    let countries = Object.keys(data.countries);
    setCountries(countries);
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

    units.forEach(unit => {
      let length = unit.toString().length;
      if (length <= 2) {
        if (ALLOWED.includes(parseInt(unit))) result.push(parseInt(unit));
      } else if (length <= 3) {
        let sub = unit.toString().substring(1, 3);
        if (ALLOWED.includes(parseInt(sub))) result.push(parseInt(unit));
      } else if (length <= 4) {
        let sub = unit.toString().substring(2, 4);
        if (ALLOWED.includes(parseInt(sub))) result.push(parseInt(unit));
      } else if (length <= 5) {
        let sub = unit.toString().substring(3, 5);
        if (ALLOWED.includes(parseInt(sub))) result.push(parseInt(unit));
      }
    });
    return result;
  };

  const partUnits = () => {
    if (!props.units || props.units.length == 0) return;
    let firstDraft = firstDraftConvert(props.units);
    let result = [];
    let numUnits = 20;
    // for (let i = 0; i < props.units.length; i += numUnits) {
    //   let part = [];
    //   for (let j = i; j < i + numUnits; j++) {
    //     if (!props.units[j] && props.units[j] != 0) break;
    //     part.push(props.units[j]);
    //   }

    //   result.push(part);
    // }

    for (let i = 0; i < firstDraft.length; i += numUnits) {
      let part = [];
      for (let j = i; j < i + numUnits; j++) {
        if (!firstDraft[j] && firstDraft[j] != 0) break;
        part.push(firstDraft[j]);
      }

      result.push(part);
    }
    console.log(result);
    setUnits(result);
  };

  React.useEffect(() => {
    partUnits();
    fetchCountries();
  }, [props.units]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="lg"
      fullWidth={true}
      scroll="paper"
    >
      <DialogTitle>{props.title}</DialogTitle>
      <IconButton
        aria-label="close"
        style={{ position: "absolute", top: 5, right: 5 }}
        onClick={() => setOpen(false)}
      >
        <CloseIcon />
      </IconButton>
      <Scrollbars
        style={{ height: 900 }}
        renderThumbVertical={({ style, ...props }) => (
          <div
            {...props}
            style={{
              ...style,
              backgroundColor: "#415511",
              borderRadius: 20
            }}
          />
        )}
      >
        <Box marginX={5} height={1}>
          {!units ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={1}
            >
              <span style={{ fontSize: 18 }}>NO UNITS</span>
            </Box>
          ) : (
            <React.Fragment>
              <Grid
                container
                spacing={2}
                style={{ marginBottom: 20, marginTop: 2 }}
              >
                {units &&
                  units.length > 0 &&
                  units.map((part, index) => {
                    return (
                      <LazyLoadUnits
                        part={index}
                        units={part}
                        countries={countries}
                        key={index}
                      />
                    );
                  })}
              </Grid>
            </React.Fragment>
          )}
        </Box>
      </Scrollbars>
    </Dialog>
  );
});

export default UnitsList;
