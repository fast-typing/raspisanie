import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useParams } from "react-router-dom";
import data from "../data";

export default function Main() {
  const params = useParams();
  const [allLesons, setAllLesons] = useState([]);
  useEffect(() => {
    axios
      .get(`/${params.id}`)
      .then((res) => {
        setAllLesons(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const tables = allLesons?.groups?.map((item) => {
    return (
      <div className="table">
        <div className="lessons-of-group">
          <input type="text" disabled value={item.group} className="group-name" />
          {item.lessons.map((lesson) => (
            <div className="lesson">
              {lesson.title} <br /> {lesson.teacher} <br /> {lesson.cabinet}
            </div>
          ))}
        </div>
      </div>
    );
  });

  const pairs = data.map(item => {
    return <p>{item} пара</p>
  })

  return (
    <main>
      <h1>Расписние на {allLesons?.date}</h1>
      <div className='general-info-container'>  
        <div className="numbering"> {pairs} </div>
        <div className="tables-container">
          {tables}
        </div>
      </div>

    </main>
  );
}
