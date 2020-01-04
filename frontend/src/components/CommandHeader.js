import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Icon,
  IconButton,
  Tooltip,
  makeStyles
} from "@material-ui/core";
import Logo from "../assets/logo.png";
import Login from "./Login";
import UnitsList from "./UnitsList";
import Auth from "../util/auth";
import { api } from "../config";
import { web3, CCDContract, checkNetwork } from "../eth/contract";
import isDapp from "../eth/dapp";
import { useHistory } from "react-router-dom";
import { withEmit } from "react-emit";

const useStyles = makeStyles(theme => ({
  logo: {
    "&:hover": {
      cursor: "pointer"
    }
  }
}));

var hasCredentials = false;

const CommandHeader = props => {
  const classes = useStyles();
  const loginRef = React.useRef();
  const unitsListRef = React.useRef();
  const [auth, setAuth] = React.useState(null);
  const [units, setUnits] = React.useState(null);
  const history = useHistory();

  const checkAuth = async () => {
    let token = Auth.getAuth();
    if (!token) {
      setAuth(null);
      return;
    }
    fetchUser(token);
  };

  const fetchUser = async token => {
    if (!token || hasCredentials) return;
    let user = await fetch(api + "/user", {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    }).then(res => res.json());
    user = user.credentials;
    setAuth({ username: user.username });
    hasCredentials = true;
  };

  const getMyUnits = async () => {
    let token = Auth.getAuth();
    if (!isDapp() || !token) return;
    let address = web3.currentProvider.selectedAddress;
    let units = await CCDContract.methods.getTokens(address).call();
    setUnits(units);
    checkUnits();
  };

  const checkUnits = () => {
    let token = Auth.getAuth();
    if (!isDapp() || !token) return;
    fetch(api + "/checkMyUnits", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ tokenIds: units })
    });
  };

  React.useEffect(() => {
    getMyUnits();
    setInterval(() => checkAuth(), 500);
    props.on("refresh", getMyUnits);
  }, []);

  return (
    <React.Fragment>
      <AppBar
        position="static"
        elevation={0}
        style={{ background: "transparent" }}
      >
        <Toolbar>
          <Box flexGrow={1}>
            {
              <img
                className={classes.logo}
                onClick={() => history.push("/")}
                src={Logo}
                style={{ maxWidth: 230 }}
              />
            }
          </Box>
          {auth && (
            <Box marginRight="1%">
              <Button
                onClick={() => {
                  checkUnits();
                  if (!units) getMyUnits();
                  unitsListRef.current.showUnits();
                }}
              >
                My Units
              </Button>
            </Box>
          )}
          {!auth ? (
            <Button
              onClick={() => {
                if (!isDapp() || !checkNetwork()) return;
                loginRef.current.login();
              }}
            >
              Login
            </Button>
          ) : (
            <Tooltip title={auth.username}>
              <IconButton>
                <Icon style={{ color: "#415511" }}>perm_identity</Icon>
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      <Login
        ref={loginRef}
        onLogin={() => {
          checkAuth();
          getMyUnits();
        }}
      />
      <UnitsList
        ref={unitsListRef}
        title={auth ? `${auth.username}'s Units` : "My Units"}
        units={units}
      ></UnitsList>
    </React.Fragment>
  );
};

export default withEmit(CommandHeader);
