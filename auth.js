import { getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';

export async function getIdToken() {
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    const session = await fetchAuthSession();
    return session?.tokens?.idToken?.toString() ?? null;
  } catch {
    return null;
  }
}
