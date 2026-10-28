import { mount, StartClient } from '@solidjs/start/client'
import { installClientErrorReporting } from '~/features/client-error-reporting/client-error-reporting.client'

if (typeof window !== 'undefined') {
  installClientErrorReporting()
}

mount(() => <StartClient />, document.getElementById('app') ?? document.body)

export default {}
