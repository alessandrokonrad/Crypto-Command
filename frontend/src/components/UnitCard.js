import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Grid,
  Icon,
  DialogActions,
  TextField,
  CircularProgress
} from "@material-ui/core";
import { web3, CCDContract, checkNetwork } from "../eth/contract";
import Auth from "../util/auth";
import { api } from "../config";
import { getCountryName } from "../util/countryName";
import CloseIcon from "@material-ui/icons/Close";
import CountrySelector from "./CountrySelector";
import SellSwitch from "./SellSwitch";
import isDapp from "../eth/dapp";
import { withEmit } from "react-emit";

const UnitCard = props => {
  const [code, setCode] = React.useState("");

  const [image, setImage] = React.useState(null);
  const [openMove, setOpenMove] = React.useState(false);
  const [openSell, setOpenSell] = React.useState(false);
  const [onSale, setOnSale] = React.useState(false);
  const [sellPrice, setSellPrice] = React.useState(0);
  const [loading, setLoading] = React.useState({
    sell: false,
    buy: false,
    move: false
  });

  const isMyUnits = () => {
    if (!isDapp() || !checkNetwork()) return;
    return (
      web3.eth.currentProvider.selectedAddress.toLowerCase() ===
      props.unit.owner.toLowerCase()
    );
  };

  React.useEffect(() => {
    props.unit && setOnSale(props.unit.onSale);
    props.unit &&
      setSellPrice(
        parseFloat(
          web3.utils.fromWei(props.unit.currentSellPrice, "ether")
        ).toFixed(4)
      );
  }, [props.unit]);

  return (
    <React.Fragment>
      <Box display="inline-block">
        <img
          src={`/assets/${
            props.unit ? props.unit.tokenId + ".png" : -1 + ".jpeg"
          }`}
          width="100%"
        ></img>
        <Box
          marginTop={-10}
          bgcolor="#212121"
          color="white"
          borderRadius="0 0 25px 25px"
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
          flexDirection="column"
        >
          <Box marginTop={11} marginBottom={1} textAlign="center">
            <Box marginBottom={1} fontWeight="bold" fontSize={15}>
              {props.unit && props.unit.ownerName}
            </Box>
          </Box>
          {!checkNetwork() || //TODO: NEEDS TO BE SET ON "!" WHEN MAINNET
          !Auth.getAuth() ||
          !isDapp() ||
          (props.unit && !isMyUnits()) ? (
            <Button
              variant="contained"
              disabled={
                !props.unit.onSale ||
                !isDapp() ||
                !checkNetwork() ||
                !Auth.getAuth() ||
                props.buying
              }
              onClick={async () => {
                if (!isDapp()) return;
                let token = Auth.getAuth();
                if (!token) return;
                setLoading({ ...loading, buy: true });
                props.onBuying(true);
                let user = await fetch(api + "/user", {
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                  }
                }).then(res => res.json());
                let username = user.credentials.username;
                let address = web3.currentProvider.selectedAddress;

                CCDContract.methods
                  .purchase(props.unit.tokenId, username)
                  .send({ from: address, value: props.unit.currentSellPrice })
                  .on("receipt", receipt => {
                    fetch(api + "/purchase", {
                      method: "POST",
                      body: JSON.stringify({
                        receipt,
                        tokenId: parseInt(props.unit.tokenId)
                      }),
                      mode: "cors",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token
                      }
                    }).then(() => {
                      setLoading({ ...loading, buy: false });
                      props.onBuying(false);
                      props.emit("refresh");
                    });
                  })
                  .catch(() => {
                    setLoading({ ...loading, buy: false });
                    props.onBuying(false);
                  });
              }}
              fullWidth
              style={{
                color: "white",
                backgroundColor: "#415511"
              }}
            >
              {!props.unit.onSale ? (
                <span>NOT FOR SALE</span>
              ) : loading.buy ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                <span>
                  BUY &nbsp; | &nbsp;{" "}
                  {parseFloat(
                    web3.utils.fromWei(props.unit.currentSellPrice, "ether")
                  ).toFixed(4)}{" "}
                  ETH
                </span>
              )}
            </Button>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={1}
            >
              <Button
                variant="contained"
                fullWidth
                style={{
                  color: "white",
                  backgroundColor: "#1b5e20",
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0
                }}
                onClick={() => setOpenSell(true)}
              >
                SELL
              </Button>
              <Button
                variant="contained"
                fullWidth
                style={{
                  color: "white",
                  backgroundColor: "#ef6c00",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0
                }}
                onClick={() => setOpenMove(true)}
              >
                MOVE
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {isMyUnits() && (
        <React.Fragment>
          <Dialog
            open={openMove}
            onClose={() => setOpenMove(false)}
            maxWidth="sm"
            fullWidth={true}
          >
            <DialogTitle>
              {props.unit
                ? getCountryName(props.unit.country) + " " + props.unit.armyType
                : ""}
            </DialogTitle>
            <IconButton
              aria-label="close"
              style={{ position: "absolute", top: 5, right: 5 }}
              onClick={() => setOpenMove(false)}
            >
              <CloseIcon />
            </IconButton>

            <Box
              overflow="hidden"
              marginX={7}
              marginY={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <Grid container spacing={3}>
                <Grid item xs={5}>
                  <Box fontSize={25} marginBottom={3} fontWeight="bold">
                    FROM
                  </Box>
                  {props.unit && (
                    <React.Fragment>
                      <span
                        className={`flag-icon flag-icon-${props.unit
                          .currentCode &&
                          props.unit.currentCode.toLowerCase()}`}
                        style={{ fontSize: 35 }}
                      ></span>
                      <Box marginTop={2}>
                        {props.unit.currentCode &&
                          getCountryName(props.unit.currentCode)}
                      </Box>
                    </React.Fragment>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <Icon fontSize="large">arrow_right</Icon>
                </Grid>
                <Grid item xs={5}>
                  <Box fontSize={25} marginBottom={3} fontWeight="bold">
                    TO
                  </Box>
                  <CountrySelector
                    countries={props.countries}
                    from={(props.unit && props.unit.currentCode) || "None"}
                    onSelect={code => setCode(code)}
                  ></CountrySelector>
                </Grid>
              </Grid>
            </Box>
            <DialogActions>
              <Button
                onClick={() => {
                  if (!isDapp()) return;
                  let token = Auth.getAuth();
                  if (!token) return;
                  setLoading({ ...loading, move: true });
                  fetch(api + "/moveUnit", {
                    mode: "cors",
                    method: "POST",
                    body: JSON.stringify({
                      tokenId: parseInt(props.unit.tokenId),
                      code: code
                    }),
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + token
                    }
                  })
                    .then(() => {
                      setLoading({ ...loading, move: false });
                      setOpenMove(false);
                      props.emit("refresh");
                    })
                    .catch(() => {
                      setLoading({ ...loading, move: false });
                    });
                }}
                variant="contained"
                style={{
                  boxShadow: "none",
                  backgroundColor: "#ef6c00",
                  color: "white"
                }}
              >
                {" "}
                {loading.move ? (
                  <CircularProgress size={24} style={{ color: "white" }} />
                ) : (
                  <span>Move</span>
                )}
              </Button>
            </DialogActions>
          </Dialog>
          {/* Sell Dialog */}
          <Dialog
            open={openSell}
            onClose={() => {
              setOpenSell(false);
              setOnSale(props.unit.onSale);
            }}
            maxWidth="sm"
            fullWidth={true}
          >
            <DialogTitle>
              {props.unit
                ? getCountryName(props.unit.country) + " " + props.unit.armyType
                : ""}
            </DialogTitle>
            <IconButton
              aria-label="close"
              style={{ position: "absolute", top: 5, right: 5 }}
              onClick={() => {
                setOpenSell(false);
                setOnSale(props.unit.onSale);
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box
              overflow="hidden"
              marginX={7}
              marginBottom={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              flexDirection="column"
            >
              <Box fontSize={22} marginBottom={1} fontWeight="bold">
                UNIT PRICE
              </Box>
              {props.unit && (
                <Box fontSize={18}>
                  {parseFloat(
                    web3.utils.fromWei(props.unit.price, "ether")
                  ).toFixed(4)}{" "}
                  ETH
                </Box>
              )}
              <Box marginBottom={5} />
              {props.unit && (
                <SellSwitch
                  value={props.unit.onSale}
                  onSwitch={sale => {
                    if (!isDapp() || !Auth.getAuth()) return;
                    setOnSale(sale);
                    if (!sale && props.unit.onSale)
                      CCDContract.methods
                        .setOnSale(props.unit.tokenId, 0)
                        .send({ from: web3.currentProvider.selectedAddress })
                        .then(() => {
                          setOpenSell(false);
                          props.emit("refresh");
                        });
                  }}
                ></SellSwitch>
              )}

              {onSale && (
                <React.Fragment>
                  <Box
                    fontSize={22}
                    marginTop={4}
                    marginBottom={2}
                    fontWeight="bold"
                  >
                    SELLING
                  </Box>
                  <TextField
                    placeholder="ETH"
                    helperText={"Sell price must be higher than unit price"}
                    id="outlined-number"
                    label="Sell Price (ETH)"
                    type="number"
                    value={sellPrice}
                    onChange={event => setSellPrice(event.target.value)}
                    InputLabelProps={{
                      shrink: true
                    }}
                    margin="normal"
                    variant="outlined"
                  />
                  <Button
                    onClick={() => {
                      if (!isDapp() || !Auth.getAuth()) return;
                      console.log(sellPrice);

                      let _sellPrice = web3.utils.toWei(sellPrice, "ether");
                      console.log(_sellPrice);
                      console.log(props.unit.price);
                      console.log(props.unit.price >= _sellPrice);
                      if (parseInt(props.unit.price) >= parseInt(_sellPrice))
                        return;
                      setLoading({ ...loading, sell: true });
                      CCDContract.methods
                        .setOnSale(props.unit.tokenId, _sellPrice)
                        .send({ from: web3.currentProvider.selectedAddress })
                        .then(() => {
                          props.emit("refresh");
                          setLoading({ ...loading, sell: false });
                          setOpenSell(false);
                        })
                        .catch(() => setLoading({ ...loading, sell: false }));
                    }}
                    variant="contained"
                    style={{
                      backgroundColor: "#1b5e20",
                      color: "white",
                      marginTop: 20
                    }}
                  >
                    {loading.sell ? (
                      <CircularProgress size={24} style={{ color: "white" }} />
                    ) : (
                      <span>Sell</span>
                    )}
                  </Button>
                </React.Fragment>
              )}
            </Box>
          </Dialog>
        </React.Fragment>
      )}
      {/* Move Dialog */}
    </React.Fragment>
  );
};

export default withEmit(UnitCard);
