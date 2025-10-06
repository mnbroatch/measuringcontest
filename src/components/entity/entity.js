import React from 'react'
import { useGame } from "../../contexts/game-context.js";
import Grid from '../board/grid.js'
import Space from "../space/space.js";

export default function Entity ({ entity }) {
  const { currentMove } = useGame()
  const isClickable = currentMove.clickable.includes(entity)
  switch (entity.rule.type) {
    case 'Grid':
      return <Grid grid={entity} isClickable={isClickable} />
    case 'Space':
      return <Space space={entity} isClickable={isClickable} />
  }
}
