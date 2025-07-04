const USER_POOL_CLIENT_ID = "lmckmqd7bndat4ot0ajl7u2uk"
const USER_POOL_ID = "us-west-1_G8hKy1gmb"
const AUTH_DOMAIN = "auth.measuringcontest.com"
const AUTH_SCOPES = ["openid", "email", "profile"]
const COGNITO_RESPONSE_TYPE = 'code'
const AWS_REGION = 'us-west-1'

export const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: USER_POOL_ID,
      userPoolClientId: USER_POOL_CLIENT_ID ,
      loginWith: {
        oauth: {
          domain: AUTH_DOMAIN,
          scopes: AUTH_SCOPES,
          redirectSignIn: [window.origin],
          redirectSignOut: [window.origin],
          responseType: COGNITO_RESPONSE_TYPE
        }
      }
    }
  }
};
