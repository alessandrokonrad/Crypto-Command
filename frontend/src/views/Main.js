import React from "react";
import { Box, Grid, withStyles, makeStyles } from "@material-ui/core";
import CommandMap from "../components/CommandMap";
import { api } from "../config";
import CommandList from "../components/CommandList";
import { withEmit } from "react-emit";
import CountryNeed from "../assets/countryNeed.png";
import WeThePeople from "../assets/weThePeople.png";
import CardPreview from "../assets/cardPreview.png";

const useStyle = makeStyles(theme => ({}));

const Main = props => {
  const [data, setData] = React.useState(null);

  const fetchWorld = async () => {
    let data = await fetch(api + "/world").then(res => res.json());
    setData(data);
  };

  React.useEffect(() => {
    fetchWorld();
    props.on("refresh", fetchWorld);
  }, []);

  return (
    <React.Fragment>
      <Box width={1}>
        <Box
          width={1}
          textAlign="center"
          fontSize={45}
          letterSpacing={4}
          fontWeight="bold"
        >
          Global Strategy
          <br />
          <Box fontSize={25} fontWeight="normal">
            {" "}
            ON BLOCKCHAIN
          </Box>
        </Box>
        <Box marginBottom={6} />
        <Box marginX="4%">
          <Grid container spacing={5}>
            <Grid item xs={1} md={1}></Grid>
            <Grid item xs={10} md={3}>
              <CommandList data={data} />
            </Grid>
            <Grid item xs={1} md={1}></Grid>
            <Grid item xs={12} md={7}>
              <CommandMap data={data} />
            </Grid>
            <Grid item md={1}></Grid>
          </Grid>
        </Box>
        <Box
          marginTop={10}
          width={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          {/* First */}
          <Grid container style={{ width: "90%" }}>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={1}
              >
                <Box>
                  <img src={CountryNeed} style={{ maxWidth: 350 }}></img>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={1}
              >
                <Box width={600}>
                  <h2>Command Empires</h2>
                  <p>
                    CryptoCommand is the first global strategy game on
                    Blockchain. Create a new world order and invade other
                    nations to build an empire. It is a game of cunning where
                    your armies are smart contract tokens. With only a limited
                    number ever produced watch their value sky rocket!
                  </p>
                  <h3>Game Play</h3>
                  <p>
                    You can buy army units and deploy them to defend your own
                    country or invade other countries. You can group together
                    with other players to ensure you have the largest Empire on
                    the planet. Move between attack and defence any time you
                    wish, making sure you don’t over-extend yourself and leave
                    your nation open to attack.
                  </p>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* Second */}
          <Grid
            container
            style={{ width: "90%", marginTop: 100 }}
            direction="row-reverse"
          >
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={1}
              >
                <Box>
                  <img src={CardPreview} style={{ maxWidth: 450 }}></img>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={1}
              >
                <Box width={600}>
                  <h2>Your army units are valuable assets</h2>
                  <p>
                    Each unit is linked to one single ERC721 Smart Contract
                    Token on the game’s blockchain.
                  </p>
                  <p>
                    To purchase a Unit Smart Contract send Ether to the contract
                    using{" "}
                    <a href="https://metamask.io/" target="_blank">
                      Metamask
                    </a>
                    . As soon as your transaction has been confirmed you (and
                    only you) have ownership of that Unit.
                  </p>
                  <p>
                    You can buy or sell units at the same time you are
                    conquering the world. The number of units is limited to 100
                    per country, so the value of each one will rise with time
                    and scarcity.
                  </p>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* Third */}
          <Grid container style={{ width: "90%", marginTop: 100 }}>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={1}
              >
                <Box>
                  <img src={WeThePeople} style={{ maxWidth: 250 }}></img>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={1}
              >
                <Box width={600}>
                  <h2>People Power!</h2>
                  <p>
                    Not all units are military. The people of the world also
                    demand a say in who controls their nations. The{" "}
                    <a href="/country/WE">We the People</a> movement is active
                    everywhere and will not stand for military control.
                  </p>
                  <p>
                    Any player can take part in this movement, prevent a
                    military takeover, and take power back into the hands of the
                    people.
                  </p>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default withEmit(Main);
