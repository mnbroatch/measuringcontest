import { useState, useEffect } from "react";
import { signInWithRedirect, handleRedirect, signOut, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';

export default function useCognitoAuth() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  const checkAuth = async () => {
    try {
      console.log('Calling getCurrentUser...');
      const user = await getCurrentUser();
      console.log('? getCurrentUser succeeded:', user);
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
      return null;
    }
  };

  console.log('getCurrentUser', getCurrentUser)

  return {
    getIdToken,
    login,
    logout,
    loading,
    isAuthenticated,
  };
}
