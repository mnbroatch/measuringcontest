import matches from 'lodash/matches.js'
import resolveProperties from '../utils/resolve-properties.js'
import isPlainObject from "lodash/isPlainObject.js";

export default function entityMatches (bgioArguments, target, context) {
  return isPlainObject(target)
    ? bgioArguments.G.bank.find(bgioArguments, target, context)
    : target
}
