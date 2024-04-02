import { configureStore } from '@reduxjs/toolkit';

import { authSlice } from '@app/store/reducers/auth';
import { uiSlice } from '@app/store/reducers/ui';
import { createLogger } from 'redux-logger';
import { profileSlice } from './reducers/profile';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    profile: profileSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createLogger()) as any,
});

export default store;
