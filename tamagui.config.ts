import { config } from '@tamagui/config/v2'
import { createTamagui } from 'tamagui'

export const tamaguiConfig = createTamagui(config)

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}