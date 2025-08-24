import React, { createContext, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signInWithRedirect, signOut } from '@aws-amplify/auth';
import { useCognitoQuery } from '../queries/use-cognito-query.js';

const AuthContext = createContext({
  idToken: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function CognitoAuthProvider({ children }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCognitoQuery();
  const idToken = data?.idToken
  const userId = data?.userId
  const { mutateAsync: login } = useMutation({ mutationFn: signInWithRedirect });
  const { mutateAsync: logout } = useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.clear(),
  });

  return (
    <AuthContext.Provider value={{ idToken, userId, loading: isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useCognitoAuth = () => useContext(AuthContext);
