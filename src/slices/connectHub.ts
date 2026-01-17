import { createSlice } from '@reduxjs/toolkit';

export interface ConnectHubState {
  isConnected: boolean;
}

const initialState: ConnectHubState = {
  isConnected: false,
};

const connectHubSlice = createSlice({
  name: 'connectHub',
  initialState,
  reducers: {
    setIsConnected: (state, { payload }) => {
      state.isConnected = payload;
    },
  },
});

export const { setIsConnected } = connectHubSlice.actions;

export const connectHubReducer = connectHubSlice.reducer;


