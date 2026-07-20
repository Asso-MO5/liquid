import type { ZodFormattedError } from 'zod'
import { clientScheme } from './schema'

export const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>): string[] => {
  const result: string[] = []
  for (const [name, value] of Object.entries(errors)) {
    if (value && '_errors' in value) {
      result.push(`${name}: ${value._errors.join(', ')}\n`)
    }
  }
  return result
}

const env = clientScheme.safeParse(import.meta.env)

if (env.success === false) {
  console.error('❌ Invalid environment variables:\n', ...formatErrors(env.error.format()))
  throw new Error('Invalid environment variables')
}

export const clientEnv = env.data
