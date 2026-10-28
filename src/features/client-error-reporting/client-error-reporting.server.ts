import { z } from 'zod'

const MAX_BODY_BYTES = 8 * 1024
const MAX_MESSAGE_LENGTH = 1_000
const MAX_PAGE_LENGTH = 2_000
const MAX_STACK_LENGTH = 3_000

const clientErrorReportSchema = z
  .object({
    message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
    page: z.string().startsWith('/').max(MAX_PAGE_LENGTH),
    stack: z.string().max(MAX_STACK_LENGTH).optional(),
    type: z.enum(['error', 'unhandledrejection']),
  })
  .strict()

export type ClientErrorReport = z.infer<typeof clientErrorReportSchema>

function redactSensitiveContent(value: string) {
  return value
    .replace(/\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, '[redacted-email]')
    .replace(
      /\b(bearer|authorization|token|api[_-]?key|password|secret)\s*[:=]\s*[^,\s"']+/gi,
      '$1=[redacted]',
    )
    .replace(/(https?:\/\/[^\s)\]]+)\?[^\s)\]]*/g, '$1?[redacted]')
}

function isJsonRequest(request: Request) {
  return request.headers.get('content-type')?.toLowerCase().startsWith('application/json')
}

function emptyResponse(status: number) {
  return new Response(null, { status })
}

export function parseClientErrorReport(body: string) {
  if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) return null

  try {
    return clientErrorReportSchema.safeParse(JSON.parse(body))
  } catch {
    return null
  }
}

export async function receiveClientError(request: Request) {
  if (!isJsonRequest(request)) return emptyResponse(415)

  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return emptyResponse(413)

  const body = await request.text()
  if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) return emptyResponse(413)

  const report = parseClientErrorReport(body)
  if (!report?.success) return emptyResponse(400)

  const message = redactSensitiveContent(report.data.message)
  const page = redactSensitiveContent(report.data.page)
  const stack = report.data.stack ? redactSensitiveContent(report.data.stack) : undefined
  const userAgent = redactSensitiveContent((request.headers.get('user-agent') ?? '').slice(0, 300))

  console.error(
    `[front-error] type=${report.data.type} message=${JSON.stringify(message)} page=${JSON.stringify(page)} user_agent=${JSON.stringify(userAgent)}${stack ? ` stack=${JSON.stringify(stack)}` : ''}`,
  )

  return emptyResponse(204)
}
