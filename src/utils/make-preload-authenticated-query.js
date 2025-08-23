import { getAuth } from "../../auth.js";
import preloadQuery from "./preload-query.js";

// getOptions function must have first param of idToken
export default function makePreloadAuthenticatedQuery (getOptions) {
  return async function () {
    const idToken = (await getAuth()).idToken
    return idToken ? preloadQuery(getOptions(idToken, ...arguments)) : null
  }
}
