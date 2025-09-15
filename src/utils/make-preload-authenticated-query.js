import { getAuth } from "../../auth.js";
import preloadQuery from "./preload-query.js";
import { useCognitoQuery } from '../queries/use-cognito-query.js';

// getOptions function must have first param of idToken
export default function makePreloadAuthenticatedQuery (getOptions) {
  return async function () {
    const idToken = (await useCognitoQuery.preload())?.idToken
    return idToken ? preloadQuery(getOptions(idToken, ...arguments)) : null
  }
}


