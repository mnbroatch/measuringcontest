import { getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';

export async function getAuth() {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { userId } = user
    const session = await fetchAuthSession();
    const idToken = session?.tokens?.idToken?.toString() 
    return idToken ? {
      userId,
      idToken
    } : null;
  } catch {
    return null;
  }
}
