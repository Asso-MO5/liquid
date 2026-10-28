import type { ZodFormattedError } from 'zod'
import type { PublicEnv } from './public'
import { clientScheme } from './schema'

declare global {
  interface Window {
    __MO5_PUBLIC_ENV__?: PublicEnv
  }
}

export const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>): string[] => {
  const result: string[] = []
  for (const [name, value] of Object.entries(errors)) {
    if (value && '_errors' in value) {
      result.push(`${name}: ${value._errors.join(', ')}\n`)
    }
  }
  return result
}

const runtimeEnv = typeof window === 'undefined' ? process.env : window.__MO5_PUBLIC_ENV__
const env = clientScheme.safeParse({ ...import.meta.env, ...runtimeEnv })

if (env.success === false) {
  console.error('❌ Invalid environment variables:\n', ...formatErrors(env.error.format()))
  throw new Error('Invalid environment variables')
}

export const clientEnv = env.data
