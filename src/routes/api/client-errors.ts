import { receiveClientError } from '~/features/client-error-reporting/client-error-reporting.server'

export async function POST({ request }: { request: Request }) {
  'use server'

  return receiveClientError(request)
}
