import React from "react";
import { api } from "../config";
import Auth from "../util/auth";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Icon
} from "@material-ui/core";
import { CCDContract, web3 } from "../eth/contract";

const Admin = () => {
  const [balance, setBalance] = React.useState(null);
  const [supply, setSupply] = React.useState(0);
  const [lastCode, setLastCode] = React.useState(null);
  const [singleText, setSingleText] = React.useState("");
  const [multipleText, setMultipleText] = React.useState("");
  const [loading, setLoading] = React.useState({
    loading: false,
    success: false
  });

  const getBalance = () => {
    CCDContract.methods
      .getBalance()
      .call()
      .then(res => {
        let bal = parseFloat(web3.utils.fromWei(res, "ether")).toFixed(4);
        setBalance(bal);
      });
  };

  const getLastCode = async totalSupply => {
    if (totalSupply == 0) {
      setLastCode("None");
      return;
    }
    let token = await CCDContract.methods.getToken(totalSupply - 1).call();
    setLastCode(token.country);
  };

  const getData = async () => {
    getBalance();
    let totalSupply = await CCDContract.methods.totalSupply().call();
    getLastCode(totalSupply);
    setSupply(totalSupply);
  };

  React.useEffect(() => {
    getData();
  });

  return (
    <Box
      display="flex"
      alignItems="center"
      // justifyContent="center"
      height="100vh"
      width="100%"
      textAlign="center"
      flexDirection="column"
    >
      <h1>DASHBOARD</h1>
      <Box marginTop={5} />
      {/* <Box
        border="2px solid black"
        width={0.3}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        {" "}
        <h3>Add single unit</h3>
        <TextField
          style={{ width: "90%" }}
          placeholder="country,price,power,type"
          label="Add unit"
          value={singleText}
          onChange={event => setSingleText(event.target.value)}
        ></TextField>
        <Box marginTop={3} />
        <Button
          variant="contained"
          style={{ marginBottom: 10, background: "orange", color: "white" }}
        >
          Add single
        </Button>
      </Box>
      <Box marginTop={5} /> */}
      <Box
        border="2px solid black"
        width={0.3}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <h3>Add multiple (quarter country)</h3>
        <Box>
          Total supply: {supply} - Last used code: {lastCode}
        </Box>
        <TextField
          style={{ width: "90%" }}
          label="Add units"
          placeholder="code"
          value={multipleText}
          onChange={event => setMultipleText(event.target.value)}
        ></TextField>
        <Box marginTop={3} />
        <Button
          onClick={() => {
            // let token = Auth.getAuth();
            // if (!token) return;
            setLoading({ loading: true, success: false });
            let code = multipleText.split(" ")[0];
            // CCDContract.methods
            //   .mintCountry(code, quarter)
            //   .send({ from: web3.currentProvider.selectedAddress })
            //   .on("receipt", receipt => {
            // fetch(api + "/addCountry", {
            //   method: "POST",
            //   mode: "cors",
            //   headers: {
            //     "Content-Type": "application/json",
            //     Authorization: "Bearer " + token
            //   },
            //   body: JSON.stringify({ receipt, code, quarter })
            // }).then(res => {
            //       setLoading({ loading: false, success: true });
            //       setTimeout(
            //         () => setLoading({ loading: false, success: false }),
            //         2000
            //       );
            //       getData();
            //     });
            //   })
            //   .catch(() => setLoading({ loading: false, success: false }));
            CCDContract.methods
              .mintCountry(code)
              .send({ from: web3.currentProvider.selectedAddress })
              .on("receipt", receipt => {
                setLoading({ loading: false, success: true });
                setTimeout(
                  () => setLoading({ loading: false, success: false }),
                  2000
                );
                getData();
              })
              .catch(() => setLoading({ loading: false, success: false }));
          }}
          variant="contained"
          style={{ marginBottom: 10, background: "orange", color: "white" }}
        >
          {loading.loading ? (
            <CircularProgress size={24} style={{ color: "white" }} />
          ) : loading.success ? (
            <Icon>done</Icon>
          ) : (
            <span>Add multiple</span>
          )}
        </Button>
      </Box>
      <Box marginTop={5} />
      <Box border="2px solid black" width={0.3}>
        <h3>Balance: {balance} ETH</h3>
        <Button
          onClick={() =>
            CCDContract.methods
              .withdraw()
              .send({ from: web3.currentProvider.selectedAddress })
          }
          variant="contained"
          color="secondary"
          style={{ marginBottom: 10 }}
        >
          Withdraw
        </Button>
      </Box>
    </Box>
  );
};

export default Admin;
