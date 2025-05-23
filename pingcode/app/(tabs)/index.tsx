import { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Any initialization logic can go here
  }, []);

  return <Redirect href="/onboarding/welcome" />;
}