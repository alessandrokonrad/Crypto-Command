import React from "react";
import { Box, Grid, makeStyles } from "@material-ui/core";
import EthBanner from "../assets/ethBanner.svg";
import MMBanner from "../assets/mmBanner.svg";
import FacebookIcon from "../assets/facebook.png";
import TwitterIcon from "../assets/twitter.png";
import DiscordIcon from "../assets/discord.png";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  item: {
    color: "#bdbdbd",
    marginBottom: 2,
    "&:hover": {
      color: "white",
      cursor: "pointer"
    }
  },
  socialIcon: {
    "&:hover": {
      filter: "invert(1)"
    }
  },
  banner: {
    width: "170px"
  }
}));

const CommandFooter = () => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <React.Fragment>
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        bgcolor="#212121"
      >
        <Box marginTop={3} />
        <Grid container spacing={10} justify="center" alignItems="center">
          <Grid
            item
            xs={12}
            md={2}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Box color="white">
              <h3>About</h3>
              <Box
                fontSize={14}
                className={classes.item}
                onClick={() => {
                  history.push("/");
                }}
              >
                Home
              </Box>
              <Box
                fontSize={14}
                className={classes.item}
                onClick={() => {
                  history.push("/howItWorks");
                }}
              >
                How it works
              </Box>
              <Box
                fontSize={14}
                className={classes.item}
                onClick={() => {
                  history.push("/termsOfService");
                }}
              >
                Terms of Service
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={2}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <a href="https://ethereum.org/" target="_blank">
              <img src={EthBanner} className={classes.banner} />
            </a>
          </Grid>

          <Grid
            item
            xs={12}
            md={2}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <a href="https://metamask.io/" target="_blank">
              <img src={MMBanner} className={classes.banner} />
            </a>
          </Grid>
        </Grid>
        <Box marginTop={5} />
        <Box>
          <a href="https://twitter.com/CryptoCommandIO" target="_blank">
            <img
              width={34}
              src={TwitterIcon}
              className={classes.socialIcon}
            ></img>
          </a>
          <a href="https://discord.gg/V6eSctr" target="_blank">
            <img
              width={34}
              src={DiscordIcon}
              className={classes.socialIcon}
              style={{ marginLeft: 20, marginRight: 20 }}
            ></img>
          </a>
          <a href="https://www.facebook.com/CryptoCommand" target="_blank">
            <img
              width={34}
              src={FacebookIcon}
              className={classes.socialIcon}
            ></img>
          </a>
        </Box>
        <Box marginTop={3} />
        <Box textAlign="center" color="white" fontSize={14}>
          All rights reserved. <br />© 2019 CryptoCommand.io
        </Box>
        <Box marginBottom={3} />
      </Box>
    </React.Fragment>
  );
};

export default CommandFooter;
