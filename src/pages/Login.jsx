import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth } from '../redux/slices/auth'
import { Navigate } from "react-router-dom";
import { selectIsAuth } from "../redux/slices/auth";
const Login = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "",
      password: "",
    },
    mode: "onChange",
  });
  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));
    if (!data.payload) {
      return alert("Не удалось авторизоваться");
    }
    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };
  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("fullName")} />
      <br />
      <br />
      <input {...register("password", { required: true })} />
      <br />
      <br />
      <input type="submit" />
    </form>
  );
};

export default Login;
