import Entity from './entity.js'
import { registry } from './registry.js'

export default function makeEntityFactory () {
  let id = 0
  return (definition) => new (registry[definition.type || 'Entity'])(definition, id++)
}
