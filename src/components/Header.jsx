import React from "react";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../redux/slices/auth";
import { NavLink } from "react-router-dom";

export default function Header() {
  const userData = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const onClickLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
  };

  return (
    <header>
      <img src="img/logo.png" alt="" className="logo" />
      <NavLink to="/">
        <Button variant="contained">Главная</Button>
      </NavLink>
      {userData?.teacher && (
        <NavLink to="/create">
          <Button variant="contained">Создать</Button>
        </NavLink>
      )}

      {isAuth ? (
        <Button
          variant="contained"
          endIcon={<LoginIcon />}
          onClick={onClickLogout}
        >
          Выйти
        </Button>
      ) : (
        <>
          <NavLink to="/login">
            <Button variant="contained" endIcon={<LoginIcon />}>
              Войти
            </Button>
          </NavLink>
          <NavLink to="/register">
            <Button variant="contained" endIcon={<LoginIcon />}>
              Регестрация
            </Button>
          </NavLink>
        </>
      )}
    </header>
  );
}
