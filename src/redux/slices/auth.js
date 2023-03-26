import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios'
export const fetchAuth = createAsyncThunk('/fetchAuth', async (params) => {
    const { data } = await axios.post('/login', params)
    return data;
})

export const fetchAuthMe = createAsyncThunk('/fetchAuthMe', async () => {
    const { data } = await axios.get('/me')
    return data;
})

export const fetchRegister = createAsyncThunk('/fetchRegister', async (params) => {
    const { data } = await axios.post('/register', params)
    return data;
})


const initialState = {
    data: null,
    status: 'loading'
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.status = "loaded"
        }
    },
    extraReducers: {
        [fetchAuth.pending]: (state) => {
            state.status = 'loading'
            state.data = null;
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.status = 'loaded'
            state.data = action.payload;
        },
        [fetchAuth.rejected]: (state) => {
            state.status = 'error'
            state.data = null;
        }
        ,



        [fetchAuthMe.pending]: (state) => {
            state.status = 'loading'
            state.data = null;
        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.status = 'loaded'
            state.data = action.payload;
        },
        [fetchAuthMe.rejected]: (state) => {
            state.status = 'error'
            state.data = null;
        },



        [fetchRegister.pending]: (state) => {
            state.status = 'loading'
            state.data = null;
        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.status = 'loaded'
            state.data = action.payload;
        },
        [fetchRegister.rejected]: (state) => {
            state.status = 'error'
            state.data = null;
        }


    }
})


export const selectIsAuth = (state) => Boolean(state.auth.data)

export const authReducer = authSlice.reducer

export const { logout } = authSlice.actions