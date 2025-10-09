import { serialize } from "wackson";

// todo: remember why reducing to id was preferred?
export default function preparePayload (payload) {
  const payloadCopy = { ...payload }
  payloadCopy.arguments =
    Object.entries(payloadCopy.arguments).reduce((acc, [key, argument]) => ({
      ...acc,
      [key]: argument.entityId
    }), {})
  return JSON.parse(serialize(payloadCopy, { deduplicateInstances: false }))
}
