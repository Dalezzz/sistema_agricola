import { httpBatchLink } from '@trpc/client';
import { trpc } from './react';

export function createTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/api/trpc',
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          });
        },
      }),
    ],
  });
}
