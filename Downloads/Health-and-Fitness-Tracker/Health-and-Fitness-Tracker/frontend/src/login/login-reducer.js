import React from "react";
import { createSlice } from '@reduxjs/toolkit'


const loginData = {
    isLoggedIn: false,
    userName: "",
    email: "",
    type: "",
}

const loginSlice = createSlice({
    name: 'login',
    initialState: loginData,
    reducers: {
        alterLoginState(state, action)
        {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.userName = action.payload.userName;
            state.email = action.payload.email;
            state.type = action.payload.type;
        }
    }
});

export const {alterLoginState} = loginSlice.actions
export default loginSlice.reducer