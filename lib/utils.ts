import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Debounce a function call by a given delay.
 */
export function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) {
  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function')
  }

  if (typeof delay !== 'number' || delay < 0) {
    throw new Error('Delay must be a positive number')
  }

  let timeoutId: NodeJS.Timeout | null = null

  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      callback(...args)
      timeoutId = null
    }, delay)
  }
}

// See https://github.com/vercel/next.js/blob/dafcd43/packages/next/src/client/components/not-found.ts#L21
const NEXT_NOT_FOUND_ERR_MSG = 'NEXT_HTTP_ERROR_FALLBACK;404'

export function isNextNotFoundError(error: unknown) {
  return error instanceof Error && error.message === NEXT_NOT_FOUND_ERR_MSG
}
