import React from "react";
import world from "../assets/world.json";
import { VectorMap } from "@south-paw/react-vector-maps";
import "./CommandMap.css";
import "flag-icon-css/css/flag-icon.css";
import { Card, CardHeader, Box, Divider } from "@material-ui/core";
import { getCountryName } from "../util/countryName";
import { useHistory } from "react-router-dom";

const CommandWorld = props => {
  const history = useHistory();
  const ref = React.useRef();
  const [hovered, setHovered] = React.useState(null);
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });
  const layerProps = {
    onClick: event =>
      history.push(`country/${event.target.attributes.id.value.toUpperCase()}`),
    onMouseEnter: event => {
      let code = event.target.attributes.id.value.toUpperCase();
      let country = props.data ? props.data.countries[code] : null;
      let countryData = { name: "", code: "" };
      if (country)
        countryData = {
          name: getCountryName(country.code).toUpperCase(),
          code: code.toLowerCase(),
          command: country.command
            ? getCountryName(country.command).toUpperCase()
            : null,
          commandCode: country.command ? country.command.toLowerCase() : null
        };
      else
        countryData = {
          name: getCountryName(code).toUpperCase(),
          code: code.toLowerCase()
        };
      setHovered(countryData);
    },
    onMouseMove: event => {
      setMouse({ x: event.clientX, y: event.clientY });
    },
    onMouseLeave: ({ target }) => setHovered(null)
  };

  const colorizeCountries = () => {
    if (!props.data) return;
    let countries = props.data.countries;
    for (let code in countries) {
      let color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
      countries[code].occupations.forEach(occupation => {
        let countryHTML = document.getElementById(occupation.toLowerCase());
        if (countryHTML) countryHTML.style.fill = color;
      });
    }
  };

  React.useEffect(() => {
    colorizeCountries();
  }, [props.data]);

  return (
    <React.Fragment>
      <VectorMap {...world} layerProps={layerProps} />
      {hovered && (
        <Box
          ref={ref}
          position="fixed"
          bgcolor="white"
          borderRadius={5}
          textAlign="center"
          border="1px solid grey"
          left={
            mouse.x / window.innerWidth < 0.75
              ? mouse.x
              : ref.current
              ? mouse.x - ref.current.clientWidth
              : mouse.x - 200
          }
          top={mouse.y + 50}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            width="100%"
            height="100%"
          >
            <Box
              width={1}
              display="flex"
              alignItems="center"
              justifyContent="space-evenly"
              flexDirection="row"
              marginX={5}
              marginTop={1}
              marginBottom={1}
            >
              <Box>
                <h3 style={{ margin: 0 }}>{hovered.name}</h3>
              </Box>
              <Box fontSize={25}>
                <span className={`flag-icon flag-icon-${hovered.code}`}></span>
              </Box>
            </Box>
            <h4 style={{ margin: 0 }}>Commanded by:</h4>
            <Box
              width={1}
              display="flex"
              alignItems="center"
              justifyContent="space-evenly"
              flexDirection="row"
              marginX={5}
              marginTop={1}
              marginBottom={1}
            >
              {!hovered.command ? (
                <Box>
                  <h4 style={{ margin: 0 }}>Not occupied</h4>
                </Box>
              ) : (
                <React.Fragment>
                  <Box>
                    <h4 style={{ margin: 0 }}>{hovered.command}</h4>
                  </Box>
                  <Box fontSize={15}>
                    <span
                      className={`flag-icon flag-icon-${hovered.commandCode}`}
                    ></span>
                  </Box>
                </React.Fragment>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};

export default CommandWorld;
