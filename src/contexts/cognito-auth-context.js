import React, { createContext, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signInWithRedirect, signOut } from '@aws-amplify/auth';
import { useCognitoTokenQuery } from '../queries/use-cognito-token-query.js';

const AuthContext = createContext({
  idToken: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function CognitoAuthProvider({ children }) {
  const queryClient = useQueryClient();
  const { data: idToken, isLoading } = useCognitoTokenQuery();
  const { mutateAsync: login } = useMutation({ mutationFn: signInWithRedirect });
  const { mutateAsync: logout } = useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.clear(),
  });

  return (
    <AuthContext.Provider value={{ idToken, loading: isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useCognitoAuth = () => useContext(AuthContext);
