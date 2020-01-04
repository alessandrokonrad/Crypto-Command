import React from "react";
import { Box } from "@material-ui/core";

const HowItWorks = () => {
  return (
    <Box
      display="flex"
      marginTop={10}
      alignItems="center"
      justifyContent="center"
    >
      <Box maxWidth={900} marginX={3}>
        <h1>
          <strong>How it works</strong>
        </h1>
        <p>
          Every country in the world has military units in training. When they
          are ready for deployment they will appear in the ‘Available Units’
          section on the country’s page. Each unit has one smart contract token.
          If you buy it, you own it, and your ownership will be visible on our
          interactive world map.
        </p>
        <p>
          The units are visible on the Ethereum Blockchain as smart contracts.
          Meaning, they can only be acquired using Ether. Each unit contract
          works similarly to a token or a coin and can only be owned by one
          individual.
        </p>
        <p>
          When you ‘buy’ a unit it immediately represents its home country
          within its country page. You can also see that unit by clicking the
          ‘My Units’ link at the top of the Site. You will be able to SELL this
          unit or MOVE it. If you wish to SELL click the ‘ON SALE’ button and
          select the price you wish to sell it for. If you wish to MOVE your
          unit to another country select the destination country from the
          drop-down menu.
        </p>
        <p>
          YOU MAY FIND THAT INTERACTIONS WITH THE BLOCKCHAIN CAN BE SLOW AT
          TIMES, BUT BE PATIENT WHILST THE TRANSACTION IS SAFELY STORED
        </p>
        <p>
          A country can COMMAND another country by holding more POWER than any
          other country that is represented there. POWER is defined as the sum
          of the country’s units' powers.
        </p>
        <p>
          Countries will represent an OCCUPYING FORCE within another country if
          their combined power score is less than the country in COMMAND.
        </p>
        <p>
          The COMMANDS table of the front page of the Site shows which countries
          have the largest empires in terms of number of countries commanded.
        </p>
        <p>
          <strong>The Units</strong>
        </p>
        <p>
          Every country has 100 units, and these units will become available for
          deployment at any time – although CryptoCommand will announce new
          deployment dates via social media. The total units that will ever
          become active per country are:
        </p>
        <Box
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop={5}
        >
          <table width="370" cellpadding="0" cellspacing="0" border="1">
            <colgroup>
              <col width="77" />
              <col width="134" />
              <col width="85" />
            </colgroup>
            <tbody>
              <tr valign="top">
                <td width="77">
                  <p>Number</p>
                </td>
                <td width="134">
                  <p>Unit</p>
                </td>
                <td width="85">
                  <p>Power</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77"></td>
                <td width="134"></td>
                <td width="85"></td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>24</p>
                </td>
                <td width="134">
                  <p>Squad</p>
                </td>
                <td width="85">
                  <p>1</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>6</p>
                </td>
                <td width="134">
                  <p>Platoon</p>
                </td>
                <td width="85">
                  <p>4</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>6</p>
                </td>
                <td width="134">
                  <p>Mortar Platoon</p>
                </td>
                <td width="85">
                  <p>8</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>8</p>
                </td>
                <td width="134">
                  <p>Anti-Aircraft Unit</p>
                </td>
                <td width="85">
                  <p>12</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>9</p>
                </td>
                <td width="134">
                  <p>Company</p>
                </td>
                <td width="85">
                  <p>16</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>10</p>
                </td>
                <td width="134">
                  <p>Artillery Unit</p>
                </td>
                <td width="85">
                  <p>20</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>4</p>
                </td>
                <td width="134">
                  <p>Parachute Company</p>
                </td>
                <td width="85">
                  <p>24</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>6</p>
                </td>
                <td width="134">
                  <p>Battalion</p>
                </td>
                <td width="85">
                  <p>32</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>6</p>
                </td>
                <td width="134">
                  <p>Tank Company</p>
                </td>
                <td width="85">
                  <p>45</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>6</p>
                </td>
                <td width="134">
                  <p>Brigade</p>
                </td>
                <td width="85">
                  <p>64</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>4</p>
                </td>
                <td width="134">
                  <p>Air Squadron</p>
                </td>
                <td width="85">
                  <p>85</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>3</p>
                </td>
                <td width="134">
                  <p>Special Forces Unit</p>
                </td>
                <td width="85">
                  <p>100</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>4</p>
                </td>
                <td width="134">
                  <p>Airfield</p>
                </td>
                <td width="85">
                  <p>250</p>
                </td>
              </tr>
              <tr valign="top">
                <td width="77">
                  <p>4</p>
                </td>
                <td width="134">
                  <p>Command Centre</p>
                </td>
                <td width="85">
                  <p>500</p>
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  );
};

export default HowItWorks;
