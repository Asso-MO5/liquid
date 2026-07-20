import type { JSX } from 'solid-js/jsx-runtime'
import { featureFlag } from './feature-flag.const'
import type { FeatureFlagType } from './feature-flag.type'

type FeatureFlagProps = {
  name: FeatureFlagType
  children: JSX.Element
}

export const FeatureFlag = ({ name, children }: FeatureFlagProps) => {
  if (featureFlag[name]) return null
  return children
}
