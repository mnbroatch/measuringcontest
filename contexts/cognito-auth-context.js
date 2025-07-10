import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithRedirect,
  signOut,
  getCurrentUser,
  fetchAuthSession
} from '@aws-amplify/auth';

const CognitoAuthContext = createContext();

export function CognitoAuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('? getCurrentUser failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    await signInWithRedirect(); // This will redirect to the hosted UI
  };

  const logout = async () => {
    await signOut();
    setIsAuthenticated(false);
  };

  const getIdToken = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      return tokens.idToken.toString();
    } catch (error) {
      console.log('error getting id token:');
      console.error(error);
      return null;
    }
  };

  const getUserId = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const payload = JSON.parse(atob(tokens.idToken.toString().split('.')[1]));
      return payload.sub;
    } catch (error) {
      console.log('error getting user id:');
      console.error(error);
      return null;
    }
  };

  return (
    <CognitoAuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        getIdToken,
        getUserId
      }}
    >
      {children}
    </CognitoAuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useCognitoAuth() {
  return useContext(CognitoAuthContext);
}
