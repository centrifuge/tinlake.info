import React from 'react'
import { useStoreState } from 'easy-peasy'
import { formatDAI } from '../format'

import mainnetPools from '@centrifuge/tinlake-pools-mainnet'
function loadPoolMeta(key) {
  return mainnetPools.find((pool) => pool.metadata.shortName === key);
}


const Pool = (props) => {
  let pool = props.pool
  let meta = loadPoolMeta(pool.name)

  if (!meta) {
      return null;
  }
  let poolVersionLabel = meta.version === 2 ? '' : (<span className="v3-label">V3</span>);

  let icon = (<div className="pool-icon-empty"></div>);
  if (meta.metadata.media.logo) {
    icon = (<img className="pool-icon" src={meta.metadata.media.logo} alt="" />)
  }
  return (<tr className="pool-item">
      <td>{icon}</td>
      <td>{pool.name}{poolVersionLabel}</td>
      <td>{formatDAI(pool.poolSize)}</td>
      <td>{formatDAI(pool.totalOriginated)}</td>
    </tr>)
}

const sortPools = (pools) => {
  let sortedPools = Object.values(pools)
  sortedPools.sort((a, b) => {
      return b.poolSize.minus(a.poolSize)
  })
  return sortedPools
}


export const PoolList = () => {
  const pools = useStoreState((state) => state.pools)
  let sortedPools = sortPools(pools)

  return (
      <div className="pool-list">
      <h2>Pools</h2>
      <table>
        <tr>
          <th className="icon"></th>
          <th>Pool</th>
          <th>Pool Value</th>
          <th>Originated</th>
        </tr>
      { sortedPools.map((p) => {
        return (
          <Pool pool={p} />
        )}
      )}
      </table>
    </div>
  )
}

