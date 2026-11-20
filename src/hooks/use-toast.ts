import { useEffect, useState } from 'react';

const TOAST_DURATION_MS = 2500;

/** Short message that hides itself. Returns [message, show]. */
export default function useToast(): [string, (message: string) => void] {
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [message]);
  return [message, setMessage];
}
