import React, { useEffect, useContext } from "react";

import { Anchor, Box, Image, ResponsiveContext, Text } from "grommet";
import { useStoreActions } from "easy-peasy";

import logo from "../logo.svg";
import { AssetValueAreaChart } from "./assetvaluechart";
import { OriginationsChart } from "./originationschart";
import { TotalNumbers } from "./totals";
import { PoolList } from "./poollist";
import { UserChart } from './userchart'

const useInterval = (callback: any, delay: number) => {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

function DataContainer(props) {
  const loadData = useStoreActions((actions) => actions.loadData);
  useEffect(() => {
    loadData();
  }, [loadData]);
  useInterval(() => {
    loadData();
  }, 1000); // TODO: does not work
  return props.children;
}

export const Container = ({ children, pad, ...rest }) => {
  const size = useContext(ResponsiveContext);

  return (
    <Box
      pad={{ horizontal: size === "small" ? "medium" : "xlarge", ...pad }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export const PageHeader = () => (
  <Box alignSelf="stretch" align="center">
    <Image src={logo} height="65px" />
    <Text size="large" weight={500}>
      tinlake.info
    </Text>
  </Box>
);

export const Charts = () => {
  const size = useContext(ResponsiveContext);

  return (
    <Box
      direction={size === "small" ? "column" : "row"}
      gap="medium"
      alignSelf="stretch"
    >
      <Box width={size === "small" ? "100%" : "50%"} height="350px">
        <AssetValueAreaChart />
      </Box>
      <Box width={size === "small" ? "100%" : "50%"} height="350px">
        <OriginationsChart />
      </Box>
      <Box width={size === "small" ? "100%" : "50%"} height="350px">
        <UserChart/>
      </Box>
    </Box>
  );
};

export const Home = () => {
  return (
    <Container pad={{ top: "medium", bottom: "large" }} gap="large">
      <PageHeader />
      <DataContainer>
        <Box gap="large">
          <Charts />
          <TotalNumbers />
          <PoolList />
        </Box>
      </DataContainer>
      <Box alignSelf="stretch" align="center">
        <Anchor href="https://tinlake.centrifuge.io/" target="_blank">
          tinlake.centrifuge.io
        </Anchor>
      </Box>
    </Container>
  );
};
