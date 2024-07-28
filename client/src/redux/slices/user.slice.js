import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    changePoints: (state, action) => {
      if (state.user) {
        state.user.points = action.payload;
      }
    },
  },
});

export const { setUser, changePoints } = userSlice.actions;
export default userSlice.reducer;
