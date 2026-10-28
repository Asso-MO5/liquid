const REPORT_ENDPOINT = '/api/client-errors'
const MAX_REPORTS_PER_PAGE = 5
const MAX_MESSAGE_LENGTH = 1_000
const MAX_STACK_LENGTH = 3_000

type ClientErrorType = 'error' | 'unhandledrejection'

type ClientErrorReport = {
  type: ClientErrorType
  message: string
  page: string
  stack?: string
}

let reportCount = 0

function truncate(value: string, maximumLength: number) {
  return value.length > maximumLength ? `${value.slice(0, maximumLength - 1)}…` : value
}

function errorMessage(reason: unknown) {
  if (reason instanceof Error && reason.message) return reason.message
  if (typeof reason === 'string' && reason) return reason
  return 'Erreur JavaScript sans message'
}

function errorStack(reason: unknown) {
  return reason instanceof Error && reason.stack ? reason.stack : undefined
}

function currentPage() {
  return window.location.pathname || '/'
}

function send(report: ClientErrorReport) {
  if (!import.meta.env.PROD || reportCount >= MAX_REPORTS_PER_PAGE) return

  reportCount += 1

  try {
    void fetch(REPORT_ENDPOINT, {
      body: JSON.stringify(report),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      method: 'POST',
    }).catch(() => undefined)
  } catch {
    // La collecte ne doit jamais déclencher une seconde erreur côté navigateur.
  }
}

export function installClientErrorReporting() {
  window.addEventListener('error', (event) => {
    send({
      message: truncate(event.message || errorMessage(event.error), MAX_MESSAGE_LENGTH),
      page: currentPage(),
      stack: event.error
        ? truncate(errorStack(event.error) ?? '', MAX_STACK_LENGTH) || undefined
        : undefined,
      type: 'error',
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    send({
      message: truncate(errorMessage(event.reason), MAX_MESSAGE_LENGTH),
      page: currentPage(),
      stack: errorStack(event.reason)
        ? truncate(errorStack(event.reason) ?? '', MAX_STACK_LENGTH)
        : undefined,
      type: 'unhandledrejection',
    })
  })
}
