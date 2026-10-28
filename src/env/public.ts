const publicEnvKeys = [
  'VITE_API_URL',
  'VITE_BLOG_URL',
  'VITE_CAVE_URL',
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'VITE_KITANA_URL',
  'FEAT_RESERVATION',
  'FEAT_BREAK_MESSAGE',
] as const

export type PublicEnv = Partial<Record<(typeof publicEnvKeys)[number], string>>

export const getPublicEnv = (environment: NodeJS.ProcessEnv): PublicEnv =>
  Object.fromEntries(
    publicEnvKeys.flatMap((key) => {
      const value = environment[key]
      return value === undefined ? [] : [[key, value]]
    }),
  ) as PublicEnv

export const serializePublicEnv = (environment: NodeJS.ProcessEnv): string =>
  JSON.stringify(getPublicEnv(environment))
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029')
