import isPlainObject from "lodash/isPlainObject.js";

const abstractTargetNames = ['state']

export default function resolveEntity (bgioArguments, target, context, targetName) {
  if (typeof target === 'string') {
    console.log('55target', target)
  }
  return !abstractTargetNames.includes(targetName) && isPlainObject(target)
    ? bgioArguments.G.bank.find(bgioArguments, target, context)
    : target
}
