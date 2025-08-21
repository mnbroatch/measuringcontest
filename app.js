import React from 'react'
import { Amplify } from 'aws-amplify';
import { cognitoConfig } from "./src/constants/auth.js";
import { CognitoAuthProvider } from "./src/contexts/cognito-auth-context.js";
import AppShell from "./src/app-shell.js";
import { QueryClientProvider, } from '@tanstack/react-query'
import queryClient from './query-client.js'

Amplify.configure(cognitoConfig);

export default function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <CognitoAuthProvider>
        <AppShell />
      </CognitoAuthProvider>
    </QueryClientProvider>
  )
}
