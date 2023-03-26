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
function App() {
  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);
  const dispatch = useDispatch();
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<FullTimeTable />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
