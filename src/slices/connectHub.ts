import { createSlice } from '@reduxjs/toolkit';

export interface connHubState {
  isconned: boolean;
}

const initialState: connHubState = {
  isconned: false,
};

const connHubSlice = createSlice({
  name: 'connHub',
  initialState,
  reducers: {
    setIsconned: (state, { payload }) => {
      state.isconned = payload;
    },
  },
});

export const { setIsconned } = connHubSlice.actions;

export const connHubReducer = connHubSlice.reducer;


