import "./App.css";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Main from "./pages/MainPage";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";
import FullTimeTable from './pages/FullTimeTable'
import Create from "./pages/Create";
import Register from './pages/Register'
import Profile from "./pages/Profile";
import Teachers from './pages/Teachers'
import Groups from "./pages/Groups";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    main: {
      main: '#4169E1',
      contrastText: '#fff',
    },
  },
});

function App() {
  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);
  const dispatch = useDispatch();
  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/create" element={<Create />} />
          <Route path="/:id" element={<FullTimeTable />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
