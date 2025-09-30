import type { RootState } from '../../store'
import type { DisplaySize } from './slice'

export const selectDisplaySize = (state: RootState): DisplaySize => state.ui.displaySize

export const selectDisplayScale = (state: RootState): number => {
  const size = state.ui.displaySize
  return size === 'large' ? 1.3 : 1.0
}