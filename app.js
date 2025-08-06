import React from 'react'
import { Amplify } from 'aws-amplify';
import { cognitoConfig } from "./constants/auth.js";
import { CognitoAuthProvider } from "./contexts/cognito-auth-context.js";
import CreateSessionPage from "./pages/create-session-page.js";
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'

Amplify.configure(cognitoConfig);
const queryClient = new QueryClient()

export default function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <CognitoAuthProvider>
        <CreateSessionPage />
      </CognitoAuthProvider>
    </QueryClientProvider>
  )
}
