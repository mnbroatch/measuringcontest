import isPlainObject from "lodash/isPlainObject.js";

const abstractEntityNames = ['state']

export default function resolveEntity (bgioArguments, target, context, name) {
  return !abstractEntityNames.includes(name) && isPlainObject(target)
    ? bgioArguments.G.bank.find(bgioArguments, target, context)
    : target
}
