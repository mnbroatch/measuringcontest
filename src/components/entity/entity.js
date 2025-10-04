import React from 'react'
import Grid from '../board/grid.js'

export default function Entity ({ entity }) {
  switch (entity.rule.type) {
    case 'Grid':
      return <Grid entity={entity} />
  }
}
