import React, { useEffect, useState } from "react";
import TimeTable from "../components/TimeTable";
import axios from "../axios";
import { NavLink } from "react-router-dom";
export default function Main() {
  const [data, setDate] = useState();
  useEffect(() => {
    axios
      .get("/")
      .then((res) => {
        setDate(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <main style={{ display: 'flex', flexDirection: "column" }}>
      {data?.map((e) => (
        <NavLink to={e._id}>{e.date}</NavLink>
      ))}
    </main>
  );
}
