import React, { useEffect, useState } from "react";
import axios from "../axios";
import { NavLink } from "react-router-dom";
import { DeleteForever } from "@mui/icons-material";
import { useSelector } from "react-redux";

export default function Main() {
  const userData = useSelector((state) => state.auth.data);
  const [data, setData] = useState();
  useEffect(() => {
    axios
      .get("/")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const removeTimeTable = (id) => {
    axios
      .delete(`/timetable/${id}`)
      .then(() => {
        axios
          .get("/")
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        alert(err.response.data[0].messsage);
      });
  };

  return (
    <main className="main">
      {!data?.length&&<h1>Расписаний нет</h1>}
      {data?.map((e) => (
        <div className="main-info-block w-bl">
          <NavLink to={e._id}>{e.date}</NavLink>
          {userData?.admin && <DeleteForever onClick={() => removeTimeTable(e._id)} />}
        </div>
      ))}
    </main>
  );
}
