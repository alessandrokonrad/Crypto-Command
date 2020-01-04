import React from "react";
import { Button, Snackbar } from "@material-ui/core";
import isDapp from "../eth/dapp";
import { checkNetwork } from "../eth/contract";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const DappInfo = () => {
  const [open, setOpen] = React.useState({ show: false, msg: "" });

  const checkCompatible = async () => {
    let show = !(await isDapp());
    let mainnet = checkNetwork();
    let msg;
    mainnet ? (msg = "Metamask not found...") : (msg = "Wrong network...");
    setOpen({ show: show || !mainnet, msg });
  };

  React.useEffect(() => {
    checkCompatible();
  }, []);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={open.show}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">{open.msg}</span>}
      action={
        open.msg[0] == "M" && [
          <Button
            key="undo"
            style={{ color: "green" }}
            size="small"
            onClick={() => window.location.assign("https://metamask.io")}
          >
            GET IT
          </Button>,
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={() => setOpen({ ...open, show: false })}
          >
            <CloseIcon />
          </IconButton>
        ]
      }
    />
  );
};

export default DappInfo;
