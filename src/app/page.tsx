// Force rebuild - cache bypass
import { getLatestResult } from '@/lib/supabase';
import HomeContent from '@/components/HomeContent';

export default async function Home() {
  let latestResult = null;
  let databaseError = false;
  
  try {
    latestResult = await getLatestResult();
  } catch (error) {
    console.error('Failed to fetch latest result:', error);
    databaseError = true;
  }

  return <HomeContent latestResult={latestResult} databaseError={databaseError} />;
}
