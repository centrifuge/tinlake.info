import React from 'react'
import { useStoreState } from 'easy-peasy'
import { formatDAI } from '../format'



export const TotalNumbers = () => {
  const totalOriginated = useStoreState((state) => state.totalOriginated)
  const totalLoans = useStoreState((state) => state.totalLoans)
  const totalValueLocked = useStoreState((state) => state.totalValueLocked)

  return (
    <div className="totals">
      <div class="total-number">
        <h2>Total Value Locked</h2>
        <span>{formatDAI(totalValueLocked)}</span>
      </div>
      <div class="total-number">
        <h2>Total Originated</h2>
        <span>{formatDAI(totalOriginated)}</span>
      </div>
      <div class="total-number">
        <h2>Total Loans</h2>
        <span>{totalLoans}</span>
      </div>
      <p>Total values are across Tinlake v2 & Tinlake v3. Asset Value and Reserve Graph only includes v3 pools.</p>
    </div>
  )
}

