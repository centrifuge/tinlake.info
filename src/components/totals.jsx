import React, { useContext } from "react";

import { Box, ResponsiveContext, Text } from "grommet";
import { useStoreState } from "easy-peasy";
import { formatValue } from "../format";

const TotalCard = ({ name, value }) => (
  <Box
    pad="medium"
    elevation="xsmall"
    round="xsmall"
    align="center"
    gap="small"
    width="100%"
  >
    <Text size="small" weight="bold" color="dark-6">
      {name}
    </Text>
    <Text size="xlarge">{value}</Text>
  </Box>
);

export const TotalNumbers = () => {
  const size = useContext(ResponsiveContext);

  const totalOriginated = useStoreState((state) => state.totalOriginated);
  const totalLoans = useStoreState((state) => state.totalLoans);
  const totalValueLocked = useStoreState((state) => state.totalValueLocked);

  return (
    <Box direction={size === "small" ? "column" : "row"} gap="medium">
      <TotalCard
        name="Total Value Locked"
        value={formatValue(totalValueLocked)}
      />
      <TotalCard name="Total Originated" value={formatValue(totalOriginated)} />
      <TotalCard name="Total Loans" value={totalLoans} />
    </Box>
  );
};
