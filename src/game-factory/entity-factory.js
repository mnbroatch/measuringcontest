import Piece from './piece/piece.ts'
import { registry } from './registry.js'

export default function entityFactory (definition) {
  const Entity = registry[definition.type] || Piece
  return new Entity(definition)
}
