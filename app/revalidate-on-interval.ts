import {
  useCallback,
  useEffect,
} from 'react';

import { useNavigate } from '@remix-run/react';

export interface Options {
  enabled?: boolean;
  interval?: number;
}

export function useRevalidateOnInterval({ enabled = false, interval = 1000 }: Options) {
  let revalidate = useRevalidate();
  useEffect(function revalidateOnInterval() {
    if (!enabled) return;
    let intervalId = setInterval(revalidate, interval);
    return () => clearInterval(intervalId);
  }, [revalidate]);
}

function useRevalidate() {
  let navigate = useNavigate();
  return useCallback(function revalidate() {
    navigate('.', { replace: true });
  }, [navigate]);
}