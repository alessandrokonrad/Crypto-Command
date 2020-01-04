import React from "react";
import { web3 } from "../eth/contract";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  CircularProgress,
  Box,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { api, signMessage } from "../config";
import MetaMaskIcon from "../assets/metamask-fox.svg";
import CommandIcon from "../assets/icon.png";
import Auth from "../util/auth";

var address;
var signature;

const Login = React.forwardRef((props, ref) => {
  const [error, setError] = React.useState(null);
  const [username, setUsername] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [accept, setAccept] = React.useState(false);
  React.useImperativeHandle(ref, () => ({
    login() {
      setOpen(true);
    }
  }));

  return (
    <React.Fragment>
      {/* Login Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        style={{ textAlign: "center" }}
      >
        <Box width={1} height={15}>
          <IconButton
            onClick={() => setOpen(false)}
            style={{ position: "absolute", top: 5, right: 5 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <DialogTitle id="metamask-signature-dialog">
            MetaMask Authentication
          </DialogTitle>
          <img src={MetaMaskIcon} width={60} />
        </Box>

        <Box
          height={100}
          width={350}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {loading ? (
            <CircularProgress style={{ color: "#415511" }} />
          ) : (
            <DialogContent>
              <DialogContentText id="metamask-description-dialog">
                MetaMask will ask you to digitally sign into your wallet in
                order to connect it with cryptocommand.io.
              </DialogContentText>
            </DialogContent>
          )}
        </Box>
        <DialogActions>
          <Button
            style={{ color: "#415511" }}
            onClick={async () => {
              setLoading(true);
              address = web3.currentProvider.selectedAddress;
              signature = await web3.eth.personal
                .sign(signMessage, address)
                .catch(error => console.log("Not signed"));
              if (!signature) {
                setLoading(false);
                return;
              }
              console.log(signature);
              let token = await fetch(api + "/login", {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({ address, signature }),
                headers: {
                  "Content-Type": "application/json"
                }
              })
                .then(res => res.json())
                .then(res => res.token)
                .catch(error => console.log(error));
              if (!token) {
                setOpen(false);
                setLoading(false);
                setOpenRegister(true);
                return;
              }
              Auth.setAuth(token);
              props.onLogin();
              setLoading(false);
              setOpen(false);
            }}
            autoFocus
          >
            Sign
          </Button>
        </DialogActions>
      </Dialog>
      {/* Register Dialog */}
      <Dialog
        open={openRegister}
        onClose={() => {
          setOpenRegister(false);
          setError(null);
        }}
      >
        <Box width={1} height={15}>
          <IconButton
            onClick={() => {
              setOpenRegister(false);
              setError(null);
            }}
            style={{ position: "absolute", top: 5, right: 5 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <DialogTitle id="register-dialog">Create account</DialogTitle>
          <img src={CommandIcon} width={60} height={60} />
        </Box>

        <Box
          height={100}
          width={350}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {loading ? (
            <CircularProgress style={{ color: "#415511" }} />
          ) : (
            <DialogContent
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
              }}
            >
              <Box marginTop={-1} />
              <TextField
                id="filled-basic"
                label="Username"
                onChange={event => setUsername(event.target.value)}
                value={username}
                required
                error={error ? true : false}
                helperText={error ? error.username : null}
              />
              <Box marginTop={2} />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={event => setAccept(event.target.checked)}
                  />
                }
                label={
                  <Link
                    style={{ fontWeight: "normal", color: "#424242" }}
                    onClick={e => {
                      e.preventDefault();
                      window.open("/termsOfService");
                    }}
                  >
                    Terms of Service
                  </Link>
                }
              ></FormControlLabel>
            </DialogContent>
          )}
        </Box>
        <DialogActions>
          <Button
            disabled={!accept}
            style={{ color: "#415511" }}
            onClick={async () => {
              setLoading(true);
              let token = await fetch(api + "/signup", {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                  address,
                  signature,
                  username
                }),
                headers: {
                  "Content-Type": "application/json"
                }
              }).then(res => res.json());

              if (!token.token) {
                setLoading(false);
                setError(token);
                return;
              }

              Auth.setAuth(token.token);
              props.onLogin();
              setLoading(false);
              setOpenRegister(false);
            }}
            autoFocus
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
});

export default Login;
