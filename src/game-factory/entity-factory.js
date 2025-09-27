import Piece from './piece/piece.ts'
import { registry } from './registry.js'

export default function makeEntityFactory (definition) {
  let id = 0
  return () => new (registry[definition.type || 'Entity'])(definition, id++)
}
