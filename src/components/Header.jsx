import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../redux/slices/auth";
import { NavLink } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/HomeRounded';
import CreateIcon from '@mui/icons-material/AddCircleOutlineRounded';
import GroupsIcon from '@mui/icons-material/Groups2Rounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import LoginIcon from '@mui/icons-material/LoginRounded';

const theme = createTheme({
  palette: {
    main: {
      main: '#4169E1',
      contrastText: '#fff',
    },
  },
});

export default function Header() {
  const userData = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const onClickLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
  };

  return (
    <ThemeProvider theme={theme}>
      <header>
        <img src="img/logo.png" alt="" className="logo" />

        <nav>
          <NavLink to="/">
            <Button variant="contained" color='main'>Главная</Button>
          </NavLink>

          {userData?.teacher && (
            <>
              <NavLink to="/create">
                <Button variant="contained" color='main'> Создать </Button>
              </NavLink>
              <NavLink to="/teachers">
                <Button variant="contained" color='main'> Преподователи </Button>
              </NavLink>
            </>
          )}

          {isAuth ? (
            <Button variant="contained" color='main'
              onClick={onClickLogout}
            >
              Выйти
            </Button>
          ) : (
            <>
              <NavLink to="/login">
                <Button variant="contained" color='main'> Войти </Button>
              </NavLink>
              <NavLink to="/register">
                <Button variant="contained" color='main'> Регестрация </Button>
              </NavLink>
            </>
          )}
        </nav>
      </header>
    </ThemeProvider>
  );
}
