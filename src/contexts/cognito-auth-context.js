import React, { createContext, useContext, useMemo } from 'react';
import {
  signInWithRedirect,
  signOut,
  getCurrentUser,
  fetchAuthSession
} from '@aws-amplify/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CognitoAuthContext = createContext();

const AUTH_QUERY_KEY = 'auth';
const AUTH_SESSION_KEY = 'authSession';

export function CognitoAuthProvider({ children }) {
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading: currentUserLoading } = useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: async () => {
      try {
        return await getCurrentUser();
      } catch (error) {
        if (error.name !== 'UserUnAuthenticatedException') {
          console.error(error);
        }
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const isAuthenticated = !!currentUser

  const { data: authSession, isLoading: authSessionLoading } = useQuery({
    queryKey: [AUTH_SESSION_KEY],
    queryFn: fetchAuthSession,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 55,
    refetchInterval: 1000 * 60 * 55,
    refetchOnWindowFocus: true,
  });

  const { mutateAsync: login, isLoading: signInLoading } = useMutation({
    mutationFn: signInWithRedirect,
  });

  const { mutateAsync: logout, isLoading: signOutLoading } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear()
    },
  });

  const idToken = authSession?.tokens?.idToken?.toString() ?? null
  const userId = useMemo(() => {
    if (!idToken) return null;
    try {
      return JSON.parse(atob(idToken.split('.')[1])).sub;
    } catch {
      return null;
    }
  }, [idToken]);

  return (
    <CognitoAuthContext.Provider
      value={{
        isAuthenticated,
        loading: authSessionLoading || currentUserLoading || signOutLoading || signInLoading,
        login,
        logout,
        idToken,
        userId
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

