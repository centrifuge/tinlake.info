import React from "react";

import {
  Box,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  Text,
} from "grommet";
import { useStoreState } from "easy-peasy";
import { formatValue } from "../format";

import mainnetPools from "@centrifuge/tinlake-pools-mainnet";

function loadPoolMeta(key) {
  return mainnetPools.find((pool) => pool.metadata.shortName === key);
}

const Pool = (props) => {
  let pool = props.pool;
  let meta = loadPoolMeta(pool.name);

  if (!meta) {
    return null;
  }
  let poolVersionLabel =
    meta.version === 2 ? "" : <span className="v3-label">V3</span>;

  let icon = <div className="pool-icon-empty"></div>;
  if (meta.metadata.media.logo) {
    icon = <img className="pool-icon" src={meta.metadata.media.icon} alt="" />;
  }

  return (
    <TableRow>
      <TableCell>
        <Box direction="row" gap="medium" align="center">
          {icon}
          <Box direction="row" gap="xsmall" align="baseline" flex="grow">
            {pool.name}
            {poolVersionLabel}
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Box flex="grow">{formatValue(pool.poolSize)}</Box>
      </TableCell>
      <TableCell>{formatValue(pool.totalOriginated)}</TableCell>
    </TableRow>
  );
};

const sortPools = (pools) => {
  let sortedPools = Object.values(pools);
  sortedPools.sort((a, b) => {
    return b.poolSize.minus(a.poolSize);
  });
  return sortedPools;
};

export const PoolList = () => {
  const pools = useStoreState((state) => state.pools);
  let sortedPools = sortPools(pools);

  return (
    <Box gap="small">
      <Text size="large" weight={500}>
        Pools
      </Text>
      <Box width="100%" overflow="auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>
                <Text size="small" weight="bold" color="dark-6">
                  Pool
                </Text>
              </TableCell>
              <TableCell>
                <Text size="small" weight="bold" color="dark-6">
                  Pool Value
                </Text>
              </TableCell>
              <TableCell>
                <Text size="small" weight="bold" color="dark-6">
                  Originated
                </Text>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPools.map((pool) => (
              <Pool pool={pool} />
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};
