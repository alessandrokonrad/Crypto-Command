import React from "react";
import {
  Box,
  makeStyles,
  Button,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Scrollbars } from "react-custom-scrollbars";
import { getCountryName } from "../util/countryName";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  listEl: {
    background: "white",
    color: "black",
    "&:hover": {
      background: "black",
      color: "white",

      cursor: "pointer"
    }
  }
}));

const CommandList = props => {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState(null);
  const classes = useStyles();

  const sortWorld = async () => {
    if (!props.data) return;
    let countries = Object.values(props.data.countries).sort((a, b) =>
      a.occupations.length > b.occupations.length
        ? -1
        : a.occupations.length < b.occupations.length
    ); // sort decreasing occupations
    setData(countries);
  };

  React.useEffect(() => {
    sortWorld();
  }, [props.data]);

  return (
    <React.Fragment>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Box width={1} textAlign="center">
          <h2 style={{ margin: 0 }}>COMMANDS</h2>
        </Box>
        {data &&
          data.slice(0, 5).map(country => {
            let name = getCountryName(country.code).toUpperCase();
            let occupationCount = country.occupations.length;
            return (
              <Box
                onClick={() => history.push(`country/${country.code}`)}
                className={classes.listEl}
                marginTop={2}
                key={country.code}
                display="flex"
                alignItems="center"
                justifyContent="center"
                width={1}
                whiteSpace="nowrap"
              >
                <Box
                  flex={4}
                  border="2px solid black"
                  paddingY={1}
                  width={1}
                  paddingLeft={1}
                  textOverflow="ellipsis"
                  overflow="hidden"
                >
                  {name}
                </Box>
                <Box
                  flex={1}
                  border="2px solid black"
                  borderLeft="none"
                  textAlign="center"
                  paddingY={1}
                >
                  {occupationCount}
                </Box>
              </Box>
            );
          })}
        <Button
          style={{ marginTop: 20 }}
          endIcon={<Icon>arrow_right</Icon>}
          onClick={() => setOpen(true)}
        >
          All
        </Button>
      </Box>
      {/* Show all countries */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth={true}
        scroll="paper"
      >
        <DialogTitle>ALL COUNTRIES</DialogTitle>
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
          <DialogContent style={{ marginLeft: 30, marginRight: 30 }}>
            {data &&
              data.map(country => {
                let name = getCountryName(country.code).toUpperCase();
                let code = country.code.toLowerCase();
                let occupationCount = country.occupations.length;
                return (
                  <Box
                    onClick={() => history.push(`country/${country.code}`)}
                    className={classes.listEl}
                    marginBottom={2}
                    key={country.code}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width={1}
                    whiteSpace="nowrap"
                  >
                    <Box
                      flex={4}
                      border="2px solid black"
                      paddingY={1}
                      width={1}
                      paddingLeft={1}
                      textOverflow="ellipsis"
                      overflow="hidden"
                    >
                      <span
                        style={{ marginRight: 20 }}
                        className={`flag-icon flag-icon-${code}`}
                      ></span>
                      <span>{name}</span>
                    </Box>
                    <Box
                      flex={1}
                      border="2px solid black"
                      borderLeft="none"
                      textAlign="center"
                      paddingY={1}
                    >
                      {occupationCount}
                    </Box>
                  </Box>
                );
              })}
          </DialogContent>
        </Scrollbars>
      </Dialog>
    </React.Fragment>
  );
};

export default CommandList;
