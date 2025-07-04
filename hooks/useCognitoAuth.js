import { useState, useEffect, useCallback } from "react";
import { CognitoAuth } from "amazon-cognito-auth-js";

export default function useCognitoAuth(authData, storage = localStorage) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authInstance = new CognitoAuth(authData);

    authInstance.userhandler = {
      onSuccess: function (result) {
        setLoading(false);
        console.log("Login success!", result);
      },
      onFailure: function (err) {
        console.error("Login error", err);
        setLoading(false);
      },
    };

    setAuth(authInstance);

    if (window.location.href.includes("#id_token")) {
      // we are coming from Managed Login redirect
      authInstance.parseCognitoWebResponse(window.location.href);
    } else {
      setLoading(false);
    }
  }, []);

  const login = () => {
    auth?.getSession(); // Triggers redirect to Managed Login
  }

  const logout = () => {
    auth?.signOut();
  }

  const session = auth?.getSignInUserSession();
  const idToken = session?.isValid() ? session.getIdToken().getJwtToken() : null;

  const getIdToken = () => {
    const session = auth?.getSignInUserSession();
    return (session?.isValid() && session.getIdToken().getJwtToken()) || null
  }

  return {
    getIdToken,
    login,
    logout,
    loading,
  };
}
