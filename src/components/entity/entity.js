import React from 'react'
import { useGame } from "../../contexts/game-context.js";
import Grid from '../board/grid.js'
import Space from "../space/space.js";

export default function Entity ({ entity }) {
  const { allClickable } = useGame()
  const isClickable = allClickable.has(entity)
  switch (entity.rule.type) {
    case 'Grid':
      return <Grid grid={entity} isClickable={isClickable} />
    case 'Space':
      return <Space space={entity} isClickable={isClickable} />
    default:
      return <div
        className={[
          'entity',
          entity.rule.player && `player-${entity.rule.player}`,
          allClickable.has(entity) && 'space--clickable'
        ].filter(Boolean).join(' ')}
      ></div>
  }
}
