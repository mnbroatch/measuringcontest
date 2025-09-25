import { registry } from './registry.js'

export default function entityFactory (definition) {
  return new registry[definition.type](definition)
}
