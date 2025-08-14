import React from 'react'
import { Amplify } from 'aws-amplify';
import { cognitoConfig } from "./src/constants/auth.js";
import { CognitoAuthProvider } from "./src/contexts/cognito-auth-context.js";
import AppShell from "./src/app-shell.js";
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'

Amplify.configure(cognitoConfig);
const queryClient = new QueryClient()

export default function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <CognitoAuthProvider>
        <AppShell />
      </CognitoAuthProvider>
    </QueryClientProvider>
  )
}
