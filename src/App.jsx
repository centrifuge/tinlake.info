import React from "react";

import { Grommet } from "grommet";

import "./App.css";

import { StoreProvider } from "easy-peasy";
import { store } from "./store";
import { Home } from "./components/home";

function App() {
  return (
    <StoreProvider store={store}>
      <Grommet theme={{}}>
        <Home />
      </Grommet>
    </StoreProvider>
  );
}

export default App;
