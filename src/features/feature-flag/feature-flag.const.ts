import { clientEnv } from '~/env/client'

export const featureFlag = {
  reservation: clientEnv.FEAT_RESERVATION,
  breakMessage: clientEnv.FEAT_BREAK_MESSAGE,
}
