import React from "react";
import {
  Switch,
  Route,
  Router,
  Redirect,
  BrowserRouter,
  useHistory
} from "react-router-dom";
import Main from "./views/Main";
import Country from "./views/Country";
import TermsOfService from "./views/TermsOfService";
import HowItWorks from "./views/HowItWorks";
import Admin from "./views/Admin";
import CommandHeader from "./components/CommandHeader";
import CommandFooter from "./components/CommandFooter";
import {
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Button,
  Box
} from "@material-ui/core";
import { EmitProvider } from "react-emit";
import DappInfo from "./components/DappInfo";

const App = () => {
  const history = useHistory();

  React.useEffect(() => {
    history.listen(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  return (
    <EmitProvider>
      <Router history={history}>
        <Box style={{ overflowX: "hidden", margin: 0 }}>
          <Box marginTop={3} />
          <CommandHeader />
          <Box marginBottom={3} />
          <Box minHeight="100vh">
            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/country/:code" component={Country} />
              <Route path="/termsOfService" component={TermsOfService} />
              <Route path="/howItWorks" component={HowItWorks} />
              <Route path="/admin" component={Admin} />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          </Box>
          <Box marginBottom={30} />
          <CommandFooter />
          <DappInfo />
        </Box>
      </Router>
    </EmitProvider>
  );
};

export default App;
