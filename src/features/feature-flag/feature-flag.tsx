import type { JSX } from 'solid-js/jsx-runtime'
import { featureFlag } from './feature-flag.const'
import type { FeatureFlagType } from './feature-flag.type'

type FeatureFlagProps = {
  name: FeatureFlagType
  children: JSX.Element
}

export const FeatureFlag = (props: FeatureFlagProps) => {
  if (!featureFlag[props?.name]) return null
  return props.children
}
