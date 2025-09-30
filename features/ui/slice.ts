import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type DisplaySize = 'normal' | 'large'

interface UIState {
  displaySize: DisplaySize
}

const initialState: UIState = {
  displaySize: 'normal',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDisplaySize(state, action: PayloadAction<DisplaySize>) {
      state.displaySize = action.payload
    },
  },
})

export const { setDisplaySize } = uiSlice.actions
export default uiSlice.reducer