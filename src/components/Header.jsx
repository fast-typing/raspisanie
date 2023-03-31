import React from "react";
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

      <nav>
        <NavLink to="/">
          <button>Главная</button>
        </NavLink>
        {userData?.admin && (
          <>
            <NavLink to="/create">
              <button>Создать</button>
            </NavLink>
            <NavLink to="/teachers">
              <button>Преподователи</button>
            </NavLink>
            <NavLink to="/groups">
              <button>Группы</button>
            </NavLink>
          </>
        )}

        {isAuth ? (
          <>
            <NavLink to="/profile">
              <button>Профиль</button>
            </NavLink>
            <button onClick={onClickLogout}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">
              <button>
                Войти
              </button>
            </NavLink>
            <NavLink to="/register">
              <button>
                Регистрация
              </button>
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
