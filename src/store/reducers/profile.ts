import { createSlice } from '@reduxjs/toolkit';

export interface ProfileState {
  profile: any;
}

const initialState: ProfileState = {
  profile: undefined,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state: any, { payload }: any) => {
      state.profile = payload;
    },
  },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
