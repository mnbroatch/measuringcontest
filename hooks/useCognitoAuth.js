import { useState, useEffect } from "react";
import { signInWithRedirect, signOut, getCurrentUser, fetchAuthSession, fetchUserAttributes } from '@aws-amplify/auth';

export default function useCognitoAuth() {
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

  return {
    getIdToken,
    getUserId,
    login,
    logout,
    loading,
    isAuthenticated,
  };
}
