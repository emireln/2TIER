import React from 'react'
import { useTierStore } from '../store/useTierStore'
import { TierRow } from './TierRow'

export const TierBoard: React.FC = () => {
  const { rows } = useTierStore()

  return (
    <div className="w-full space-y-3.5">
      {rows.map((row, index) => (
        <TierRow key={row.id} row={row} index={index} totalRows={rows.length} />
      ))}
    </div>
  )
}
